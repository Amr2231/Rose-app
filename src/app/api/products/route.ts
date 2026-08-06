import { NextRequest, NextResponse } from "next/server";
import { getProducts } from "@/lib/services/products.service";


export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const params: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      params[key] = value;
    });

    const { products, metadata } = await getProducts(params);

    return NextResponse.json({ products, metadata });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch products";
    return NextResponse.json({ message }, { status: 500 });
  }
}
