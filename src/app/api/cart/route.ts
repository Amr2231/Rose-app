import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { getServerApiBase } from "@/lib/utils/api-response";
import { normalizeCart } from "@/lib/utils/normalize-cart";

export async function GET(request: NextRequest) {
  try {
    const token = await getToken({ req: request });

    if (!token?.accesstoken) {
      return NextResponse.json(
        { message: "Unauthorized ❌❌" },
        { status: 401 }
      );
    }

    const response = await fetch(`${getServerApiBase()}/api/cart`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token.accesstoken}`,
      },
      cache: "no-store",
    });

    const data = await response.json();

    if (!response.ok || data?.status === false) {
      return NextResponse.json(
        { message: data?.message },
        { status: response.status }
      );
    }

    // New backend wraps everything in { status, code, payload }, and the
    // exact cart shape isn't documented beyond "payload": "string" - map it
    // onto the { message, numOfCartItems, cart: { cartItems: [...] }, price }
    // shape the cart page / header badge expect, and normalize each
    // embedded product (id -> _id, cover -> imgCover, etc.) the same way
    // every other product-returning endpoint in this app does.
    return NextResponse.json(normalizeCart(data?.payload ?? data));
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ message }, { status: 500 });
  }
}
