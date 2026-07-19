import { Metadata } from "next";
import React from "react";
import StepsFlow from "./_components/steps-flow";
import CheckoutSummary from "./_components/checkout-summary";
import CheckoutRecommendations from "./_components/checkout-recommendations";

export const metadata: Metadata = {
  title: "Checkout Page",
};

export default function page() {
  return (
    <div className="flex justify-center pt-8 pb-16">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* left section */}
          <StepsFlow />
          <div className="lg:col-span-4">
            {/* right section */}
            <CheckoutSummary />
          </div>
          {/* Products You May Like */}
          <CheckoutRecommendations />
        </div>
      </div>
    </div>
  );
}
