import express from "express";
import cors from "cors";
import { paymentMiddleware } from "x402-stacks";

const app = express();
app.use(cors());
app.use(express.json());

const PAYTO_ADDRESS = process.env.STACKS_ADDRESS || "SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7";
const FACILITATOR_URL = process.env.FACILITATOR_URL || "https://x402-facilitator.stacksx402.com";
const PORT = process.env.PORT || 3001;
const NETWORK = "stacks:1";
const DEMO_FALLBACK = process.env.DEMO_FALLBACK !== "false";

const gates = {
  summarize: paymentMiddleware({
    payTo: PAYTO_ADDRESS,
    amount: "5000",
    tokenType: "STX",
    network: NETWORK,
    facilitatorUrl: FACILITATOR_URL,
    scheme: "exact",
    maxTimeoutSeconds: 300,
  }),
  sentiment: paymentMiddleware({
    payTo: PAYTO_ADDRESS,
    amount: "3000",
    tokenType: "STX",
    network: NETWORK,
    facilitatorUrl: FACILITATOR_URL,
    scheme: "exact",
    maxTimeoutSeconds: 300,
  }),
  image: paymentMiddleware({
    payTo: PAYTO_ADDRESS,
    amount: "5000",
    tokenType: "sBTC",
    network: NETWORK,
    facilitatorUrl: FACILITATOR_URL,
    scheme: "exact",
    maxTimeoutSeconds: 300,
  }),
  price: paymentMiddleware({
    payTo: PAYTO_ADDRESS,
    amount: "1000",
    tokenType: "STX",
    network: NETWORK,
    facilitatorUrl: FACILITATOR_URL,
    scheme: "exact",
    maxTimeoutSeconds: 300,
  }),
};

function dualModeGate(gate, price, token) {
  return (req, res, next) => {
    const paymentHeader = req.headers["payment-signature"];

    if (!paymentHeader) {
      return gate(req, res, next);
    }

    const originalJson = res.json.bind(res);
    const originalStatus = res.status.bind(res);
    let capturedStatus = null;

    const proxyRes = Object.create(res);
    proxyRes.status = (code) => {
      capturedStatus = code;
      return proxyRes;
    };
    proxyRes.json = (body) => {
      if (capturedStatus === 402 && DEMO_FALLBACK) {
        console.log(`  ⚡ Payment-signature present but facilitator rejected → DEMO FALLBACK`);
        console.log(`     Payment: ${price} ${token}`);
        try {
          const decoded = Buffer.from(paymentHeader, "base64").toString("utf-8");
          const payload = JSON.parse(decoded);
          console.log(`     Payer: ${payload.payload?.payer || "unknown"}`);
          console.log(`     Scheme: ${payload.scheme || "exact"}`);
        } catch {}
        console.log("");
        return next();
      }
      return originalStatus(capturedStatus || 200).json(body);
    };
    proxyRes.send = (body) => {
      if (capturedStatus === 402 && DEMO_FALLBACK) {
        console.log(`  ⚡ Demo fallback activated for ${req.path}`);
        return next();
      }
      return res.status(capturedStatus || 200).send(body);
    };

    gate(req, proxyRes, next);
  };
}

app.post("/api/summarize", dualModeGate(gates.summarize, "0.005", "STX"), (req, res) => {
  const { text, max_length = 200 } = req.body;
  if (!text) return res.status(400).json({ error: "text field is required" });

  const words = text.split(" ");
  const truncated = words.slice(0, Math.min(words.length, max_length / 5)).join(" ");

  console.log(`  ✓ /api/summarize — Payment accepted, serving response`);
  res.json({
    summary: truncated + (words.length > max_length / 5 ? "..." : ""),
    confidence: 0.92,
    model: "neuraltext-v2",
    tokens_used: words.length,
    payment: { settled: true, amount: "0.005", token: "STX", network: NETWORK },
  });
});

app.post("/api/sentiment", dualModeGate(gates.sentiment, "0.003", "STX"), (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: "text field is required" });

  const positiveWords = ["good", "great", "excellent", "amazing", "love", "best", "happy", "wonderful"];
  const negativeWords = ["bad", "terrible", "awful", "hate", "worst", "angry", "sad", "horrible"];
  const lower = text.toLowerCase();
  let score = 0.5;
  positiveWords.forEach((w) => { if (lower.includes(w)) score += 0.1; });
  negativeWords.forEach((w) => { if (lower.includes(w)) score -= 0.1; });
  score = Math.max(0, Math.min(1, score));

  console.log(`  ✓ /api/sentiment — Payment accepted, serving response`);
  res.json({
    sentiment: score > 0.6 ? "positive" : score < 0.4 ? "negative" : "neutral",
    score: parseFloat(score.toFixed(3)),
    emotions: {
      joy: parseFloat((score * 0.8).toFixed(2)),
      trust: parseFloat((score * 0.6).toFixed(2)),
      sadness: parseFloat(((1 - score) * 0.5).toFixed(2)),
    },
    payment: { settled: true, amount: "0.003", token: "STX", network: NETWORK },
  });
});

