// src/setupProxy.js
const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/api/claude",
    createProxyMiddleware({
      target:       "https://api.anthropic.com",
      changeOrigin: true,
      pathRewrite:  { "^/api/claude": "/v1/messages" },
      onProxyReq: (proxyReq) => {
        const apiKey = process.env.REACT_APP_ANTHROPIC_KEY || "";
        proxyReq.setHeader("x-api-key",         apiKey);
        proxyReq.setHeader("anthropic-version", "2023-06-01");
        proxyReq.setHeader("content-type",      "application/json");
        // No anthropic-beta header — not using web search
      },
      onError: (err, _req, res) => {
        console.error("[Proxy Error]", err.message);
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: err.message }));
      },
    })
  );
};