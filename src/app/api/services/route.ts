import { NextResponse } from "next/server";
import { getAllServices, searchServices, getServicesByCategory } from "@/lib/store";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");
  const category = searchParams.get("category");

  let results;
  if (query) {
    results = searchServices(query);
  } else if (category) {
    results = getServicesByCategory(category);
  } else {
    results = getAllServices();
  }

  return NextResponse.json({ services: results, total: results.length });
}
