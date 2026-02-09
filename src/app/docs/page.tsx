"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

type Tab = "seller" | "buyer" | "agent";

const sellerCode = `import express from "express";
import { paymentMiddleware } from "x402-stacks";

const app = express();

app.use(paymentMiddleware(
  "YOUR_STACKS_ADDRESS",
  {
    "/api/summarize": {
      price: "0.005",
      token: "STX",
      network: "stacks-mainnet",
    },
    "/api/generate-image": {
      price: "0.00005",
      token: "sBTC",
      network: "stacks-mainnet",
    },
  }
));

app.post("/api/summarize", (req, res) => {
  const result = summarizeText(req.body.text);
  res.json({ summary: result });
});

app.listen(3001, () => {
  console.log("x402 protected server running on :3001");
});`;

const buyerCode = `import { createX402Client } from "x402-stacks/client";

const client = createX402Client({
  privateKey: process.env.STACKS_PRIVATE_KEY,
  network: "stacks-mainnet",
});

const response = await client.fetch(
  "https://neuraltext.stacksx402.com/api/summarize",
  {
    method: "POST",
    body: JSON.stringify({
      text: "Your long document here...",
      max_length: 200,
    }),
  }
);

const data = await response.json();
console.log(data.summary);`;

const agentCode = `import { createX402Client } from "x402-stacks/client";

const agentWallet = createX402Client({
  privateKey: process.env.AGENT_PRIVATE_KEY,
  network: "stacks-mainnet",
  maxBudget: "1.0",
  budgetToken: "STX",
});

async function researchTask(topic) {
  const summary = await agentWallet.fetch(
    "https://neuraltext.stacksx402.com/api/summarize",
    { method: "POST", body: JSON.stringify({ text: topic }) }
  );

  const translation = await agentWallet.fetch(
    "https://translatex.stacksx402.com/api/translate",
    {
      method: "POST",
      body: JSON.stringify({
        text: (await summary.json()).summary,
        source: "en",
        target: "es",
      }),
    }
  );

  return translation.json();
}

const result = await researchTask("Quantum computing advances...");`;

const registerCode = `const response = await fetch(
  "https://agentmarket.stacksx402.com/api/registry",
  {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: "My AI Service",
      description: "Description of your API",
      provider: "Your Company",
      providerAddress: "SP2J6ZY48GV1EZ...",
      category: "Text Analysis",
      baseUrl: "https://your-api.com",
      tags: ["NLP", "summarization"],
      endpoints: [
        {
          method: "POST",
          path: "/api/analyze",
          description: "Analyze text content",
          pricePerCall: "0.01",
          token: "STX",
        },
      ],
    }),
  }
);

const service = await response.json();
console.log("Registered:", service.id);`;

function CodeBlock({ code, filename }: { code: string; filename: string }) {
  return (
    <div style={{
      background: "#0a0a0a",
      border: "1px solid var(--border-primary)",
      borderRadius: "var(--radius-lg)",
      overflow: "hidden",
    }}>
      <div style={{
        padding: "8px 16px",
        borderBottom: "1px solid var(--border-primary)",
        display: "flex",
        alignItems: "center",
        gap: 8,
      }}>
        <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#ff5f57" }} />
        <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#ffbd2e" }} />
        <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#28ca42" }} />
        <span className="mono" style={{ fontSize: 12, color: "var(--text-tertiary)", marginLeft: 8 }}>
          {filename}
        </span>
      </div>
      <pre style={{
        padding: "16px 20px",
        fontSize: 13,
        lineHeight: 1.65,
        overflow: "auto",
        color: "#c9d1d9",
        fontFamily: "var(--font-mono)",
      }}>
        <code>{code}</code>
      </pre>
    </div>
  );
}

