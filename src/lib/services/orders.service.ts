import { getToken } from "../utils/manage-token";
import { getServerApiBase } from "../utils/api-response";
import { normalizeOrders } from "../utils/normalize-order";

export async function getOrders(): Promise<OrdersResponse> {
  const token = await getToken();
  const accessToken = token?.accesstoken;

  if (!accessToken) {
    throw new Error("Unauthorized");
  }

  const response = await fetch(`${getServerApiBase()}/api/orders`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    cache: "no-store",
  });

  const data = await response.json().catch(() => null);

  if (!response.ok || data?.status === false) {
    throw new Error(data?.message || "Failed to fetch orders");
  }

  const rawPayload = data?.payload ?? data;
  const rawOrders = Array.isArray(rawPayload)
    ? rawPayload
    : Array.isArray(rawPayload?.orders)
      ? rawPayload.orders
      : Array.isArray(rawPayload?.items)
        ? rawPayload.items
        : Array.isArray(rawPayload?.data)
          ? rawPayload.data
          : [];

  return {
    message: "success",
    metadata: rawPayload?.metadata ?? {
      currentPage: rawPayload?.page ?? 1,
      limit: rawPayload?.limit ?? rawOrders.length,
      totalPages: rawPayload?.totalPages ?? 1,
      totalItems: rawPayload?.total ?? rawOrders.length,
    },
    // Map new backend field names/enums (id/status/paymentMethod/
    // paymentStatus/...) onto what the UI expects (_id/state/paymentType/
    // isPaid/isDelivered/orderNumber) - see normalize-order.ts.
    orders: normalizeOrders(rawOrders),
  };
}
