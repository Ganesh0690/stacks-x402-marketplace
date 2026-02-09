"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

type Tab = "seller" | "buyer" | "agent";

const sellerCode = `import express from "express";
import { paymentMiddleware } from "x402-stacks";

const app = express();
app.use(express.json());

const summarizeGate = paymentMiddleware({
  payTo: "SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7",
  amount: "5000",           // 5000 microSTX = 0.005 STX
  tokenType: "STX",
  network: "stacks:1",      // CAIP-2 format
  facilitatorUrl: "https://x402-facilitator.stacksx402.com",
  scheme: "exact",
  maxTimeoutSeconds: 300,
});

const imageGate = paymentMiddleware({
  payTo: "SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7",
  amount: "5000",
  tokenType: "sBTC",
  network: "stacks:1",
  facilitatorUrl: "https://x402-facilitator.stacksx402.com",
  scheme: "exact",
});

app.post("/api/summarize", summarizeGate, (req, res) => {
  const result = summarizeText(req.body.text);
  res.json({ summary: result });
});

app.post("/api/generate-image", imageGate, (req, res) => {
  const image = generateImage(req.body.prompt);
  res.json({ image_url: image });
});

app.listen(3001, () => {
  console.log("x402-protected server running on :3001");
});`;

const buyerCode = `import { generateKeypair } from "x402-stacks";

// Step 1: Call the endpoint (no payment)
const res = await fetch("http://localhost:3001/api/summarize", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ text: "Your long document here..." }),
});

// Step 2: Parse 402 Payment Required response
// res.status === 402
const { accepts } = await res.json();
// accepts[0] = {
//   scheme: "exact",
//   network: "stacks:1",
//   amount: "5000",
//   asset: "STX",
//   payTo: "SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7"
// }

// Step 3: Sign payment with your Stacks wallet
const requirement = accepts[0];
const payload = {
  x402Version: 2,
  scheme: requirement.scheme,
  network: requirement.network,
  payload: {
    amount: requirement.amount,
    asset: requirement.asset,
    payTo: requirement.payTo,
    payer: "YOUR_STACKS_ADDRESS",
  },
};
const signature = Buffer.from(
  JSON.stringify(payload)
).toString("base64");

// Step 4: Re-send with payment-signature header
const paid = await fetch("http://localhost:3001/api/summarize", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "payment-signature": signature,
  },
  body: JSON.stringify({ text: "Your long document here..." }),
});

// Step 5: Receive the data (200 OK)
const data = await paid.json();
console.log(data.summary);`;

const agentCode = `import { generateKeypair } from "x402-stacks";

// Agent generates its own wallet
const wallet = generateKeypair();
console.log("Agent address:", wallet.address);

// Autonomous function: discover → pay → consume
async function callPaidAPI(endpoint, body) {
  // 1. Call without payment
  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (res.status !== 402) return res.json();

  // 2. Parse payment requirements
  const { accepts } = await res.json();
  const req = accepts[0];

  // 3. Sign payment
  const payload = {
    x402Version: 2,
    scheme: req.scheme,
    network: req.network,
    payload: {
      amount: req.amount,
      asset: req.asset,
      payTo: req.payTo,
      payer: wallet.address,
    },
  };
  const sig = Buffer.from(
    JSON.stringify(payload)
  ).toString("base64");

  // 4. Re-send with payment
  const paid = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "payment-signature": sig,
    },
    body: JSON.stringify(body),
  });

  return paid.json();
}

// Agent autonomously chains multiple API calls
async function researchTask(topic) {
  const summary = await callPaidAPI(
    "http://localhost:3001/api/summarize",
    { text: topic }
  );

  const sentiment = await callPaidAPI(
    "http://localhost:3001/api/sentiment",
    { text: summary.summary }
  );

  return { summary, sentiment };
}

const result = await researchTask("Quantum computing advances...");
console.log(result);`;

const registerCode = `const response = await fetch(
  "https://stacks-x402-marketplace.vercel.app/api/registry",
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
                STX, sBTC, and USDCx tokens. Each endpoint gets its own payment gate
                with independent pricing and token selection.
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
                  Add the x402-stacks paymentMiddleware to your Express.js server. Each
                  endpoint gets its own payment gate with a config object specifying the
                  pay-to address, amount in micro-units, token type, and network in CAIP-2
                  format. The middleware returns HTTP 402 with payment details when no
                  payment header is present, and verifies payments via the facilitator
                  when a payment-signature header is included.
                </p>
                <CodeBlock code={sellerCode} filename="server.js" />
              </div>
            )}

            {tab === "buyer" && (
              <div className="fade-in">
                <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>Consume Paid APIs</h3>
                <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: 20 }}>
                  Call any x402-protected endpoint. The server responds with HTTP 402 and
                  payment requirements (amount, token, network, pay-to address). Parse the
                  requirements, sign a payment payload with your Stacks wallet, encode it
                  as base64, and re-send the request with the payment-signature header.
                  The server verifies and settles before returning your data.
                </p>
                <CodeBlock code={buyerCode} filename="client.js" />
              </div>
            )}

            {tab === "agent" && (
              <div className="fade-in">
                <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>AI Agent Integration</h3>
                <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: 20 }}>
                  Give your AI agent its own Stacks wallet using generateKeypair(). The
                  agent autonomously discovers endpoints, handles 402 responses, signs
                  payments, and consumes services — no human in the loop. Chain multiple
                  paid API calls together for complex workflows.
                </p>
                <CodeBlock code={agentCode} filename="agent.js" />
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
                List your API on the marketplace registry so buyers and agents can
                discover it. Use the REST API to register programmatically.
              </p>
              <CodeBlock code={registerCode} filename="register.js" />
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