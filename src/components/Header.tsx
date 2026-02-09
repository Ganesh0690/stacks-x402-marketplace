"use client";

import { useState } from "react";
import Link from "next/link";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header style={{
      position: "sticky",
      top: 0,
      zIndex: 100,
      background: "rgba(10, 10, 10, 0.85)",
      backdropFilter: "blur(16px)",
      borderBottom: "1px solid var(--border-primary)",
    }}>
      <div className="container-wide" style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: 64,
      }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 32,
            height: 32,
            borderRadius: "var(--radius-sm)",
            background: "var(--accent)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 700,
            fontSize: 14,
            color: "white",
          }}>
            x4
          </div>
          <span style={{ fontSize: 17, fontWeight: 600, letterSpacing: "-0.01em" }}>
            AgentMarket
          </span>
        </Link>

        <nav style={{
          display: "flex",
          alignItems: "center",
          gap: 32,
        }}>
          <div style={{ display: "flex", gap: 28, alignItems: "center" }}
            className="nav-links"
          >
            <Link href="/marketplace" style={{
              fontSize: 14,
              color: "var(--text-secondary)",
              transition: "color 0.2s",
            }}
              onMouseEnter={e => e.currentTarget.style.color = "var(--text-primary)"}
              onMouseLeave={e => e.currentTarget.style.color = "var(--text-secondary)"}
            >
              Marketplace
            </Link>
            <Link href="/docs" style={{
              fontSize: 14,
              color: "var(--text-secondary)",
              transition: "color 0.2s",
            }}
              onMouseEnter={e => e.currentTarget.style.color = "var(--text-primary)"}
              onMouseLeave={e => e.currentTarget.style.color = "var(--text-secondary)"}
            >
              Docs
            </Link>
            <Link href="/dashboard" style={{
              fontSize: 14,
              color: "var(--text-secondary)",
              transition: "color 0.2s",
            }}
              onMouseEnter={e => e.currentTarget.style.color = "var(--text-primary)"}
              onMouseLeave={e => e.currentTarget.style.color = "var(--text-secondary)"}
            >
              Dashboard
            </Link>
          </div>
          <Link href="/marketplace" className="btn btn-primary btn-sm" style={{
            borderRadius: 100,
            paddingLeft: 18,
            paddingRight: 18,
          }}>
            Start Building
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
        </nav>
      </div>
    </header>
  );
}
