#!/usr/bin/env python3
"""Launch FastAPI and show its HTML UI in a small floating desktop window."""
from __future__ import annotations

import os
import threading
import time
import urllib.request

import uvicorn

HOST = "127.0.0.1"
PORT = int(os.getenv("WHISPER_FLOW_PORT", "8765"))
URL = f"http://{HOST}:{PORT}/"


def serve() -> None:
    uvicorn.run("server:app", host=HOST, port=PORT, log_level="warning", reload=False)


def wait_for_server() -> None:
    for _ in range(100):
        try:
            urllib.request.urlopen(f"http://{HOST}:{PORT}/health", timeout=0.2)
            return
        except Exception:
            time.sleep(0.1)
    raise RuntimeError("FastAPI did not start")


def open_browser_fallback() -> None:
    import subprocess
    candidates = ["google-chrome", "chromium", "chromium-browser"]
    for browser in candidates:
        if subprocess.call(["which", browser], stdout=subprocess.DEVNULL) == 0:
            subprocess.Popen([browser, f"--app={URL}", "--window-size=340,300", "--always-on-top"])
            return
    print(f"FastAPI is running at {URL}; install pywebview or Chromium for the floating window.")
    threading.Event().wait()


def open_floating_window() -> None:
    try:
        import webview
        webview.create_window(
            "Whisper Flow",
            URL,
            width=250,
            height=72,
            min_size=(250, 72),
            resizable=False,
            on_top=True,
            frameless=True,
            easy_drag=True,
        )
        webview.start()
    except Exception:
        # Useful fallback when pywebview's native GTK/WebKit backend is not installed.
        open_browser_fallback()


if __name__ == "__main__":
    threading.Thread(target=serve, daemon=True, name="fastapi").start()
    wait_for_server()
    open_floating_window()
