import { getTestimonials } from "@/lib/services/testimonials.service";
import { getTranslations } from "next-intl/server";
import TitleOfSection from "@/components/shared/title-of-section";
import { TestimonialsCarousel } from "./testimonials-carousel";
import EmptyTestimonials from "./empty-testimonials";

export async function Testimonials() {
  const t = await getTranslations("testimonials");

  let testimonials: TestimonialProps[] = [];

  try {
    const data = await getTestimonials();
    testimonials = data.testimonials ?? [];
  } catch {
    testimonials = [];
  }

  return (
    <section>
      <TitleOfSection title={t("title")} subtitle={t("sub-title")} />
      <div className="bg-maroon-50 dark:bg-zinc-700 px-4 py-14 overflow-hidden min-h-[520px]">
        {testimonials.length > 0 ? (
          <TestimonialsCarousel testimonials={testimonials} />
        ) : (
          <EmptyTestimonials />
        )}
      </div>
    </section>
  );
}
