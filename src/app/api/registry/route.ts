import { NextResponse } from "next/server";
import { addService } from "@/lib/store";
import type { Service } from "@/lib/store";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const id = `svc-${Date.now()}`;
    const service: Service = {
      id,
      name: body.name,
      description: body.description,
      longDescription: body.longDescription || body.description,
      provider: body.provider,
      providerAddress: body.providerAddress,
      category: body.category,
      endpoints: body.endpoints || [],
      baseUrl: body.baseUrl,
      totalCalls: 0,
      totalRevenue: "0",
      rating: 0,
      createdAt: new Date().toISOString(),
      tags: body.tags || [],
      status: "active"
    };
    const created = addService(service);
    return NextResponse.json(created, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}
