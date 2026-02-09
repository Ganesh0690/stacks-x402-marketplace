"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ServiceCard from "@/components/ServiceCard";
import type { Service } from "@/lib/store";

function ServiceDetailModal({
  service,
  onClose,
}: {
  service: Service;
  onClose: () => void;
}) {
  const tokenColor: Record<string, string> = { STX: "#8b5cf6", sBTC: "#f97316", USDCx: "#2775ca" };

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        background: "rgba(0,0,0,0.7)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: "var(--bg-secondary)",
          border: "1px solid var(--border-primary)",
          borderRadius: "var(--radius-xl)",
          maxWidth: 700,
          width: "100%",
          maxHeight: "85vh",
          overflow: "auto",
          padding: 0,
        }}
      >
        <div style={{
          padding: "28px 32px",
          borderBottom: "1px solid var(--border-primary)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}>
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 600, letterSpacing: "-0.01em", marginBottom: 6 }}>
              {service.name}
            </h2>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <span style={{ fontSize: 14, color: "var(--text-secondary)" }}>{service.provider}</span>
              <span style={{ fontSize: 13, color: "var(--text-tertiary)" }}>|</span>
              <span className="badge badge-category">{service.category}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              width: 32,
              height: 32,
              borderRadius: "var(--radius-sm)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--text-secondary)",
              border: "1px solid var(--border-primary)",
              background: "var(--bg-tertiary)",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <div style={{ padding: "24px 32px" }}>
          <p style={{ fontSize: 15, color: "var(--text-secondary)", lineHeight: 1.7, marginBottom: 28 }}>
            {service.longDescription}
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 28 }}>
            <div style={{ padding: 16, background: "var(--bg-tertiary)", borderRadius: "var(--radius-md)" }}>
              <div style={{ fontSize: 12, color: "var(--text-tertiary)", marginBottom: 4 }}>Total Calls</div>
              <div style={{ fontSize: 20, fontWeight: 600, fontFamily: "var(--font-mono)" }}>{service.totalCalls.toLocaleString()}</div>
            </div>
            <div style={{ padding: 16, background: "var(--bg-tertiary)", borderRadius: "var(--radius-md)" }}>
              <div style={{ fontSize: 12, color: "var(--text-tertiary)", marginBottom: 4 }}>Revenue</div>
              <div style={{ fontSize: 20, fontWeight: 600, fontFamily: "var(--font-mono)" }}>{service.totalRevenue}</div>
            </div>
            <div style={{ padding: 16, background: "var(--bg-tertiary)", borderRadius: "var(--radius-md)" }}>
              <div style={{ fontSize: 12, color: "var(--text-tertiary)", marginBottom: 4 }}>Rating</div>
              <div style={{ fontSize: 20, fontWeight: 600, fontFamily: "var(--font-mono)" }}>{service.rating > 0 ? service.rating.toFixed(1) : "--"}</div>
            </div>
          </div>

          <h3 style={{ fontSize: 14, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-tertiary)", marginBottom: 16 }}>
            Endpoints
          </h3>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {service.endpoints.map((ep, i) => (
              <div key={i} style={{
                padding: 20,
                background: "var(--bg-tertiary)",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--border-primary)",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <span className="mono" style={{
                      padding: "2px 8px",
                      borderRadius: 4,
                      background: ep.method === "POST" ? "rgba(34,197,94,0.1)" : "rgba(59,130,246,0.1)",
                      color: ep.method === "POST" ? "#22c55e" : "#3b82f6",
                      fontSize: 11,
                      fontWeight: 600,
                    }}>
                      {ep.method}
                    </span>
                    <span className="mono" style={{ fontSize: 14, color: "var(--text-primary)" }}>
                      {ep.path}
                    </span>
                  </div>
                  <span className="mono" style={{ fontSize: 13, color: tokenColor[ep.token] || "#8b5cf6", fontWeight: 500 }}>
                    {ep.pricePerCall} {ep.token}
                  </span>
                </div>
                <p style={{ fontSize: 14, color: "var(--text-secondary)", marginBottom: 12 }}>
                  {ep.description}
                </p>
                {ep.exampleRequest && (
                  <div style={{ marginBottom: 8 }}>
                    <span style={{ fontSize: 11, color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Request</span>
                    <pre className="mono" style={{
                      marginTop: 4,
                      padding: "8px 12px",
                      background: "#0a0a0a",
                      borderRadius: 6,
                      fontSize: 12,
                      overflow: "auto",
                      color: "#9ca3af",
                    }}>
                      {ep.exampleRequest}
                    </pre>
                  </div>
                )}
                {ep.exampleResponse && (
                  <div>
                    <span style={{ fontSize: 11, color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Response</span>
                    <pre className="mono" style={{
                      marginTop: 4,
                      padding: "8px 12px",
                      background: "#0a0a0a",
                      borderRadius: 6,
                      fontSize: 12,
                      overflow: "auto",
                      color: "#9ca3af",
                    }}>
                      {ep.exampleResponse}
                    </pre>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div style={{ marginTop: 24, display: "flex", gap: 8, alignItems: "center" }}>
            <span style={{ fontSize: 12, color: "var(--text-tertiary)" }}>Base URL:</span>
            <span className="mono" style={{ fontSize: 13, color: "var(--accent)" }}>{service.baseUrl}</span>
          </div>
          <div style={{ marginTop: 8, display: "flex", gap: 8, alignItems: "center" }}>
            <span style={{ fontSize: 12, color: "var(--text-tertiary)" }}>Provider:</span>
            <span className="mono" style={{ fontSize: 12, color: "var(--text-secondary)" }}>
              {service.providerAddress.slice(0, 8)}...{service.providerAddress.slice(-6)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MarketplacePage() {
  const [services, setServices] = useState<Service[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [selected, setSelected] = useState<Service | null>(null);
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    fetch("/api/services").then(r => r.json()).then(d => {
      const svcs = d.services || [];
      setServices(svcs);
      const cats = [...new Set(svcs.map((s: Service) => s.category))] as string[];
      setCategories(cats);
    });
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const selectedId = params.get("selected");
    if (selectedId && services.length > 0) {
      const svc = services.find(s => s.id === selectedId);
      if (svc) setSelected(svc);
    }
  }, [services]);

  const filtered = services.filter(s => {
    const matchesSearch = !search ||
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.description.toLowerCase().includes(search.toLowerCase()) ||
      s.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
    const matchesCategory = category === "All" || s.category === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <>
      <Header />
      <main style={{ minHeight: "calc(100vh - 128px)" }}>
        <section style={{ padding: "48px 0 24px" }}>
          <div className="container">
            <h1 style={{ fontSize: 32, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 8 }}>
              Marketplace
            </h1>
            <p style={{ fontSize: 16, color: "var(--text-secondary)", marginBottom: 32 }}>
              Discover AI-powered APIs with pay-per-call pricing on Stacks.
            </p>

            <div style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap", alignItems: "center" }}>
              <div style={{ position: "relative", flex: "1 1 300px" }}>
                <svg
                  style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-tertiary)" }}
                  width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
                </svg>
                <input
                  type="text"
                  placeholder="Search services, tags, categories..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="input-field"
                  style={{ paddingLeft: 36 }}
                />
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                <button
                  onClick={() => setCategory("All")}
                  className={`btn btn-sm ${category === "All" ? "btn-primary" : "btn-secondary"}`}
                  style={{ borderRadius: 100 }}
                >
                  All
                </button>
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`btn btn-sm ${category === cat ? "btn-primary" : "btn-secondary"}`}
                    style={{ borderRadius: 100 }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ fontSize: 13, color: "var(--text-tertiary)", marginBottom: 20 }}>
              {filtered.length} service{filtered.length !== 1 ? "s" : ""} found
            </div>
          </div>
        </section>

        <section style={{ paddingBottom: 80 }}>
          <div className="container">
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 20,
            }}>
              {filtered.map((service, i) => (
                <div key={service.id} className={`fade-in stagger-${Math.min(i + 1, 6)}`}>
                  <ServiceCard service={service} onClick={() => setSelected(service)} />
                </div>
              ))}
            </div>

            {filtered.length === 0 && (
              <div style={{
                textAlign: "center",
                padding: "80px 0",
                color: "var(--text-tertiary)",
              }}>
                <p style={{ fontSize: 16, marginBottom: 8 }}>No services match your search.</p>
                <button onClick={() => { setSearch(""); setCategory("All"); }} className="btn btn-outline btn-sm">
                  Clear filters
                </button>
              </div>
            )}
          </div>
        </section>
      </main>

      {selected && (
        <ServiceDetailModal service={selected} onClose={() => setSelected(null)} />
      )}

      <Footer />
    </>
  );
}
