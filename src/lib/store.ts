export type TokenType = "STX" | "sBTC" | "USDCx";

export interface ServiceEndpoint {
  method: string;
  path: string;
  description: string;
  pricePerCall: string;
  token: TokenType;
  exampleRequest?: string;
  exampleResponse?: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  longDescription: string;
  provider: string;
  providerAddress: string;
  category: string;
  endpoints: ServiceEndpoint[];
  baseUrl: string;
  totalCalls: number;
  totalRevenue: string;
  rating: number;
  createdAt: string;
  tags: string[];
  status: "active" | "inactive";
}

export interface MarketplaceStats {
  totalServices: number;
  totalTransactions: number;
  totalVolume: string;
  activeBuyers: number;
  activeSellers: number;
}

const services: Service[] = [
  {
    id: "svc-001",
    name: "NeuralText Pro",
    description: "Advanced text summarization and analysis powered by fine-tuned language models.",
    longDescription: "NeuralText Pro provides enterprise-grade natural language processing capabilities through a simple HTTP API. Our models are fine-tuned on domain-specific corpora to deliver superior summarization, sentiment analysis, and entity extraction. Each API call is metered via x402 on Stacks, enabling true pay-per-use without subscriptions.",
    provider: "StacksAI Labs",
    providerAddress: "SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7",
    category: "Text Analysis",
    endpoints: [
      {
        method: "POST",
        path: "/api/summarize",
        description: "Summarize long-form text into concise paragraphs",
        pricePerCall: "0.005",
        token: "STX",
        exampleRequest: '{"text": "Your long document here...", "max_length": 200}',
        exampleResponse: '{"summary": "Condensed version of the input text...", "confidence": 0.94}'
      },
      {
        method: "POST",
        path: "/api/sentiment",
        description: "Analyze sentiment and emotional tone of text",
        pricePerCall: "0.003",
        token: "STX",
        exampleRequest: '{"text": "The product exceeded all expectations..."}',
        exampleResponse: '{"sentiment": "positive", "score": 0.92, "emotions": {"joy": 0.8, "trust": 0.7}}'
      }
    ],
    baseUrl: "https://neuraltext.stacksx402.com",
    totalCalls: 2847,
    totalRevenue: "14.235",
    rating: 4.8,
    createdAt: "2026-01-15T00:00:00Z",
    tags: ["NLP", "summarization", "sentiment"],
    status: "active"
  },
  {
    id: "svc-002",
    name: "PixelForge",
    description: "Generate production-ready images from text prompts using diffusion models.",
    longDescription: "PixelForge delivers high-quality AI image generation through a pay-per-request model on Stacks. Each image generation costs a fraction of a cent in sBTC, making it accessible for both human developers and autonomous AI agents. Supports multiple aspect ratios, styles, and quality levels.",
    provider: "BitCanvas",
    providerAddress: "SP1HTBVD3JG9C05J7HBJTHGR0GGW7KXW28M5JS8QE",
    category: "Image Generation",
    endpoints: [
      {
        method: "POST",
        path: "/api/generate",
        description: "Generate an image from a text prompt",
        pricePerCall: "0.00005",
        token: "sBTC",
        exampleRequest: '{"prompt": "A futuristic cityscape at sunset", "width": 1024, "height": 1024}',
        exampleResponse: '{"image_url": "https://cdn.pixelforge.com/gen/abc123.png", "seed": 42}'
      },
      {
        method: "POST",
        path: "/api/upscale",
        description: "Upscale an image to 4x resolution",
        pricePerCall: "0.00008",
        token: "sBTC",
        exampleRequest: '{"image_url": "https://example.com/photo.jpg", "scale": 4}',
        exampleResponse: '{"image_url": "https://cdn.pixelforge.com/up/def456.png", "dimensions": "4096x4096"}'
      }
    ],
    baseUrl: "https://pixelforge.stacksx402.com",
    totalCalls: 1523,
    totalRevenue: "0.1218",
    rating: 4.6,
    createdAt: "2026-01-20T00:00:00Z",
    tags: ["images", "diffusion", "generation"],
    status: "active"
  },
  {
    id: "svc-003",
    name: "CodeAudit AI",
    description: "Automated code review, vulnerability scanning, and optimization suggestions.",
    longDescription: "CodeAudit AI performs deep analysis of source code to identify security vulnerabilities, performance bottlenecks, and code quality issues. Purpose-built for Clarity smart contracts and Stacks ecosystem code, but supports all major languages. Pay only for what you scan.",
    provider: "SecureStack",
    providerAddress: "SP3FBR2AGK5H9QBDH3EEN6DF8EK8JY7RX8QJ5SVTE",
    category: "Code Review",
    endpoints: [
      {
        method: "POST",
        path: "/api/review",
        description: "Perform comprehensive code review",
        pricePerCall: "0.50",
        token: "USDCx",
        exampleRequest: '{"code": "contract source...", "language": "clarity"}',
        exampleResponse: '{"issues": [{"severity": "high", "line": 42, "message": "Unchecked return value"}], "score": 78}'
      },
      {
        method: "POST",
        path: "/api/vulnerabilities",
        description: "Scan for security vulnerabilities",
        pricePerCall: "0.75",
        token: "USDCx",
        exampleRequest: '{"code": "contract source...", "language": "clarity", "depth": "thorough"}',
        exampleResponse: '{"vulnerabilities": [], "risk_level": "low", "recommendations": ["Add reentrancy guard"]}'
      }
    ],
    baseUrl: "https://codeaudit.stacksx402.com",
    totalCalls: 892,
    totalRevenue: "668.50",
    rating: 4.9,
    createdAt: "2026-01-10T00:00:00Z",
    tags: ["security", "audit", "clarity"],
    status: "active"
  },
  {
    id: "svc-004",
    name: "ChainOracle",
    description: "Real-time blockchain data feeds and analytics for Stacks and Bitcoin.",
    longDescription: "ChainOracle provides real-time and historical blockchain data through simple API calls. Get token prices, transaction analytics, DeFi metrics, and network statistics. Designed for AI agents that need fresh on-chain data to make decisions. Settlement in STX keeps costs ecosystem-native.",
    provider: "DataStack",
    providerAddress: "SP2C2YFP12AJZB1MAHDH1B0TN8CJHG5AYMHQGEPP4",
    category: "Data Oracle",
    endpoints: [
      {
        method: "GET",
        path: "/api/price/:token",
        description: "Get real-time token price data",
        pricePerCall: "0.001",
        token: "STX",
        exampleRequest: "GET /api/price/STX",
        exampleResponse: '{"token": "STX", "price_usd": 2.45, "change_24h": 3.2, "volume": 12500000}'
      },
      {
        method: "GET",
        path: "/api/analytics/:address",
        description: "Get wallet analytics and transaction history",
        pricePerCall: "0.005",
        token: "STX",
        exampleRequest: "GET /api/analytics/SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7",
        exampleResponse: '{"total_txns": 142, "total_volume": "5420.50 STX", "first_seen": "2025-03-01"}'
      }
    ],
    baseUrl: "https://chainoracle.stacksx402.com",
    totalCalls: 4102,
    totalRevenue: "20.51",
    rating: 4.7,
    createdAt: "2026-01-05T00:00:00Z",
    tags: ["oracle", "data", "analytics", "prices"],
    status: "active"
  },
  {
    id: "svc-005",
    name: "VoiceForge",
    description: "Text-to-speech synthesis with natural-sounding AI voices.",
    longDescription: "VoiceForge converts text into lifelike speech audio using state-of-the-art neural voice models. Choose from dozens of voices across multiple languages. Perfect for content creators, accessibility tools, and agent-driven audio pipelines. Micropayments in sBTC mean you pay per second of audio generated.",
    provider: "AudioStack",
    providerAddress: "SP1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    category: "Audio",
    endpoints: [
      {
        method: "POST",
        path: "/api/synthesize",
        description: "Convert text to speech audio",
        pricePerCall: "0.00003",
        token: "sBTC",
        exampleRequest: '{"text": "Hello, welcome to the future of payments.", "voice": "aria", "format": "mp3"}',
        exampleResponse: '{"audio_url": "https://cdn.voiceforge.com/out/xyz.mp3", "duration_seconds": 3.2}'
      }
    ],
    baseUrl: "https://voiceforge.stacksx402.com",
    totalCalls: 1205,
    totalRevenue: "0.0361",
    rating: 4.5,
    createdAt: "2026-01-25T00:00:00Z",
    tags: ["audio", "TTS", "voice"],
    status: "active"
  },
  {
    id: "svc-006",
    name: "TranslateX",
    description: "Neural machine translation across 50+ languages with context awareness.",
    longDescription: "TranslateX provides high-accuracy translations powered by transformer models fine-tuned for technical and conversational content. Supports batch translation, document processing, and real-time streaming. Each translation call is settled via x402 on Stacks, enabling frictionless multilingual AI workflows.",
    provider: "LinguaChain",
    providerAddress: "SPABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890",
    category: "Translation",
    endpoints: [
      {
        method: "POST",
        path: "/api/translate",
        description: "Translate text between languages",
        pricePerCall: "0.002",
        token: "STX",
        exampleRequest: '{"text": "Hello world", "source": "en", "target": "es"}',
        exampleResponse: '{"translation": "Hola mundo", "confidence": 0.97}'
      }
    ],
    baseUrl: "https://translatex.stacksx402.com",
    totalCalls: 3201,
    totalRevenue: "6.402",
    rating: 4.4,
    createdAt: "2026-02-01T00:00:00Z",
    tags: ["translation", "multilingual", "NLP"],
    status: "active"
  }
];

export function getAllServices(): Service[] {
  return services.filter(s => s.status === "active");
}

export function getServiceById(id: string): Service | undefined {
  return services.find(s => s.id === id);
}

export function getServicesByCategory(category: string): Service[] {
  return services.filter(s => s.category === category && s.status === "active");
}

export function searchServices(query: string): Service[] {
  const q = query.toLowerCase();
  return services.filter(s =>
    s.status === "active" && (
      s.name.toLowerCase().includes(q) ||
      s.description.toLowerCase().includes(q) ||
      s.tags.some(t => t.toLowerCase().includes(q)) ||
      s.category.toLowerCase().includes(q)
    )
  );
}

export function addService(service: Service): Service {
  services.push(service);
  return service;
}

export function getCategories(): string[] {
  return [...new Set(services.filter(s => s.status === "active").map(s => s.category))];
}

export function getStats(): MarketplaceStats {
  const active = services.filter(s => s.status === "active");
  return {
    totalServices: active.length,
    totalTransactions: active.reduce((sum, s) => sum + s.totalCalls, 0),
    totalVolume: "15.46 STX",
    activeBuyers: 15,
    activeSellers: active.length
  };
}