export default function DocsPage() {
  const [tab, setTab] = useState<Tab>("seller");

  const tabs: { key: Tab; label: string }[] = [
    { key: "seller", label: "Seller (Serve APIs)" },
    { key: "buyer", label: "Buyer (Consume APIs)" },
    { key: "agent", label: "AI Agent" },
  ];

  return (
    <>
      <Header />
      <main style={{ minHeight: "calc(100vh - 128px)" }}>
        <section style={{ padding: "48px 0 80px" }}>
          <div className="container" style={{ maxWidth: 860, margin: "0 auto", padding: "0 24px" }}>
            <h1 style={{ fontSize: 32, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 8 }}>
              Documentation
            </h1>
            <p style={{ fontSize: 16, color: "var(--text-secondary)", marginBottom: 40 }}>
              Integrate x402-stacks into your project in minutes.
            </p>

            <div style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border-primary)",
              borderRadius: "var(--radius-lg)",
              padding: 32,
              marginBottom: 32,
            }}>
              <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>Quick Start</h2>
              <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
                <div className="mono" style={{
                  padding: "10px 16px",
                  background: "var(--bg-tertiary)",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--border-primary)",
                  fontSize: 14,
                  color: "var(--accent)",
                  flex: 1,
                }}>
                  npm install x402-stacks
                </div>
              </div>
              <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.6 }}>
                The x402-stacks package provides everything you need to accept and make
                payments using the x402 protocol on Stacks. It supports settlement in
                STX, sBTC, and USDCx tokens.
              </p>
            </div>

            <div style={{ display: "flex", gap: 4, marginBottom: 24 }}>
              {tabs.map(t => (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  style={{
                    padding: "8px 16px",
                    borderRadius: "var(--radius-md)",
                    fontSize: 14,
                    fontWeight: 500,
                    background: tab === t.key ? "var(--accent)" : "transparent",
                    color: tab === t.key ? "white" : "var(--text-secondary)",
                    border: tab === t.key ? "1px solid var(--accent)" : "1px solid transparent",
                    transition: "all 0.2s",
                  }}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {tab === "seller" && (
              <div className="fade-in">
                <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>Monetize Your API</h3>
                <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: 20 }}>
                  Add the x402-stacks payment middleware to your Express.js server. Define
                  routes with pricing, and the middleware handles the entire 402 handshake
                  automatically. When a request arrives without payment, it returns HTTP 402
                  with payment details. When payment is included, it verifies and settles
                  before serving the response.
                </p>
                <CodeBlock code={sellerCode} filename="server.ts" />
              </div>
            )}

            {tab === "buyer" && (
              <div className="fade-in">
                <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>Consume Paid APIs</h3>
                <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: 20 }}>
                  Use the x402-stacks client to make requests to x402-protected endpoints.
                  The client automatically handles 402 responses, signs payment transactions,
                  and retries the request with the payment header.
                </p>
                <CodeBlock code={buyerCode} filename="client.ts" />
              </div>
            )}

            {tab === "agent" && (
              <div className="fade-in">
                <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>AI Agent Integration</h3>
                <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: 20 }}>
                  Give your AI agent a wallet with a budget. The agent can autonomously discover,
                  pay for, and consume marketplace services without human intervention. Set budget
                  limits to control spending.
                </p>
                <CodeBlock code={agentCode} filename="agent.ts" />
              </div>
            )}

            <div style={{
              marginTop: 40,
              background: "var(--bg-card)",
              border: "1px solid var(--border-primary)",
              borderRadius: "var(--radius-lg)",
              padding: 32,
            }}>
              <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>Register Your Service</h3>
              <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: 20 }}>
                List your API on the AgentMarket registry so buyers and agents can
                discover it. Use the REST API to register programmatically.
              </p>
              <CodeBlock code={registerCode} filename="register.ts" />
            </div>

            <div style={{
              marginTop: 32,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 16,
            }}>
              <a
                href="https://docs.x402stacks.xyz"
                target="_blank"
                rel="noopener"
                className="card"
                style={{ display: "block" }}
              >
                <h4 style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>x402-stacks Docs</h4>
                <p style={{ fontSize: 13, color: "var(--text-secondary)" }}>
                  Full protocol documentation and API reference.
                </p>
              </a>
              <a
                href="https://docs.stacks.co"
                target="_blank"
                rel="noopener"
                className="card"
                style={{ display: "block" }}
              >
                <h4 style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>Stacks Docs</h4>
                <p style={{ fontSize: 13, color: "var(--text-secondary)" }}>
                  Build apps and smart contracts on Bitcoin.
                </p>
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
