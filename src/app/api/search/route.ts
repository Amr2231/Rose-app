import { NextResponse } from "next/server";
import { getServerApiBase } from "@/lib/utils/api-response";

// NOTE: this route wasn't actually called from anywhere in the app (dead
// code), and had two bugs: a hardcoded old-backend URL, and a missing "?"
// before the query string (so filters were silently being ignored even on
// the old backend). Pointed it at the new backend's /api/products for now,
// since the new Swagger doc has no dedicated "/search/products" endpoint -
// confirm with the backend team if full-text search should live elsewhere.
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const queryString = searchParams.toString();

        const response = await fetch(
            `${getServerApiBase()}/api/products${queryString ? `?${queryString}` : ""}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        const data = await response.json();

        if (!response.ok || data?.status === false) {
            return NextResponse.json(
                { error: data.message || "Backend Error" },
                { status: response.status }
            );
        }

        return NextResponse.json(data.payload ?? data);
    } catch (error) {
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}