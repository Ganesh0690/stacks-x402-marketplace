# x402 Agent Marketplace

> **AI Agent Marketplace with pay-per-call APIs powered by x402-stacks on Bitcoin**

An open marketplace where developers list AI-powered APIs behind x402 paywalls. AI agents autonomously discover, pay for, and consume services using STX, sBTC, and USDCx tokens via the HTTP 402 protocol — settled on Stacks (Bitcoin L2).

Built for the **x402 Stacks Challenge 2026**.

---

## 🎯 Problem

AI agents are everywhere, but there's no standard way for them to pay for services. Every API needs its own API key, billing account, and subscription. That doesn't scale in a world where thousands of agents call thousands of APIs.

## 💡 Solution

x402 turns payments into an HTTP header — just like authentication. Our marketplace brings this to life on Stacks:

1. **Seller** registers an AI API and wraps it with `x402-stacks` middleware
2. **Agent** discovers the service via the registry API
3. **Agent** calls the endpoint → gets `402 Payment Required` with price in STX/sBTC
4. **Agent** signs a Stacks transaction → re-sends with `payment-signature` header
5. **Server** verifies via facilitator → serves the response

No API keys. No subscriptions. No middlemen. Just HTTP and Bitcoin.

---

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    MARKETPLACE (Next.js)                 │
│  ┌──────────┐ ┌──────────┐ ┌──────┐ ┌─────────────┐   │
│  │ Landing  │ │Marketplace│ │ Docs │ │  Dashboard  │   │
│  │  Page    │ │  Browse   │ │Guide │ │  Register   │   │
│  └──────────┘ └──────────┘ └──────┘ └─────────────┘   │
│                                                         │
│  ┌─────────────── REST API ──────────────────────┐     │
│  │ GET /api/services    POST /api/registry        │     │
│  │ GET /api/services/:id GET /api/stats           │     │
│  └────────────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│              DEMO SERVER (Express + x402-stacks)         │
│                                                          │
│  ┌─ x402-stacks paymentMiddleware (LIVE) ──────────┐    │
│  │  POST /api/summarize       0.005 STX/call       │    │
│  │  POST /api/sentiment       0.003 STX/call       │    │
│  │  POST /api/generate-image  0.00005 sBTC/call    │    │
│  │  GET  /api/price/:token    0.001 STX/call       │    │
│  └──────────────────────────────────────────────────┘    │
│                                                          │
│  Payment Flow:                                           │
│  Request → 402 + requirements → Sign → Pay → 200 + data │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│              PAYMENT CLIENT (Node.js + x402-stacks)      │
│                                                          │
│  1. Discover services    (GET /api/services)             │
│  2. Call API             (gets 402 Payment Required)     │
│  3. Sign payment         (Stacks wallet / keypair)       │
│  4. Send with header     (payment-signature)             │
│  5. Receive response     (200 OK + data)                 │
└─────────────────────────────────────────────────────────┘
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** v18+ ([download](https://nodejs.org))
- **npm** (comes with Node.js)

### 1. Clone & Install

```bash
git clone https://github.com/YOUR_USERNAME/x402-agent-marketplace.git
cd x402-agent-marketplace

# Install frontend dependencies
npm install

# Install demo server dependencies
cd demo-server
npm install
cd ..
```

### 2. Start the Servers

**Terminal 1 — Demo Server (x402-protected APIs):**
```bash
cd demo-server
npm start
```

Output:
```
x402-stacks Demo Server
═══════════════════════════════════════════
Mode:        LIVE x402-stacks + demo fallback
Server:      http://localhost:3001
Network:     stacks:1
Facilitator: https://x402-facilitator.stacksx402.com
```

**Terminal 2 — Marketplace Frontend:**
```bash
npm run dev
```

Output:
```
Ready on http://localhost:3000
```

### 3. Run the Payment Client

**Terminal 3 — Full x402 payment flow:**
```bash
cd demo-server
node client.js
```

This runs the complete end-to-end flow:
```
Step 0: Wallet Setup          → Generates Stacks keypair
Step 1: Service Discovery     → Finds 4 AI endpoints
Step 2: Call Without Payment   → Gets 402 Payment Required (x402 v2)
Step 3: Sign Payment           → Creates payment-signature header
Step 4: Send With Payment      → Gets 200 OK + API data
Step 5: Test All Endpoints     → Confirms 402 on every endpoint
```

### 4. Manual Testing

```bash
# Get 402 Payment Required (real x402-stacks v2 response)
curl -X POST http://localhost:3001/api/summarize \
  -H "Content-Type: application/json" \
  -d '{"text": "Hello world"}'

# Open endpoints (no payment required)
curl http://localhost:3001/health
curl http://localhost:3001/api/services

# Marketplace API
curl http://localhost:3000/api/services
curl http://localhost:3000/api/stats
```

**PowerShell (Windows):**
```powershell
Invoke-RestMethod -Method POST -Uri "http://localhost:3001/api/summarize" -ContentType "application/json" -Body '{"text": "Hello world"}'
Invoke-RestMethod -Uri "http://localhost:3001/health"
Invoke-RestMethod -Uri "http://localhost:3001/api/services"
```

---

## 📁 Project Structure

```
x402-agent-marketplace/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── services/
│   │   │   │   ├── route.ts          # GET - List/search services
│   │   │   │   └── [id]/route.ts     # GET - Single service details
│   │   │   ├── registry/route.ts     # POST - Register new service
│   │   │   └── stats/route.ts        # GET - Marketplace statistics
│   │   ├── marketplace/page.tsx      # Browse & discover services
│   │   ├── docs/page.tsx             # Integration guide (Seller/Buyer/Agent)
│   │   ├── dashboard/page.tsx        # Provider dashboard & registration
│   │   ├── page.tsx                  # Landing page
│   │   ├── layout.tsx                # Root layout with metadata
│   │   └── globals.css               # Dark theme CSS
│   ├── components/
│   │   ├── Header.tsx                # Navigation header
│   │   ├── Footer.tsx                # Footer
│   │   └── ServiceCard.tsx           # Reusable service card
│   └── lib/
│       └── store.ts                  # In-memory data store & types
├── demo-server/
│   ├── server.js                     # Express + x402-stacks middleware (LIVE)
│   ├── client.js                     # Wallet-integrated payment client
│   ├── package.json                  # Server dependencies
│   └── .env.example                  # Environment variables
├── package.json                      # Frontend dependencies
├── tsconfig.json                     # TypeScript config
├── next.config.js                    # Next.js config
├── .gitignore                        # Git ignore rules
├── .env.example                      # Frontend env template
└── README.md                         # This file
```

---

## ⚡ x402-stacks Integration

### Server Side (5 lines to paywall any API)

```javascript
import { paymentMiddleware } from "x402-stacks";

const gate = paymentMiddleware({
  payTo: "SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7",
  amount: "5000",        // 5000 microSTX = 0.005 STX
  tokenType: "STX",
  network: "stacks:1",   // CAIP-2 format
  facilitatorUrl: "https://x402-facilitator.stacksx402.com",
  scheme: "exact",
});

app.post("/api/summarize", gate, (req, res) => {
  res.json({ summary: "..." });
});
```

### Client Side (automated payment flow)

```javascript
import { generateKeypair, privateKeyToAccountV2 } from "x402-stacks";

// 1. Call endpoint
const res = await fetch("http://localhost:3001/api/summarize", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ text: "Your text here" }),
});
// res.status === 402 → Payment Required

// 2. Parse payment requirements
const { accepts } = await res.json();
// accepts[0] = { scheme: "exact", network: "stacks:1", amount: "5000", asset: "STX", payTo: "SP..." }

// 3. Sign payment with Stacks wallet
const payload = { /* signed payment */ };
const signature = Buffer.from(JSON.stringify(payload)).toString("base64");

// 4. Re-send with payment header
const paid = await fetch("http://localhost:3001/api/summarize", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "payment-signature": signature,
  },
  body: JSON.stringify({ text: "Your text here" }),
});
// paid.status === 200 → Data returned!
```

### 402 Response (real output from x402-stacks v2)

```json
{
  "x402Version": 2,
  "resource": { "url": "http://localhost:3001/api/summarize" },
  "accepts": [
    {
      "scheme": "exact",
      "network": "stacks:1",
      "amount": "5000",
      "asset": "STX",
      "payTo": "SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7",
      "maxTimeoutSeconds": 300
    }
  ]
}
```

---

## 🌐 API Reference

### Marketplace API (port 3000)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/services` | List all services (supports `?q=` search, `?category=` filter) |
| GET | `/api/services/:id` | Get single service details |
| POST | `/api/registry` | Register a new service |
| GET | `/api/stats` | Marketplace statistics |

### Demo Server API (port 3001)

| Method | Endpoint | Price | Token | Description |
|--------|----------|-------|-------|-------------|
| POST | `/api/summarize` | 0.005 | STX | AI text summarization |
| POST | `/api/sentiment` | 0.003 | STX | Sentiment analysis |
| POST | `/api/generate-image` | 0.00005 | sBTC | AI image generation |
| GET | `/api/price/:token` | 0.001 | STX | Token price feed |
| GET | `/health` | Free | — | Server health check |
| GET | `/api/services` | Free | — | List protected endpoints |

---

## 🔧 Environment Variables

### Frontend (.env)
```bash
# No required env variables — works out of the box
```

### Demo Server (demo-server/.env)
```bash
# Stacks address receiving payments
STACKS_ADDRESS=SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7

# x402-stacks facilitator URL
FACILITATOR_URL=https://x402-facilitator.stacksx402.com

# Server port
PORT=3001

# Demo fallback (set to "false" for strict production mode)
DEMO_FALLBACK=true
```

### Payment Client
```bash
# Optional: Stacks private key for real wallet signing
# Without this, client generates a demo keypair
STACKS_PRIVATE_KEY=your_hex_private_key_here

# Demo server URL
SERVER_URL=http://localhost:3001
```

---

## 🎨 Frontend Pages

| Page | Route | Features |
|------|-------|----------|
| **Landing** | `/` | Hero section, stats bar, how it works, token showcase (STX/sBTC/USDCx), code demo, featured services |
| **Marketplace** | `/marketplace` | Browse, search, filter services by category; click for detail modal with endpoint specs |
| **Docs** | `/docs` | Integration guides with tabbed code examples (Seller / Buyer / Agent) |
| **Dashboard** | `/dashboard` | Register new services, view registered APIs with stats |

---

## 🪙 Supported Tokens

| Token | Type | Use Case |
|-------|------|----------|
| **STX** | Native Stacks token | General API payments |
| **sBTC** | Bitcoin-backed on Stacks | High-value API calls |
| **USDCx** | Stablecoin on Stacks | Price-stable payments |


## 🛠 Tech Stack

- **Frontend:** Next.js 14, TypeScript, Custom CSS (dark theme)
- **Backend:** Next.js API Routes, Express.js
- **Payments:** x402-stacks (v2 protocol)
- **Blockchain:** Stacks (Bitcoin L2)
- **Tokens:** STX, sBTC, USDCx

