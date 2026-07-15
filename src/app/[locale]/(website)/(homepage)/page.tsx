import { Suspense } from "react";
import { OccProps } from "@/lib/types/occasion";
import CarouselComponent from "./_components/carousel-component";
import SecondSection from "./_components/second-section";
import BestSellingSection from "./_components/best-selling-section";
import MostPopularSection from "./_components/most-popular-section";
import SpecificationsComponent from "./_components/specifications-component";
import { Testimonials } from "./_components/testimonials";
import About from "./_components/about";
import Gallery from "./_components/gallery";
import Companies from "./_components/companies";

export default function Home({ searchParams }: OccProps) {
  return (
    <>
      <main className="flex flex-col py-10 gap-y-10">
        <div className="px-4 sm:px-8 lg:px-20 flex flex-col gap-y-10">
          <CarouselComponent />
          <SecondSection />
          <SpecificationsComponent />
          <BestSellingSection />
          <Suspense fallback={<div className="h-96 animate-pulse bg-zinc-100 rounded-lg" />}>
            <MostPopularSection searchParams={searchParams} />
          </Suspense>
          <About />
          <Gallery />
        </div>
        <Suspense fallback={<div className="h-[520px] animate-pulse bg-maroon-50" />}>
          <Testimonials />
        </Suspense>
        <div className="px-4 sm:px-8 lg:px-20">
          <Companies />
        </div>
      </main>
    </>
  );
}
