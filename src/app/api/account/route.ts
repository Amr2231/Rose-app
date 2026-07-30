import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { getServerApiBase } from "@/lib/utils/api-response";

export async function GET(request: NextRequest) {
  try {
    const token = await getToken({ req: request });

    if (!token?.accesstoken) {
      return NextResponse.json(
        { message: "Unauthorized ❌❌" },
        { status: 401 }
      );
    }

    // NEW backend: GET /api/users/profile -> { status, code, payload: { user } }
    const response = await fetch(`${getServerApiBase()}/api/users/profile`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token.accesstoken}`,
      },
    });

    const data = await response.json();

    if (!response.ok || data?.status === false) {
      return NextResponse.json(
        { message: data?.message ?? "Failed to fetch profile" },
        { status: response.status }
      );
    }

    // NOTE: the new backend's user shape differs from the old one
    // (id vs _id, MALE/USER uppercase enums, no embedded wishlist/addresses).
    // Passing the payload straight through for now - the profile UI that
    // reads user._id / user.gender === "male" / user.wishlist etc. will need
    // a follow-up pass to match the new field names.
    return NextResponse.json(data.payload ?? data);
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ message }, { status: 500 });
  }
}
