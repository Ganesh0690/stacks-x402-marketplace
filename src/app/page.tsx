"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ServiceCard from "@/components/ServiceCard";
import type { Service, MarketplaceStats } from "@/lib/store";

function StatsBar({ stats }: { stats: MarketplaceStats | null }) {
  if (!stats) return null;
  const items = [
    { label: "Services", value: stats.totalServices.toString() },
    { label: "Transactions", value: stats.totalTransactions.toLocaleString() },
    { label: "Volume", value: stats.totalVolume },
    { label: "Buyers", value: stats.activeBuyers.toString() },
    { label: "Sellers", value: stats.activeSellers.toString() },
  ];

  return (
    <div style={{
      display: "flex",
      gap: 1,
      background: "var(--border-primary)",
      borderRadius: "var(--radius-lg)",
      overflow: "hidden",
      border: "1px solid var(--border-primary)",
    }}>
      {items.map((item) => (
        <div key={item.label} style={{
          flex: 1,
          padding: "16px 20px",
          background: "var(--bg-card)",
          textAlign: "center",
        }}>
          <div className="mono" style={{ fontSize: 20, fontWeight: 600, color: "var(--text-primary)", marginBottom: 2 }}>
            {item.value}
          </div>
          <div style={{ fontSize: 12, color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
            {item.label}
          </div>
        </div>
      ))}
    </div>
  );
}

function HowItWorks() {
  const steps = [
    { num: "01", title: "Request", desc: "Agent or client calls an API endpoint on the marketplace." },
    { num: "02", title: "402 Response", desc: "Server returns payment details: amount, token, and recipient address." },
    { num: "03", title: "Sign & Pay", desc: "Client signs a Stacks transaction with STX, sBTC, or USDCx." },
    { num: "04", title: "Deliver", desc: "Payment is verified, settled on-chain, and the resource is served." },
  ];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 1, background: "var(--border-primary)", borderRadius: "var(--radius-lg)", overflow: "hidden", border: "1px solid var(--border-primary)" }}>
      {steps.map((step) => (
        <div key={step.num} style={{
          padding: "28px 24px",
          background: "var(--bg-card)",
          position: "relative",
        }}>
          <div style={{
            fontSize: 11,
            fontWeight: 600,
            color: "var(--accent)",
            letterSpacing: "0.06em",
            marginBottom: 12,
            fontFamily: "var(--font-mono)",
          }}>
            {step.num}
          </div>
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>{step.title}</h3>
          <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.5 }}>{step.desc}</p>
        </div>
      ))}
    </div>
  );
}

function TokenShowcase() {
  const tokens = [
    { name: "sBTC", label: "Bitcoin-backed", color: "#f97316", desc: "True Bitcoin settlement for high-value transactions." },
    { name: "STX", label: "Native Stacks", color: "#8b5cf6", desc: "Ecosystem-native with stacking rewards integration." },
    { name: "USDCx", label: "Stable Value", color: "#2775ca", desc: "Predictable pricing for fiat-denominated services." },
  ];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
      {tokens.map((t) => (
        <div key={t.name} className="card" style={{ textAlign: "center", padding: "32px 24px" }}>
          <div style={{
            width: 56,
            height: 56,
            borderRadius: "50%",
            background: `${t.color}15`,
            border: `2px solid ${t.color}30`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 16px",
            fontSize: 18,
            fontWeight: 700,
            color: t.color,
            fontFamily: "var(--font-mono)",
          }}>
            {t.name === "sBTC" ? "\u20BF" : t.name === "STX" ? "\u2726" : "$"}
          </div>
          <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 4 }}>{t.name}</h3>
          <div style={{ fontSize: 13, color: t.color, marginBottom: 10 }}>{t.label}</div>
          <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.5 }}>{t.desc}</p>
        </div>
      ))}
    </div>
  );
}

function CodeSnippet() {
  const code = `import express from "express";
import { paymentMiddleware } from "x402-stacks";

const app = express();

app.use(paymentMiddleware(
  "SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7",
  {
    "/api/summarize": {
      price: "0.005",
      token: "STX",
      network: "stacks-mainnet",
    },
  }
));

app.post("/api/summarize", (req, res) => {
  const result = processText(req.body.text);
  res.json({ summary: result });
});

app.listen(3001);`;

  return (
    <div style={{
      background: "#0d0d0d",
      border: "1px solid var(--border-primary)",
      borderRadius: "var(--radius-lg)",
      overflow: "hidden",
    }}>
      <div style={{
        padding: "10px 16px",
        borderBottom: "1px solid var(--border-primary)",
        display: "flex",
        alignItems: "center",
        gap: 8,
      }}>
        <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#ff5f57" }} />
        <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#ffbd2e" }} />
        <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#28ca42" }} />
        <span style={{ fontSize: 12, color: "var(--text-tertiary)", marginLeft: 8, fontFamily: "var(--font-mono)" }}>
          server.ts
        </span>
      </div>
      <pre style={{
        padding: "20px 24px",
        fontSize: 13,
        lineHeight: 1.7,
        overflow: "auto",
        color: "#c9d1d9",
        fontFamily: "var(--font-mono)",
      }}>
        <code>{code}</code>
      </pre>
    </div>
  );
}

