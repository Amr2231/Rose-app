import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { getServerApiBase } from "@/lib/utils/api-response";

export async function GET(request: NextRequest) {
  try {
    const token = await getToken({ req: request });

    if (!token || !token?.accesstoken) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    const response = await fetch(`${getServerApiBase()}/api/addresses`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token.accesstoken}`,
      },
      cache: "no-store",
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    // Normalize the backend's response shape so the client always gets
    // { message, addresses: Address[] } — regardless of whether the
    // backend nests the list under `addresses`, `data`, or returns it raw,
    // AND regardless of whether `payload` itself is the array or a
    // paginated object wrapping it (e.g. { addresses: [...], metadata }),
    // which is how this backend already shapes occasions/products lists.
    const rawPayload = data?.payload ?? data;
    const addresses = Array.isArray(rawPayload)
      ? rawPayload
      : Array.isArray(rawPayload?.addresses)
        ? rawPayload.addresses
        : Array.isArray(rawPayload?.items)
          ? rawPayload.items
          : Array.isArray(rawPayload?.data)
            ? rawPayload.data
            : Array.isArray(data?.addresses)
              ? data.addresses
              : Array.isArray(data?.data)
                ? data.data
                : Array.isArray(data)
                  ? data
                  : [];

    // Per-item field normalization: the new backend returns
    // `id`/`latitude`/`longitude`, but the "Shipping Address" quick-list
    // (ShippingAddress component, using the old checkout.d.ts Address
    // shape) reads `_id`/`lat`/`long` directly with no fallback - leaving
    // them unmapped meant `address._id` was undefined, which crashed on
    // `address._id.toString()` and kept the whole list from rendering.
    const normalizedAddresses = addresses.map((addr: any) => ({
      ...addr,
      _id: addr._id ?? addr.id,
      lat: addr.lat ?? addr.latitude,
      long: addr.long ?? addr.longitude,
    }));

    return NextResponse.json(
      { message: data?.message ?? "success", addresses: normalizedAddresses },
      { status: response.status },
    );
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ message }, { status: 500 });
  }
}
