import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { getServerApiBase } from "@/lib/utils/api-response";

// NOTE: this route isn't actually used anywhere in the app (the checkout
// UI calls lib/actions/checkout.actions.ts -> AddCheckoutCash server action
// directly, not this API route - see lib/services/checkout.service.ts for
// the one unused caller). Forwards straight to the new backend's
// POST /api/orders, which expects { addressId, paymentMethod, couponCode?,
// notes? }. Card payments go through a separate step after order creation:
// POST /api/payments/create-intent + POST /api/payments/confirm (see
// lib/actions/payments.actions.ts) - the client-side Stripe Elements card
// form to drive that still needs to be built (no Stripe.js dependency is
// installed yet).
export async function POST(request: NextRequest) {
  const body = await request.json();
  try {
    const token = await getToken({ req: request });

    if (!token || !token?.accesstoken) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    const response = await fetch(`${getServerApiBase()}/api/orders`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token.accesstoken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    return NextResponse.json(data?.payload ?? data, {
      status: response.status,
    });
  } catch {
    return NextResponse.json(
      { error: "something went wrong" },
      { status: 500 }
    );
  }
}
