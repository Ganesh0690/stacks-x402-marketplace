import Link from "next/link";

export default function Footer() {
  return (
    <footer style={{
      borderTop: "1px solid var(--border-primary)",
      padding: "48px 0 32px",
      background: "var(--bg-primary)",
    }}>
      <div className="container" style={{
        display: "grid",
        gridTemplateColumns: "2fr 1fr 1fr 1fr",
        gap: 48,
      }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <div style={{
              width: 28,
              height: 28,
              borderRadius: "var(--radius-sm)",
              background: "var(--accent)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 700,
              fontSize: 12,
              color: "white",
            }}>
              x4
            </div>
            <span style={{ fontSize: 15, fontWeight: 600 }}>AgentMarket</span>
          </div>
          <p style={{ fontSize: 14, color: "var(--text-tertiary)", maxWidth: 280, lineHeight: 1.6 }}>
            The HTTP 402 standard, finally realized on Bitcoin.
            Pay-per-call AI APIs for humans and agents.
          </p>
        </div>

        <div>
          <h4 style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-tertiary)", marginBottom: 16 }}>
            Product
          </h4>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <Link href="/marketplace" style={{ fontSize: 14, color: "var(--text-secondary)" }}>Marketplace</Link>
            <Link href="/docs" style={{ fontSize: 14, color: "var(--text-secondary)" }}>Documentation</Link>
            <Link href="/dashboard" style={{ fontSize: 14, color: "var(--text-secondary)" }}>Dashboard</Link>
          </div>
        </div>

        <div>
          <h4 style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-tertiary)", marginBottom: 16 }}>
            Resources
          </h4>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <a href="https://github.com/tony1908/x402-stacks" target="_blank" rel="noopener" style={{ fontSize: 14, color: "var(--text-secondary)" }}>GitHub</a>
            <a href="https://www.npmjs.com/package/x402-stacks" target="_blank" rel="noopener" style={{ fontSize: 14, color: "var(--text-secondary)" }}>npm</a>
            <a href="https://docs.x402stacks.xyz" target="_blank" rel="noopener" style={{ fontSize: 14, color: "var(--text-secondary)" }}>x402-stacks Docs</a>
          </div>
        </div>

        <div>
          <h4 style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-tertiary)", marginBottom: 16 }}>
            Ecosystem
          </h4>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <a href="https://www.stacks.co" target="_blank" rel="noopener" style={{ fontSize: 14, color: "var(--text-secondary)" }}>Stacks</a>
            <a href="https://www.x402.org" target="_blank" rel="noopener" style={{ fontSize: 14, color: "var(--text-secondary)" }}>x402 Protocol</a>
            <a href="https://scan.stacksx402.com" target="_blank" rel="noopener" style={{ fontSize: 14, color: "var(--text-secondary)" }}>x402 Scan</a>
          </div>
        </div>
      </div>

      <div className="container" style={{
        marginTop: 40,
        paddingTop: 20,
        borderTop: "1px solid var(--border-primary)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}>
        <p style={{ fontSize: 13, color: "var(--text-tertiary)" }}>
          Built for the x402 Stacks Challenge 2026
        </p>
        <p style={{ fontSize: 13, color: "var(--text-tertiary)" }}>
          Powered by Stacks & Bitcoin
        </p>
      </div>
    </footer>
  );
}