export default function HomePage() {
  const [services, setServices] = useState<Service[]>([]);
  const [stats, setStats] = useState<MarketplaceStats | null>(null);

  useEffect(() => {
    fetch("/api/services").then(r => r.json()).then(d => setServices(d.services || []));
    fetch("/api/stats").then(r => r.json()).then(d => setStats(d));
  }, []);

  return (
    <>
      <Header />

      <main>
        <section style={{
          padding: "100px 0 60px",
          position: "relative",
          overflow: "hidden",
        }}>
          <div style={{
            position: "absolute",
            top: -200,
            right: -200,
            width: 600,
            height: 600,
            background: "radial-gradient(circle, rgba(232,98,44,0.06) 0%, transparent 70%)",
            pointerEvents: "none",
          }} />
          <div style={{
            position: "absolute",
            bottom: -100,
            left: -100,
            width: 400,
            height: 400,
            background: "radial-gradient(circle, rgba(139,92,246,0.04) 0%, transparent 70%)",
            pointerEvents: "none",
          }} />

          <div className="container">
            <div className="fade-in" style={{ maxWidth: 680, marginBottom: 48 }}>
              <div className="section-label" style={{ marginBottom: 16 }}>
                x402 Protocol on Stacks
              </div>
              <h1 style={{
                fontSize: 52,
                fontWeight: 700,
                lineHeight: 1.1,
                letterSpacing: "-0.03em",
                marginBottom: 20,
              }}>
                Pay-per-call AI APIs,{" "}
                <span style={{ color: "var(--accent)" }}>secured by Bitcoin.</span>
              </h1>
              <p style={{
                fontSize: 18,
                color: "var(--text-secondary)",
                lineHeight: 1.6,
                marginBottom: 32,
                maxWidth: 540,
              }}>
                A marketplace where developers list AI-powered APIs behind x402 paywalls.
                Agents discover, pay, and consume services autonomously using STX, sBTC, and USDCx.
              </p>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <Link href="/marketplace" className="btn btn-primary btn-lg">
                  Explore Marketplace
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </Link>
                <Link href="/docs" className="btn btn-secondary btn-lg">
                  Read the Docs
                </Link>
              </div>
            </div>

            <div className="fade-in stagger-2">
              <StatsBar stats={stats} />
            </div>
          </div>
        </section>

        <section style={{ padding: "80px 0" }}>
          <div className="container">
            <div style={{ marginBottom: 40 }}>
              <div className="section-label" style={{ marginBottom: 8 }}>How It Works</div>
              <h2 className="section-title">Four steps. Milliseconds. Zero friction.</h2>
            </div>
            <HowItWorks />
          </div>
        </section>

        <section style={{ padding: "80px 0" }}>
          <div className="container">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 40 }}>
              <div>
                <div className="section-label" style={{ marginBottom: 8 }}>Featured Services</div>
                <h2 className="section-title">Discover AI APIs</h2>
              </div>
              <Link href="/marketplace" className="btn btn-outline btn-sm" style={{ borderRadius: 100 }}>
                View All
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </Link>
            </div>

            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 20,
            }}>
              {services.slice(0, 6).map((service, i) => (
                <div key={service.id} className={`fade-in stagger-${i + 1}`}>
                  <ServiceCard
                    service={service}
                    onClick={() => window.location.href = `/marketplace?selected=${service.id}`}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        <section style={{ padding: "80px 0" }}>
          <div className="container">
            <div style={{ textAlign: "center", marginBottom: 48 }}>
              <div className="section-label" style={{ marginBottom: 8 }}>Settlement Options</div>
              <h2 className="section-title" style={{ margin: "0 auto" }}>Three tokens. One protocol.</h2>
            </div>
            <TokenShowcase />
          </div>
        </section>

        <section style={{ padding: "80px 0" }}>
          <div className="container">
            <div style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 48,
              alignItems: "center",
            }}>
              <div>
                <div className="section-label" style={{ marginBottom: 8 }}>Integration</div>
                <h2 className="section-title" style={{ marginBottom: 16 }}>
                  One line of code. Instant monetization.
                </h2>
                <p className="section-subtitle" style={{ marginBottom: 24 }}>
                  Add x402-stacks middleware to your Express server and start accepting
                  micropayments in STX, sBTC, or USDCx. No accounts, no API keys, no
                  subscriptions. Just HTTP and payment.
                </p>
                <div className="mono" style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "8px 14px",
                  background: "var(--bg-tertiary)",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--border-primary)",
                  color: "var(--accent)",
                  fontSize: 13,
                }}>
                  npm install x402-stacks
                </div>
              </div>
              <CodeSnippet />
            </div>
          </div>
        </section>

        <section style={{ padding: "80px 0" }}>
          <div className="container">
            <div style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border-primary)",
              borderRadius: "var(--radius-xl)",
              padding: "64px",
              textAlign: "center",
              position: "relative",
              overflow: "hidden",
            }}>
              <div style={{
                position: "absolute",
                top: -100,
                left: "50%",
                transform: "translateX(-50%)",
                width: 500,
                height: 300,
                background: "radial-gradient(ellipse, rgba(232,98,44,0.08) 0%, transparent 70%)",
                pointerEvents: "none",
              }} />
              <h2 style={{
                fontSize: 36,
                fontWeight: 700,
                letterSpacing: "-0.02em",
                marginBottom: 12,
                position: "relative",
              }}>
                Ready to build?
              </h2>
              <p style={{
                fontSize: 17,
                color: "var(--text-secondary)",
                marginBottom: 32,
                maxWidth: 480,
                margin: "0 auto 32px",
                lineHeight: 1.6,
                position: "relative",
              }}>
                List your AI API on the marketplace or start consuming services
                with Bitcoin micropayments today.
              </p>
              <div style={{ display: "flex", gap: 12, justifyContent: "center", position: "relative" }}>
                <Link href="/dashboard" className="btn btn-primary btn-lg">
                  List Your API
                </Link>
                <Link href="/marketplace" className="btn btn-secondary btn-lg">
                  Browse APIs
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
