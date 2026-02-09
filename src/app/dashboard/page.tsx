"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import type { Service, TokenType } from "@/lib/store";

export default function DashboardPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [provider, setProvider] = useState("");
  const [providerAddress, setProviderAddress] = useState("");
  const [category, setCategory] = useState("");
  const [baseUrl, setBaseUrl] = useState("");
  const [tags, setTags] = useState("");
  const [epMethod, setEpMethod] = useState("POST");
  const [epPath, setEpPath] = useState("");
  const [epDesc, setEpDesc] = useState("");
  const [epPrice, setEpPrice] = useState("");
  const [epToken, setEpToken] = useState<TokenType>("STX");

  useEffect(() => {
    fetch("/api/services").then(r => r.json()).then(d => setServices(d.services || []));
  }, []);

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/registry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          description,
          provider,
          providerAddress,
          category,
          baseUrl,
          tags: tags.split(",").map(t => t.trim()).filter(Boolean),
          endpoints: [{
            method: epMethod,
            path: epPath,
            description: epDesc,
            pricePerCall: epPrice,
            token: epToken,
          }],
        }),
      });
      if (res.ok) {
        const newService = await res.json();
        setServices(prev => [...prev, newService]);
        setSuccess(true);
        setShowForm(false);
        setName(""); setDescription(""); setProvider(""); setProviderAddress("");
        setCategory(""); setBaseUrl(""); setTags("");
        setEpPath(""); setEpDesc(""); setEpPrice("");
        setTimeout(() => setSuccess(false), 3000);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Header />
      <main style={{ minHeight: "calc(100vh - 128px)" }}>
        <section style={{ padding: "48px 0 80px" }}>
          <div className="container">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 32 }}>
              <div>
                <h1 style={{ fontSize: 32, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 8 }}>
                  Provider Dashboard
                </h1>
                <p style={{ fontSize: 16, color: "var(--text-secondary)" }}>
                  Register and manage your AI API services.
                </p>
              </div>
              <button
                onClick={() => setShowForm(!showForm)}
                className="btn btn-primary"
              >
                {showForm ? "Cancel" : "Register New Service"}
              </button>
            </div>

            {success && (
              <div className="fade-in" style={{
                padding: "14px 20px",
                background: "rgba(34,197,94,0.1)",
                border: "1px solid rgba(34,197,94,0.2)",
                borderRadius: "var(--radius-md)",
                color: "#22c55e",
                fontSize: 14,
                marginBottom: 24,
              }}>
                Service registered successfully and is now live on the marketplace.
              </div>
            )}

            {showForm && (
              <div className="fade-in" style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border-primary)",
                borderRadius: "var(--radius-lg)",
                padding: 32,
                marginBottom: 32,
              }}>
                <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 24 }}>Register a New Service</h2>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                  <div>
                    <label style={{ fontSize: 13, color: "var(--text-secondary)", display: "block", marginBottom: 6 }}>Service Name</label>
                    <input className="input-field" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. NeuralText Pro" />
                  </div>
                  <div>
                    <label style={{ fontSize: 13, color: "var(--text-secondary)", display: "block", marginBottom: 6 }}>Category</label>
                    <input className="input-field" value={category} onChange={e => setCategory(e.target.value)} placeholder="e.g. Text Analysis" />
                  </div>
                </div>

                <div style={{ marginBottom: 16 }}>
                  <label style={{ fontSize: 13, color: "var(--text-secondary)", display: "block", marginBottom: 6 }}>Description</label>
                  <textarea
                    className="input-field"
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    placeholder="Describe what your API does..."
                    style={{ minHeight: 80, resize: "vertical" }}
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                  <div>
                    <label style={{ fontSize: 13, color: "var(--text-secondary)", display: "block", marginBottom: 6 }}>Provider Name</label>
                    <input className="input-field" value={provider} onChange={e => setProvider(e.target.value)} placeholder="Your company name" />
                  </div>
                  <div>
                    <label style={{ fontSize: 13, color: "var(--text-secondary)", display: "block", marginBottom: 6 }}>Stacks Address</label>
                    <input className="input-field mono" value={providerAddress} onChange={e => setProviderAddress(e.target.value)} placeholder="SP2J6ZY48GV1..." />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                  <div>
                    <label style={{ fontSize: 13, color: "var(--text-secondary)", display: "block", marginBottom: 6 }}>Base URL</label>
                    <input className="input-field mono" value={baseUrl} onChange={e => setBaseUrl(e.target.value)} placeholder="https://your-api.com" />
                  </div>
                  <div>
                    <label style={{ fontSize: 13, color: "var(--text-secondary)", display: "block", marginBottom: 6 }}>Tags (comma-separated)</label>
                    <input className="input-field" value={tags} onChange={e => setTags(e.target.value)} placeholder="NLP, summarization, AI" />
                  </div>
                </div>

                <div style={{
                  marginTop: 24,
                  paddingTop: 24,
                  borderTop: "1px solid var(--border-primary)",
                }}>
                  <h3 style={{ fontSize: 14, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-tertiary)", marginBottom: 16 }}>
                    Primary Endpoint
                  </h3>
                  <div style={{ display: "grid", gridTemplateColumns: "100px 1fr 1fr", gap: 12, marginBottom: 12 }}>
                    <div>
                      <label style={{ fontSize: 13, color: "var(--text-secondary)", display: "block", marginBottom: 6 }}>Method</label>
                      <select className="input-field" value={epMethod} onChange={e => setEpMethod(e.target.value)}>
                        <option value="POST">POST</option>
                        <option value="GET">GET</option>
                        <option value="PUT">PUT</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ fontSize: 13, color: "var(--text-secondary)", display: "block", marginBottom: 6 }}>Path</label>
                      <input className="input-field mono" value={epPath} onChange={e => setEpPath(e.target.value)} placeholder="/api/analyze" />
                    </div>
                    <div>
                      <label style={{ fontSize: 13, color: "var(--text-secondary)", display: "block", marginBottom: 6 }}>Description</label>
                      <input className="input-field" value={epDesc} onChange={e => setEpDesc(e.target.value)} placeholder="What this endpoint does" />
                    </div>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 120px", gap: 12 }}>
                    <div>
                      <label style={{ fontSize: 13, color: "var(--text-secondary)", display: "block", marginBottom: 6 }}>Price per Call</label>
                      <input className="input-field mono" value={epPrice} onChange={e => setEpPrice(e.target.value)} placeholder="0.005" />
                    </div>
                    <div>
                      <label style={{ fontSize: 13, color: "var(--text-secondary)", display: "block", marginBottom: 6 }}>Token</label>
                      <select className="input-field" value={epToken} onChange={e => setEpToken(e.target.value as TokenType)}>
                        <option value="STX">STX</option>
                        <option value="sBTC">sBTC</option>
                        <option value="USDCx">USDCx</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: 24, display: "flex", justifyContent: "flex-end", gap: 12 }}>
                  <button onClick={() => setShowForm(false)} className="btn btn-secondary">
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="btn btn-primary"
                    disabled={submitting || !name || !description || !providerAddress || !epPath || !epPrice}
                    style={{ opacity: submitting || !name ? 0.5 : 1 }}
                  >
                    {submitting ? "Registering..." : "Register Service"}
                  </button>
                </div>
              </div>
            )}

            <div style={{ marginBottom: 24 }}>
              <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 4 }}>Registered Services</h2>
              <p style={{ fontSize: 14, color: "var(--text-tertiary)" }}>{services.length} services on the marketplace</p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 1, background: "var(--border-primary)", borderRadius: "var(--radius-lg)", overflow: "hidden", border: "1px solid var(--border-primary)" }}>
              <div style={{
                display: "grid",
                gridTemplateColumns: "2fr 1fr 1fr 1fr 80px",
                gap: 16,
                padding: "10px 20px",
                background: "var(--bg-tertiary)",
                fontSize: 12,
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                color: "var(--text-tertiary)",
              }}>
                <div>Service</div>
                <div>Category</div>
                <div>Calls</div>
                <div>Revenue</div>
                <div>Status</div>
              </div>
              {services.map(service => (
                <div key={service.id} style={{
                  display: "grid",
                  gridTemplateColumns: "2fr 1fr 1fr 1fr 80px",
                  gap: 16,
                  padding: "14px 20px",
                  background: "var(--bg-card)",
                  alignItems: "center",
                  fontSize: 14,
                }}>
                  <div>
                    <div style={{ fontWeight: 500 }}>{service.name}</div>
                    <div style={{ fontSize: 12, color: "var(--text-tertiary)" }}>{service.provider}</div>
                  </div>
                  <div style={{ color: "var(--text-secondary)" }}>{service.category}</div>
                  <div className="mono" style={{ fontSize: 13 }}>{service.totalCalls.toLocaleString()}</div>
                  <div className="mono" style={{ fontSize: 13 }}>{service.totalRevenue}</div>
                  <div>
                    <span style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 4,
                      fontSize: 12,
                      color: service.status === "active" ? "#22c55e" : "var(--text-tertiary)",
                    }}>
                      <span style={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: service.status === "active" ? "#22c55e" : "var(--text-tertiary)",
                      }} />
                      {service.status === "active" ? "Live" : "Off"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
