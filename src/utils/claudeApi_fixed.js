// src/utils/claudeApi.js
// No web search tool — Claude generates realistic TN mandi prices from training data.

const PROXY = "/api/claude";

export async function callClaude({ system, userMessage, maxTokens = 4000 }) {
  const body = {
    model:      "claude-sonnet-4-6",
    max_tokens: maxTokens,
    system,
    messages: [{ role: "user", content: userMessage }],
  };

  const res = await fetch(PROXY, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify(body),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const msg = data?.error?.message || `HTTP ${res.status}`;
    throw new Error(msg);
  }

  return data;
}

export function extractText(data) {
  return (data?.content || [])
    .filter(b => b.type === "text")
    .map(b => b.text)
    .join("");
}