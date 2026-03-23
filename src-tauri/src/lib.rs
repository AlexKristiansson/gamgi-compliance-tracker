use tauri::Manager;

/// Hämtar RSS/Atom-XML från en URL och returnerar rå XML-text.
/// Körs i Rust med reqwest — kringgår CORS helt.
#[tauri::command]
async fn fetch_rss(url: String) -> Result<String, String> {
  let client = reqwest::Client::builder()
    .user_agent("GamgiCompliance/1.0 (compliance tracker)")
    .timeout(std::time::Duration::from_secs(15))
    .build()
    .map_err(|e| e.to_string())?;

  let response = client
    .get(&url)
    .header("Accept", "application/rss+xml, application/atom+xml, application/xml, text/xml, */*")
    .send()
    .await
    .map_err(|e| format!("Nätverksfel: {}", e))?;

  if !response.status().is_success() {
    return Err(format!("HTTP {}", response.status().as_u16()));
  }

  response.text().await.map_err(|e| format!("Läsfel: {}", e))
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  tauri::Builder::default()
    .plugin(tauri_plugin_http::init())
    .invoke_handler(tauri::generate_handler![fetch_rss])
    .setup(|app| {
      #[cfg(debug_assertions)]
      app.handle().plugin(
        tauri_plugin_log::Builder::default()
          .level(log::LevelFilter::Info)
          .build(),
      )?;
      // Öppna WebInspector i release för felsökning (tas bort efter fix)
      if let Some(win) = app.get_webview_window("main") {
        win.open_devtools();
      }
      Ok(())
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
