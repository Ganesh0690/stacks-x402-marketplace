"use client";

import type { Service } from "@/lib/store";

const tokenColors: Record<string, { bg: string; text: string; border: string }> = {
  STX: { bg: "rgba(139,92,246,0.1)", text: "#8b5cf6", border: "rgba(139,92,246,0.2)" },
  sBTC: { bg: "rgba(249,115,22,0.1)", text: "#f97316", border: "rgba(249,115,22,0.2)" },
  USDCx: { bg: "rgba(39,117,202,0.1)", text: "#2775ca", border: "rgba(39,117,202,0.2)" },
};

export default function ServiceCard({
  service,
  onClick,
}: {
  service: Service;
  onClick?: () => void;
}) {
  const primaryToken = service.endpoints[0]?.token || "STX";
  const lowestPrice = Math.min(...service.endpoints.map(e => parseFloat(e.pricePerCall)));
  const tc = tokenColors[primaryToken] || tokenColors.STX;

  return (
    <div
      onClick={onClick}
      className="card"
      style={{
        cursor: onClick ? "pointer" : "default",
        display: "flex",
        flexDirection: "column",
        gap: 16,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div style={{
        position: "absolute",
        top: 0,
        right: 0,
        width: 120,
        height: 120,
        background: `radial-gradient(circle at top right, ${tc.bg}, transparent 70%)`,
        pointerEvents: "none",
      }} />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{
          width: 40,
          height: 40,
          borderRadius: "var(--radius-md)",
          background: "var(--bg-tertiary)",
          border: "1px solid var(--border-primary)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 18,
          fontWeight: 700,
          color: tc.text,
        }}>
          {service.name[0]}
        </div>

        <span
          className="badge"
          style={{
            background: tc.bg,
            color: tc.text,
            border: `1px solid ${tc.border}`,
          }}
        >
          {primaryToken}
        </span>
      </div>

      <div>
        <h3 style={{ fontSize: 17, fontWeight: 600, marginBottom: 6, letterSpacing: "-0.01em" }}>
          {service.name}
        </h3>
        <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.5 }}>
          {service.description}
        </p>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        <span className="badge badge-category">{service.category}</span>
        {service.tags.slice(0, 2).map(tag => (
          <span key={tag} className="badge" style={{
            background: "transparent",
            color: "var(--text-tertiary)",
            border: "1px solid var(--border-primary)",
          }}>
            {tag}
          </span>
        ))}
      </div>

      <div style={{
        marginTop: "auto",
        paddingTop: 16,
        borderTop: "1px solid var(--border-primary)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}>
        <div>
          <span style={{ fontSize: 12, color: "var(--text-tertiary)", display: "block" }}>From</span>
          <span className="mono" style={{ color: tc.text, fontWeight: 500 }}>
            {lowestPrice} {primaryToken}
            <span style={{ color: "var(--text-tertiary)", fontWeight: 400 }}>/call</span>
          </span>
        </div>
        <div style={{ display: "flex", gap: 16 }}>
          <div style={{ textAlign: "right" }}>
            <span style={{ fontSize: 12, color: "var(--text-tertiary)", display: "block" }}>Calls</span>
            <span style={{ fontSize: 14, fontWeight: 500 }}>{service.totalCalls.toLocaleString()}</span>
          </div>
          <div style={{ textAlign: "right" }}>
            <span style={{ fontSize: 12, color: "var(--text-tertiary)", display: "block" }}>Rating</span>
            <span style={{ fontSize: 14, fontWeight: 500 }}>{service.rating > 0 ? service.rating.toFixed(1) : "--"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
