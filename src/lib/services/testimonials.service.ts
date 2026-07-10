import { getServerApiBase } from "../utils/api-response";
import { normalizeTestimonials } from "../utils/normalize-testimonial";

type TestimonialsResponse = {
  testimonials: TestimonialProps[];
};

export async function getTestimonials(): Promise<TestimonialsResponse> {
  const res = await fetch(`${getServerApiBase()}/api/testimonials`, {
    next: { revalidate: 300 },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch testimonials");
  }

  const data = await res.json();
  const rawPayload = data?.payload ?? data;
  const rawTestimonials = Array.isArray(rawPayload)
    ? rawPayload
    : Array.isArray(rawPayload?.testimonials)
      ? rawPayload.testimonials
      : Array.isArray(rawPayload?.items)
        ? rawPayload.items
        : Array.isArray(rawPayload?.data)
          ? rawPayload.data
          : [];

  return { testimonials: normalizeTestimonials(rawTestimonials) };
}
