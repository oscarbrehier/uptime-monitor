use std::{
    format,
    sync::Arc,
    time::{Duration, Instant},
    vec,
};

use reqwest::Client;
use serde::{Deserialize, Serialize};
use tokio::{sync::RwLock, time::interval};

#[derive(Debug, Clone, Serialize, Deserialize)]
struct Monitor {
    id: String,
    url: String,
}

#[derive(Debug, Serialize, Deserialize)]
struct PingResult {
    monitor_id: String,
    status_code: u16,
    latency_ms: u64,
}

// Thread safe state
type SharedMonitors = Arc<RwLock<Vec<Monitor>>>;

async fn ping(client: &Client, monitor: &Monitor) -> PingResult {
    let start = Instant::now();
    let response = client
        .get(monitor.url.clone())
        .timeout(Duration::from_secs(10))
        .send()
        .await;

    let latency_ms = start.elapsed().as_millis() as u64;

    match response {
        Ok(res) => PingResult {
            monitor_id: monitor.id.clone(),
            status_code: res.status().as_u16(),
            latency_ms,
        },
        Err(_) => PingResult {
            monitor_id: monitor.id.clone(),
            status_code: 0,
            latency_ms,
        },
    }
}

// Background sync loop that fetches active targets every 60s
fn spawn_sync_monitors_task(client: Arc<Client>, shared_monitors: SharedMonitors) {
    let gateway_url = std::env::var("GATEWAY_URL").expect("GATEWAY_URL must be set");
    let worker_api_key = std::env::var("WORKER_API_KEY").expect("WORKER_API_KEY must be set");

    tokio::spawn(async move {
        let mut ticker = interval(Duration::from_secs(60));

        loop {
            ticker.tick().await;

            let request = client
                .get(format!("{}/api/monitors/active", gateway_url))
                .header("Authorization", format!("Bearer {}", worker_api_key))
                .send()
                .await;

            match request {
                Ok(res) if res.status().is_success() => match res.json::<Vec<Monitor>>().await {
                    Ok(active_monitors) => {
                        println!("[SYNC] Updated active monitors: {}", active_monitors.len());

                        let mut lock = shared_monitors.write().await;
                        *lock = active_monitors;
                    }
                    Err(e) => eprintln!("[SYNC ERROR] Failed to parse monitors JSON: {e}"),
                },
                Ok(res) => eprintln!("[SYNC ERROR] Gateway returned status: {}", res.status()),
                Err(e) => eprintln!("[SYNC ERROR] HTTP request failed: {e}"),
            }
        }
    });
}

// Batch ingestion helper
async fn ingest_ping_results(client: &Client, results: &[PingResult]) -> anyhow::Result<()> {
    let gateway_url = std::env::var("GATEWAY_URL").expect("GATEWAY_URL must be set");
    let worker_api_key = std::env::var("WORKER_API_KEY").expect("WORKER_API_KEY must be set");

    let res = client
        .post(format!("{}/api/ingest", gateway_url))
        .header("Authorization", format!("Bearer {}", worker_api_key))
        .json(results)
        .send()
        .await?;

    if !res.status().is_success() {
        anyhow::bail!("Failed to ingest pings. HTTP {}", res.status());
    }

    Ok(())
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    dotenvy::dotenv().expect("Failed to load .env file");

    let client = Arc::new(Client::builder().build()?);

    let monitors: SharedMonitors = Arc::new(RwLock::new(Vec::new()));

    spawn_sync_monitors_task(Arc::clone(&client), Arc::clone(&monitors));

    let mut ping_ticker = interval(Duration::from_secs(10));

    loop {
        ping_ticker.tick().await;

        let active_monitors = {
            let lock = monitors.read().await;
            lock.clone()
        };

        let mut tasks = Vec::new();
        for monitor in active_monitors {
            let client_ref = Arc::clone(&client);
            tasks.push(tokio::spawn(
                async move { ping(&client_ref, &monitor).await },
            ));
        }

        let mut results = Vec::new();
        for task in tasks {
            if let Ok(result) = task.await {
                results.push(result);
            }
        }

        if !results.is_empty() {
            if let Err(e) = ingest_ping_results(&client, &results).await {
                eprintln!("[INGEST ERROR] {e}");
            }
        }
    }
}