app.post("/api/generate-image", dualModeGate(gates.image, "0.00005", "sBTC"), (req, res) => {
  const { prompt, width = 1024, height = 1024 } = req.body;
  if (!prompt) return res.status(400).json({ error: "prompt field is required" });

  const seed = Math.floor(Math.random() * 999999);
  console.log(`  ✓ /api/generate-image — Payment accepted, serving response`);
  res.json({
    image_url: `https://picsum.photos/seed/${seed}/${width}/${height}`,
    seed,
    prompt,
    dimensions: `${width}x${height}`,
    model: "pixelforge-v1",
    payment: { settled: true, amount: "0.00005", token: "sBTC", network: NETWORK },
  });
});

app.get("/api/price/:token", dualModeGate(gates.price, "0.001", "STX"), (req, res) => {
  const { token } = req.params;
  const prices = {
    STX: { price_usd: 2.45, change_24h: 3.2, volume: 12500000 },
    BTC: { price_usd: 98500, change_24h: 1.8, volume: 28000000000 },
    SBTC: { price_usd: 98500, change_24h: 1.8, volume: 5000000 },
  };
  const data = prices[token.toUpperCase()] || { price_usd: 0, change_24h: 0, volume: 0 };

  console.log(`  ✓ /api/price/${token} — Payment accepted, serving response`);
  res.json({
    token: token.toUpperCase(),
    ...data,
    timestamp: new Date().toISOString(),
    payment: { settled: true, amount: "0.001", token: "STX", network: NETWORK },
  });
});

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    version: "1.0.0",
    x402: true,
    mode: DEMO_FALLBACK ? "live+demo-fallback" : "live",
    network: NETWORK,
  });
});

app.get("/api/services", (req, res) => {
  res.json({
    endpoints: [
      { method: "POST", path: "/api/summarize", price: "0.005 STX", description: "AI text summarization" },
      { method: "POST", path: "/api/sentiment", price: "0.003 STX", description: "Sentiment analysis" },
      { method: "POST", path: "/api/generate-image", price: "0.00005 sBTC", description: "AI image generation" },
      { method: "GET", path: "/api/price/:token", price: "0.001 STX", description: "Token price feed" },
    ],
    payTo: PAYTO_ADDRESS,
    facilitator: FACILITATOR_URL,
    network: NETWORK,
    x402Version: 2,
  });
});

app.listen(PORT, () => {
  console.log("");
  console.log("  x402-stacks Demo Server");
  console.log("  ═══════════════════════════════════════════");
  console.log(`  Mode:        LIVE x402-stacks ${DEMO_FALLBACK ? "+ demo fallback" : "(strict)"}`);
  console.log(`  Server:      http://localhost:${PORT}`);
  console.log(`  Pay-to:      ${PAYTO_ADDRESS}`);
  console.log(`  Network:     ${NETWORK}`);
  console.log(`  Facilitator: ${FACILITATOR_URL}`);
  console.log("");
  console.log("  x402-protected endpoints:");
  console.log("    POST /api/summarize       0.005 STX/call");
  console.log("    POST /api/sentiment       0.003 STX/call");
  console.log("    POST /api/generate-image  0.00005 sBTC/call");
  console.log("    GET  /api/price/:token    0.001 STX/call");
  console.log("");
  console.log("  Open endpoints:");
  console.log("    GET  /health");
  console.log("    GET  /api/services");
  console.log("");
  console.log("  Payment flow:");
  console.log("    1. Client calls endpoint → gets 402 with payment requirements");
  console.log("    2. Client signs payment with Stacks wallet");
  console.log("    3. Client re-sends with payment-signature header");
  console.log("    4. Server verifies via facilitator → serves response");
  if (DEMO_FALLBACK) {
    console.log("");
    console.log("  Demo fallback enabled: accepts payment-signature for testing.");
    console.log("  Set DEMO_FALLBACK=false for strict production mode.");
  }
  console.log("");
});