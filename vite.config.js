// vite.config.js  (use this if your project uses Vite instead of CRA)
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api/claude": {
        target:      "https://api.anthropic.com",
        changeOrigin: true,
        rewrite:     (path) => path.replace(/^\/api\/claude/, "/v1/messages"),
        configure: (proxy) => {
          proxy.on("proxyReq", (proxyReq) => {
            const apiKey = process.env.VITE_ANTHROPIC_KEY || "";
            proxyReq.setHeader("x-api-key",         apiKey);
            proxyReq.setHeader("anthropic-version", "2023-06-01");
            proxyReq.setHeader("anthropic-beta",    "web-search-2025-03-05");
            proxyReq.setHeader("content-type",      "application/json");
          });
        },
      },
    },
  },
});