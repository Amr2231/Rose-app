import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

// The new backend's Swagger doc has no "related/recommendations" endpoint
// (Auth/Upload/Users/Categories/SubCategories/Occasions/Products/Cart/
// Addresses/Reviews/Wishlist/Notifications/Orders/Coupons/Testimonials/
// Blogs/Payments are the only modules listed). Rather than call a guessed
// URL that will always 404, this now returns an empty list so the UI that
// renders "personalized products" degrades gracefully. If this feature is
// still wanted, it needs a real endpoint from the backend team.
export async function GET(request: NextRequest) {
  try {
    const token = await getToken({ req: request });

    if (!token?.accesstoken || !token?._id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    return NextResponse.json({ products: [] });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ message }, { status: 500 });
  }
}
