/**
 * Testimonials are public submissions (see POST /api/testimonials, which
 * takes { name, email, content, rating, image } and requires no auth) -
 * unlike reviews, there's no user account behind them to populate. The
 * backend's GET /api/testimonials most likely returns a flat
 * { id, name, image, content, rating, isApproved, createdAt, updatedAt }
 * record per the same id/field-naming pattern used everywhere else in the
 * new API. This normalizes that down to the { _id, name, image, rating,
 * content, updatedAt } contract the UI expects.
 */
export function normalizeTestimonial(raw: any): TestimonialProps {
  return {
    _id: raw._id ?? raw.id ?? "",
    name: raw.name ?? "",
    image: raw.image ?? raw.photo ?? "",
    rating: Number(raw.rating ?? 0),
    content: raw.content ?? "",
    updatedAt: raw.updatedAt ?? raw.createdAt ?? "",
  };
}

export function normalizeTestimonials(rawList: any[]): TestimonialProps[] {
  if (!Array.isArray(rawList)) return [];
  return rawList.map(normalizeTestimonial);
}
