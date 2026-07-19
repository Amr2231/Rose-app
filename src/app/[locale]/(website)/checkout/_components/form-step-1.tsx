"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PhoneInput } from "@/components/ui/phone-input";
import { Textarea } from "@/components/ui/textarea";
import { AddressFormData } from "@/lib/types/address";

// Types
interface AddressFormStep1Props {
  formData: AddressFormData;
  onChange: (field: keyof AddressFormData, value: string) => void;
  onNext: () => void;
  isRTL: boolean;
  translations: {
    title: string;
    addressTitleLabel: string;
    addressTitlePlaceholder: string;
    cityLabel: string;
    cityPlaceholder: string;
    streetLabel: string;
    streetPlaceholder: string;
    phoneLabel: string;
    phonePlaceholder: string;
    next: string;
  };
}

// Component
export function AddressFormStep1({
  formData,
  onChange,
  onNext,
  isRTL,
  translations: t,
}: AddressFormStep1Props) {
  const isValid =
    formData.title && formData.phone && formData.city && formData.street;

  // Render
  return (
    <div
      className={`space-y-5 ${isRTL ? "text-right" : "text-left"}`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <h3 className="text-2xl text-maroon-600 font-medium border-b pb-2">
        {t.title}
      </h3>

      {/* Address label, e.g. Home / Work */}
      <div className="space-y-1.5">
        <Label htmlFor="addressTitle">{t.addressTitleLabel}</Label>
        <Input
          id="addressTitle"
          dir={isRTL ? "rtl" : "ltr"}
          value={formData.title}
          onChange={(e) => onChange("title", e.target.value)}
          placeholder={t.addressTitlePlaceholder}
        />
      </div>

      {/* City */}
      <div className="space-y-1.5">
        <Label htmlFor="city">{t.cityLabel}</Label>
        <Input
          id="city"
          dir={isRTL ? "rtl" : "ltr"}
          value={formData.city}
          onChange={(e) => onChange("city", e.target.value)}
          placeholder={t.cityPlaceholder}
        />
      </div>

      {/* Street */}
      <div className="space-y-1.5">
        <Label htmlFor="street">{t.streetLabel}</Label>
        <Textarea
          id="street"
          dir={isRTL ? "rtl" : "ltr"}
          value={formData.street}
          onChange={(e) => onChange("street", e.target.value)}
          placeholder={t.streetPlaceholder}
          rows={4}
        />
      </div>

      {/* Phone */}
      <div className="space-y-1.5 pb-12">
        <Label htmlFor="phone">{t.phoneLabel}</Label>
        <PhoneInput
          id="phone"
          dir={isRTL ? "rtl" : "ltr"}
          value={formData.phone || ""}
          onChange={(value) => onChange("phone", value ?? "")}
          placeholder={t.phonePlaceholder}
        />
      </div>

      {/* Next Button */}
      <Button
        className="mt-6 w-full h-12 rounded-md font-medium"
        onClick={onNext}
        disabled={!isValid}
      >
        {t.next}
      </Button>
    </div>
  );
}