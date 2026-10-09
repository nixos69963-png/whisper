import React, { useCallback, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './style.css';

const API = 'http://127.0.0.1:8765';

function MicrophoneIcon() {
  return (
    <svg viewBox="0 0 24 34" fill="none" aria-hidden="true">
      <rect x="7" y="1" width="10" height="20" rx="5" fill="currentColor" />
      <path d="M3 16v1a9 9 0 0 0 18 0v-1M12 26v6M8 32h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function App() {
  const [recording, setRecording] = useState(false);

  const refresh = useCallback(async () => {
    try {
      const response = await fetch(`${API}/api/status`);
      const data = await response.json();
      setRecording(Boolean(data.recording));
    } catch {
      // The Python service may still be starting.
    }
  }, []);

  const toggleRecording = useCallback(async () => {
    try {
      const response = await fetch(`${API}/api/toggle`, { method: 'POST' });
      const data = await response.json();
      setRecording(Boolean(data.recording));
    } catch {
      await refresh();
    }
  }, [refresh]);

  useEffect(() => {
    refresh();
    const timer = window.setInterval(refresh, 500);
    return () => window.clearInterval(timer);
  }, [refresh]);

  return (
    <main className={`flow ${recording ? 'recording' : ''}`} aria-label="Whisper Flow controls">
      <button className="stop-button" type="button" onClick={toggleRecording} title="Start or stop recording" aria-label="Start or stop recording" />
      <button className="microphone" type="button" onClick={toggleRecording} title="Microphone" aria-label="Microphone"><MicrophoneIcon /></button>
      <button className="waveform" type="button" onClick={toggleRecording} title="Start or stop recording" aria-label="Start or stop recording">
        <i className="bar" /><i className="bar" /><i className="bar" /><i className="bar" />
      </button>
      <button className="close-button" type="button" onClick={() => window.close()} title="Close" aria-label="Close">×</button>
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);
