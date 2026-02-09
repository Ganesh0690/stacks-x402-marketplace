import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "x402 Agent Marketplace | Pay-Per-Call AI APIs on Stacks",
  description: "Discover and monetize AI-powered APIs with Bitcoin micropayments. x402 protocol on Stacks enables frictionless pay-per-request access for humans and AI agents.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
