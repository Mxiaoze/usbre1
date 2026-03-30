use std::{fs, path::PathBuf};

use serde::{Deserialize, Serialize};
use tauri::{
    menu::MenuBuilder,
    tray::{MouseButton, MouseButtonState, TrayIconBuilder, TrayIconEvent},
    AppHandle, Manager, WindowEvent,
};

const SETTINGS_FILE_NAME: &str = "desktop-template-settings.json";
const TRAY_SHOW_ID: &str = "tray_show";
const TRAY_RESTART_ID: &str = "tray_restart";
const TRAY_QUIT_ID: &str = "tray_quit";

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
struct Settings {
    app: AppSettings,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
struct AppSettings {
    theme: String,
    language: String,
    show_window_on_startup: bool,
}

impl Default for Settings {
    fn default() -> Self {
        Self {
            app: AppSettings {
                theme: "light".into(),
                language: "zh".into(),
                show_window_on_startup: true,
            },
        }
    }
}

fn settings_path(app: &AppHandle) -> tauri::Result<PathBuf> {
    let dir = app.path().app_config_dir()?;
    fs::create_dir_all(&dir).map_err(tauri::Error::Io)?;
    Ok(dir.join(SETTINGS_FILE_NAME))
}

fn load_settings_from_disk(app: &AppHandle) -> Settings {
    let path = match settings_path(app) {
        Ok(path) => path,
        Err(_) => return Settings::default(),
    };

    let raw = match fs::read_to_string(path) {
        Ok(raw) => raw,
        Err(_) => return Settings::default(),
    };

    serde_json::from_str(&raw).unwrap_or_default()
}

fn save_settings_to_disk(app: &AppHandle, settings: &Settings) -> tauri::Result<Settings> {
    let path = settings_path(app)?;
    let raw = serde_json::to_string_pretty(settings)
        .map_err(|err| tauri::Error::Io(std::io::Error::other(err)))?;
    fs::write(path, raw).map_err(tauri::Error::Io)?;
    Ok(settings.clone())
}

fn show_main_window(app: &AppHandle) {
    if let Some(window) = app.get_webview_window("main") {
        let _ = window.unminimize();
        let _ = window.show();
        let _ = window.set_focus();
    }
}

fn create_tray(app: &AppHandle) -> tauri::Result<()> {
    let menu = MenuBuilder::new(app)
        .text(TRAY_SHOW_ID, "显示主窗口")
        .text(TRAY_RESTART_ID, "重启应用")
        .separator()
        .text(TRAY_QUIT_ID, "退出应用")
        .build()?;

    let mut tray = TrayIconBuilder::with_id("main-tray")
        .menu(&menu)
        .tooltip("桌面模板")
        .show_menu_on_left_click(false)
        .on_menu_event(|app, event| match event.id.as_ref() {
            TRAY_SHOW_ID => show_main_window(app),
            TRAY_RESTART_ID => app.request_restart(),
            TRAY_QUIT_ID => app.exit(0),
            _ => {}
        })
        .on_tray_icon_event(|tray, event| {
            if let TrayIconEvent::Click {
                button: MouseButton::Left,
                button_state: MouseButtonState::Up,
                ..
            } = event
            {
                show_main_window(tray.app_handle());
            }
        });

    if let Some(icon) = app.default_window_icon().cloned() {
        tray = tray.icon(icon);
    }

    tray.build(app)?;
    Ok(())
}

#[tauri::command]
fn load_settings(app: AppHandle) -> Settings {
    load_settings_from_disk(&app)
}

#[tauri::command]
fn save_settings(app: AppHandle, settings: Settings) -> tauri::Result<Settings> {
    save_settings_to_disk(&app, &settings)
}

#[tauri::command]
fn reset_settings(app: AppHandle) -> tauri::Result<Settings> {
    let settings = Settings::default();
    save_settings_to_disk(&app, &settings)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_single_instance::init(|app, _argv, _cwd| {
            show_main_window(app);
        }))
        .plugin(tauri_plugin_process::init())
        .setup(|app| {
            create_tray(&app.handle())?;

            let settings = load_settings_from_disk(&app.handle());
            if settings.app.show_window_on_startup {
                show_main_window(&app.handle());
            } else if let Some(window) = app.get_webview_window("main") {
                let _ = window.hide();
            }

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            load_settings,
            save_settings,
            reset_settings
        ])
        .on_window_event(|window, event| {
            if window.label() == "main" {
                if let WindowEvent::CloseRequested { api, .. } = event {
                    api.prevent_close();
                    let _ = window.hide();
                }
            }
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
