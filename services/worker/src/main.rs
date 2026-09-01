use std::{sync::Arc, time::{Duration, Instant}, vec};

use reqwest::{Client};
use serde::{Deserialize, Serialize};

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

async fn ping(client: &Client, monitor: &Monitor) -> PingResult {

    let start = Instant::now();
    let response = client.get(monitor.url.clone()).timeout(Duration::from_secs(10)).send().await;

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
            latency_ms
        }
    }
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {

    let client = Arc::new(Client::builder().build()?);

    let monitors = vec![
        Monitor { id: "1".into(), url: "https://httpbin.org/status/200".into() },
        Monitor { id: "2".into(), url: "https://httpbin.org/status/500".into() },
        Monitor { id: "3".into(), url: "https://invalid-domain-that-does-not-exist.com".into() },
    ];
    
    let mut tasks = Vec::new();
    for monitor in monitors {

        let client_clone = Arc::clone(&client);
        tasks.push(tokio::spawn(async move {
            ping(&client_clone, &monitor).await
        }));

    }

    let mut results = Vec::new();
    for task in tasks {
        if let Ok(result) = task.await {
            results.push(result);
        }
    }

    println!("Ping Results: {:#?}", results);

    Ok(())

}