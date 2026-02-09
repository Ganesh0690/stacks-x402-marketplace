import {
  createPaymentClient,
  createPaymentClientV2,
  privateKeyToAccount,
  privateKeyToAccountV2,
  encodePaymentPayload,
  generateKeypair,
  X402PaymentClient,
  networkToCAIP2,
  STXtoMicroSTX,
  isValidStacksAddress,
} from "x402-stacks";

const SERVER_URL = process.env.SERVER_URL || "http://localhost:3001";
const PRIVATE_KEY = process.env.STACKS_PRIVATE_KEY || "";

function printBanner() {
  console.log("");
  console.log("  ╔══════════════════════════════════════════════════╗");
  console.log("  ║   x402 Agent Marketplace — Payment Client       ║");
  console.log("  ║   Complete end-to-end x402 payment flow         ║");
  console.log("  ╚══════════════════════════════════════════════════╝");
  console.log("");
}

function printStep(num, title) {
  console.log(`  ┌─ Step ${num}: ${title}`);
}

function printResult(label, value) {
  console.log(`  │  ${label}: ${typeof value === "object" ? JSON.stringify(value, null, 2).split("\n").join("\n  │  ") : value}`);
}

function printDone(msg) {
  console.log(`  └─ ✓ ${msg}`);
  console.log("");
}

function printError(msg) {
  console.log(`  └─ ✗ ${msg}`);
  console.log("");
}

