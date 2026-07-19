"use client";

import React from "react";
import ShippingAddress from "./shipping-address";
import PaymentMethod from "./payment-method";
import StepsShow from "./steps-show";

export default function StepsFlow() {
  // states
  const [step, setStep] = React.useState<string>("shipping_address");
  const [street, setStreet] = React.useState<string>("");
  const [phone, setPhone] = React.useState<string>("");
  const [city, setCity] = React.useState<string>("");
  const [lat, setLat] = React.useState<string>("");
  const [long, setLong] = React.useState<string>("");
  const [id, setId] = React.useState<string>("");

  return (
    <div className="lg:col-span-8">
      {/* steps progress */}
      <StepsShow step={step} />
      {/* choose componant which appeared   */}
      {step === "shipping_address" ? (
        // shipping address component
        <ShippingAddress
          setStep={setStep}
          id={id}
          setId={setId}
          setStreet={setStreet}
          setPhone={setPhone}
          setCity={setCity}
          setLat={setLat}
          setLong={setLong}
        />
      ) : (
        // payment method component
        <>
          <PaymentMethod setStep={setStep} id={id} />
        </>
      )}
    </div>
  );
}
