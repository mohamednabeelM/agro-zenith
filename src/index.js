// src/index.js — Entry point for Agro Zenith
import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import './i18n';

// Global CSS reset
const style = document.createElement("style");
style.textContent = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body, #root { height: 100%; }
  body {
    font-family: 'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif;
    -webkit-font-smoothing: antialiased;
    background: #f0f5f2;
  }
  ::-webkit-scrollbar        { width: 5px; height: 5px; }
  ::-webkit-scrollbar-track  { background: #f0f5f2; }
  ::-webkit-scrollbar-thumb  { background: #9cbfad; border-radius: 4px; }
  ::-webkit-scrollbar-thumb:hover { background: #1a6b32; }
  button:focus, input:focus, select:focus, textarea:focus { outline: none; }
  .leaflet-container { z-index: 0; }
  .leaflet-pane      { z-index: 0; }
`;
document.head.appendChild(style);

class AppErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("The application failed to render.", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <main style={{ padding: 32, color: "#1a2e1a", fontFamily: "system-ui, sans-serif" }}>
          <h1>Agro Zenith could not load</h1>
          <p style={{ margin: "12px 0 20px" }}>Please reload the page to try again.</p>
          <button onClick={() => window.location.reload()} style={{ padding: "10px 16px", cursor: "pointer" }}>
            Reload page
          </button>
        </main>
      );
    }

    return this.props.children;
  }
}

function Root() {
  useEffect(() => {
    document.getElementById("splash")?.classList.add("hidden");
  }, []);

  return (
    <AppErrorBoundary>
      <App />
    </AppErrorBoundary>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);