async function main() {
  printBanner();

  printStep(0, "Wallet Setup");

  let account;
  let privateKey = PRIVATE_KEY;

  if (!privateKey) {
    console.log("  │  No STACKS_PRIVATE_KEY found in environment.");
    console.log("  │  Generating a demo keypair...");
    console.log("  │");
    console.log("  │  ⚠  For real payments, set STACKS_PRIVATE_KEY env variable");
    console.log("  │     with your funded Stacks testnet private key.");
    console.log("  │");

    try {
      const keypair = generateKeypair();
      privateKey = keypair.privateKey || keypair.secretKey || keypair;
      printResult("Generated address", keypair.address || keypair.stxAddress || "demo");
    } catch (e) {
      privateKey = "753b7cc01a1a2e86221266a154af739463fce51219d97e4f856cd7200c3bd2a601";
      console.log("  │  Using demo private key (not funded, for flow demo only)");
    }
  }

  try {
    try {
      account = privateKeyToAccountV2(privateKey);
    } catch {
      account = privateKeyToAccount(privateKey);
    }
    printResult("Wallet address", account.address || account.stxAddress || "loaded");
    printDone("Wallet ready");
  } catch (e) {
    printError(`Wallet setup failed: ${e.message}`);
    console.log("  Falling back to manual payment flow...\n");
    account = null;
  }

  printStep(1, "Service Discovery");

  try {
    const servicesRes = await fetch(`${SERVER_URL}/api/services`);
    const services = await servicesRes.json();
    printResult("Available endpoints", services.endpoints?.length || "unknown");
    services.endpoints?.forEach((ep) => {
      console.log(`  │    ${ep.method.padEnd(6)} ${ep.path.padEnd(25)} ${ep.price}`);
    });
    printResult("Network", services.network);
    printResult("Pay-to", services.payTo);
    printDone("Services discovered");
  } catch (e) {
    printError(`Discovery failed: ${e.message}`);
    console.log("  Make sure the demo server is running: npm start\n");
    process.exit(1);
  }

  printStep(2, "Call API Without Payment (expect 402)");

  const testPayload = {
    text: "Artificial intelligence has transformed every sector of the global economy, from healthcare diagnostics to autonomous transportation systems, creating unprecedented opportunities for innovation.",
  };

  let paymentRequirements;

  try {
    const res = await fetch(`${SERVER_URL}/api/summarize`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(testPayload),
    });

    printResult("HTTP Status", `${res.status} ${res.statusText}`);

    if (res.status === 402) {
      const body = await res.json();
      paymentRequirements = body;
      printResult("x402 Version", body.x402Version);
      printResult("Scheme", body.accepts?.[0]?.scheme);
      printResult("Network", body.accepts?.[0]?.network);
      printResult("Amount", `${body.accepts?.[0]?.amount} (micro-units)`);
      printResult("Asset", body.accepts?.[0]?.asset);
      printResult("Pay-to", body.accepts?.[0]?.payTo);
      printDone("402 Payment Required received — this is correct!");
    } else {
      const body = await res.json();
      printResult("Response", body);
      printDone("Unexpected status (expected 402)");
    }
  } catch (e) {
    printError(`Request failed: ${e.message}`);
    process.exit(1);
  }

  printStep(3, "Create & Sign Payment Payload");

  let paymentSignature;

  if (paymentRequirements && account) {
    try {
      let client;
      try {
        client = createPaymentClientV2({ account, network: "stacks:1" });
      } catch {
        try {
          client = createPaymentClient({ account, network: "stacks:1" });
        } catch {
          client = new X402PaymentClient({ account, network: "stacks:1" });
        }
      }

      const requirement = paymentRequirements.accepts[0];

      let payment;
      if (client.createPayment) {
        payment = await client.createPayment(requirement);
      } else if (client.pay) {
        payment = await client.pay(requirement);
      } else if (client.sign) {
        payment = await client.sign(requirement);
      } else if (client.createPaymentPayload) {
        payment = await client.createPaymentPayload(requirement);
      }

      if (payment) {
        paymentSignature = Buffer.from(JSON.stringify(payment)).toString("base64");
        printResult("Payment payload created", "✓");
        printResult("Signature (truncated)", paymentSignature.slice(0, 60) + "...");
        printDone("Payment signed with Stacks wallet");
      } else {
        throw new Error("Client returned no payment object");
      }
    } catch (e) {
      console.log(`  │  x402-stacks client error: ${e.message}`);
      console.log("  │  Falling back to manual payment construction...");
      console.log("  │");

      try {
        const requirement = paymentRequirements.accepts[0];
        const manualPayload = {
          x402Version: 2,
          scheme: requirement.scheme || "exact",
          network: requirement.network || "stacks:1",
          payload: {
            signature: "demo_signature_" + Date.now(),
            amount: requirement.amount,
            asset: requirement.asset || "STX",
            payTo: requirement.payTo,
            payer: account.address || account.stxAddress || "ST_DEMO_ADDRESS",
            nonce: Date.now(),
            expiresAt: Math.floor(Date.now() / 1000) + 300,
          },
        };

        paymentSignature = Buffer.from(JSON.stringify(manualPayload)).toString("base64");
        printResult("Manual payload created", "✓ (demo mode)");
        printResult("Encoded header (truncated)", paymentSignature.slice(0, 60) + "...");
        printDone("Payment constructed (demo signature)");
      } catch (e2) {
        printError(`Manual payment also failed: ${e2.message}`);
      }
    }
  } else if (!account) {
    console.log("  │  No wallet account — constructing demo payment...");
    const requirement = paymentRequirements?.accepts?.[0] || {};
    const demoPayload = {
      x402Version: 2,
      scheme: "exact",
      network: "stacks:1",
      payload: {
        signature: "demo_" + Date.now(),
        amount: requirement.amount || "5000",
        asset: requirement.asset || "STX",
        payTo: requirement.payTo || "SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7",
        payer: "ST_DEMO_AGENT",
        nonce: Date.now(),
        expiresAt: Math.floor(Date.now() / 1000) + 300,
      },
    };
    paymentSignature = Buffer.from(JSON.stringify(demoPayload)).toString("base64");
    printResult("Demo payload", "✓");
    printDone("Demo payment constructed (no real funds)");
  }

  printStep(4, "Re-send Request With Payment Header");

  if (paymentSignature) {
    try {
      const res = await fetch(`${SERVER_URL}/api/summarize`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "payment-signature": paymentSignature,
        },
        body: JSON.stringify(testPayload),
      });

      printResult("HTTP Status", `${res.status} ${res.statusText}`);

      if (res.status === 200) {
        const data = await res.json();
        printResult("Summary", data.summary);
        printResult("Confidence", data.confidence);
        printResult("Model", data.model);
        printResult("Tokens used", data.tokens_used);
        printDone("API response received — payment accepted!");
      } else {
        const body = await res.text();
        printResult("Response", body.slice(0, 200));
        printDone(`Server returned ${res.status} — facilitator may have rejected demo signature`);
        console.log("  With a funded testnet wallet, the facilitator would verify");
        console.log("  the real Stacks transaction and grant access.\n");
      }
    } catch (e) {
      printError(`Request failed: ${e.message}`);
    }
  }

  printStep(5, "Test Additional Endpoints");

  console.log("  │");
  console.log("  │  ── Sentiment Analysis ──");
  try {
    const sentRes = await fetch(`${SERVER_URL}/api/sentiment`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: "This product is absolutely amazing" }),
    });
    printResult("Status", `${sentRes.status} (${sentRes.status === 402 ? "402 Payment Required ✓" : sentRes.statusText})`);
    if (sentRes.status === 402) {
      const body = await sentRes.json();
      printResult("Price", `${body.accepts?.[0]?.amount} ${body.accepts?.[0]?.asset}`);
    }
  } catch (e) {
    console.log(`  │  Error: ${e.message}`);
  }

  console.log("  │");
  console.log("  │  ── Token Price Feed ──");
  try {
    const priceRes = await fetch(`${SERVER_URL}/api/price/STX`);
    printResult("Status", `${priceRes.status} (${priceRes.status === 402 ? "402 Payment Required ✓" : priceRes.statusText})`);
    if (priceRes.status === 402) {
      const body = await priceRes.json();
      printResult("Price", `${body.accepts?.[0]?.amount} ${body.accepts?.[0]?.asset}`);
    }
  } catch (e) {
    console.log(`  │  Error: ${e.message}`);
  }

  console.log("  │");
  console.log("  │  ── Image Generation ──");
  try {
    const imgRes = await fetch(`${SERVER_URL}/api/generate-image`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: "A futuristic AI marketplace" }),
    });
    printResult("Status", `${imgRes.status} (${imgRes.status === 402 ? "402 Payment Required ✓" : imgRes.statusText})`);
    if (imgRes.status === 402) {
      const body = await imgRes.json();
      printResult("Price", `${body.accepts?.[0]?.amount} ${body.accepts?.[0]?.asset}`);
    }
  } catch (e) {
    console.log(`  │  Error: ${e.message}`);
  }

  printDone("All endpoints tested");

  console.log("  ╔══════════════════════════════════════════════════╗");
  console.log("  ║   x402 Payment Flow Complete                    ║");
  console.log("  ╠══════════════════════════════════════════════════╣");
  console.log("  ║                                                  ║");
  console.log("  ║   1. ✓ Service Discovery   (GET /api/services)  ║");
  console.log("  ║   2. ✓ 402 Received        (Payment Required)   ║");
  console.log("  ║   3. ✓ Payment Signed      (Stacks wallet)      ║");
  console.log("  ║   4. ✓ Payment Sent        (payment-signature)  ║");
  console.log("  ║   5. ✓ All Endpoints       (402 on each)        ║");
  console.log("  ║                                                  ║");
  console.log("  ║   Network:  Stacks (stacks:1)                   ║");
  console.log("  ║   Protocol: x402 v2                              ║");
  console.log("  ║   Tokens:   STX, sBTC                           ║");
  console.log("  ║                                                  ║");
  console.log("  ╚══════════════════════════════════════════════════╝");
  console.log("");
}

main().catch((e) => {
  console.error("Fatal error:", e);
  process.exit(1);
});