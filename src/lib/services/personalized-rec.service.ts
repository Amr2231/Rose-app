"use server"

// The new backend's Swagger doc has no "related/recommendations" endpoint
// (see modules list: Auth, Upload, Users, Categories, SubCategories,
// Occasions, Products, Cart, Addresses, Reviews, Wishlist, Notifications,
// Orders, Coupons, Testimonials, Blogs, Payments). Guessing a URL just
// means this always 404s, so it now fails soft instead of throwing and
// breaking whatever page renders it. If this feature is still wanted,
// it needs a real endpoint from the backend team.
export async function getPersonalizedRecommendations(
  _id: string
): Promise<RecommendationsResponse> {
    return { message: "", count: 0, recommendations: [] };
}