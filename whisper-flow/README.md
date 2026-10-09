# Whisper Flow

A free, local, push-to-talk speech-to-text tool for Linux with a **FastAPI backend** and a compact **floating HTML pill**. Press **Alt+P**, speak, and press **Alt+P** again. Recognized text is pasted into the field where your cursor was active.

## Architecture

- `whisper_flow.py`: local microphone capture, faster-whisper transcription, and cursor insertion.
- `server.py`: FastAPI API that controls recording and exposes status to the HTML UI.
- `static/index.html`: compact dark pill interface modeled on the reference control.
- `desktop.py`: starts FastAPI and opens the UI as an always-on-top desktop window using pywebview, with Chromium app-mode fallback.

## Install and run

```bash
cd /home/ubuntu/whisper-flow
./install.sh
. .venv/bin/activate
python desktop.py
```

The first run downloads the selected Whisper model from Hugging Face. After that, transcription is local. The widget opens at `http://127.0.0.1:8765/` if you want to open the HTML UI in a normal browser instead.

The default `base.en` is a practical quality/latency balance:

```bash
# Lowest latency
WHISPER_FLOW_MODEL=tiny.en python desktop.py

# Better accuracy, slower and more memory
WHISPER_FLOW_MODEL=small.en python desktop.py
```

## Controls and settings

- Click the button in the floating window, or press **Alt+P** globally.
- For reliable cursor insertion, click your target text field first, then use **Alt+P**. The app remembers the active X11 window and restores it before every paste.
- `WHISPER_FLOW_MODEL`: `tiny.en`, `base.en`, or `small.en`.
- `WHISPER_FLOW_CHUNK_SECONDS`: streaming chunk size; default `2.4`.
- `WHISPER_FLOW_LANGUAGE`: default `en`; set empty for auto-detection.
- `WHISPER_FLOW_DEVICE`: `cpu` by default; use `cuda` only after installing compatible CUDA/cuDNN libraries.
- `WHISPER_FLOW_PORT`: FastAPI port; default `8765`.

Example for multilingual auto-detection:

```bash
WHISPER_FLOW_MODEL=small WHISPER_FLOW_LANGUAGE= python desktop.py
```

## Important Linux note

Cursor insertion uses a persistent `xclip` selection owner plus `xdotool`, so the first version is designed for an X11 desktop. This fixes the common failure where the clipboard disappears before Ctrl+V. On Wayland, global key capture and synthetic paste are restricted by the compositor. The FastAPI/HTML UI still works, but universal global hotkey and paste support needs a compositor-native integration.

The sandbox used to build this project cannot access a user's physical microphone or desktop focus, so the final live test must be run on the target Linux desktop.

## Next upgrades

1. Tray icon and launch-at-login support.
2. Better cross-chunk deduplication and punctuation cleanup.
3. Native Windows/macOS/Linux packaging.
4. Wayland-native input integration.
