"use client";

import { useTranslations, useLocale } from "next-intl";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { StepProgress } from "../step-progress";
import { AddressFormStep1 } from "../form-step-1";
import { AddressFormStep2 } from "../form-step-2";
import { AddressFormData } from "@/lib/types/address";

// Types
interface FormViewProps {
  step: 1 | 2;
  formData: AddressFormData;
  mapPosition: { lat: number; lng: number };
  loading: boolean;
  editing: boolean;
  onFormChange: (field: keyof AddressFormData, value: string) => void;
  onNext: () => void;
  onBack: () => void;
  onSave: () => void;
  onLocationUpdate: (lat: number, lng: number) => void;
}

// Component
export function FormView({
  step,
  formData,
  mapPosition,
  loading,
  editing,
  onFormChange,
  onNext,
  onBack,
  onSave,
  onLocationUpdate,
}: FormViewProps) {
  // Translations
  const tForm = useTranslations("AddressForm");
  const tModal = useTranslations("addressModal");
  const tMap = useTranslations("MapPicker");

  // Locale
  const locale = useLocale();
  const isRTL = locale === "ar";

  return (
    <>
      <DialogHeader dir={isRTL ? "rtl" : "ltr"} className="px-4 sm:px-6 pt-4 sm:pt-6 pb-2">
        <DialogTitle className="text-xl sm:text-2xl md:text-3xl font-bold text-zinc-800 text-start">
          {editing ? tModal("edit-title") : tModal("add-title")}
        </DialogTitle>
      </DialogHeader>

      {/* Progress Bar */}
      <div className="px-4 sm:px-6">
        <StepProgress currentStep={step} totalSteps={2} isRTL={isRTL} />
      </div>

      {/* Step 1 */}
      {step === 1 && (
        <div className="px-4 sm:px-6 pb-6 overflow-y-auto">
          <AddressFormStep1
            formData={formData}
            onChange={onFormChange}
            onNext={onNext}
            isRTL={isRTL}
            translations={{
              title: tForm("title"),
              addressTitleLabel: tForm("addressTitleLabel"),
              addressTitlePlaceholder: tForm("addressTitlePlaceholder"),
              cityLabel: tForm("cityLabel"),
              cityPlaceholder: tForm("cityPlaceholder"),
              streetLabel: tForm("streetLabel"),
              streetPlaceholder: tForm("streetPlaceholder"),
              phoneLabel: tForm("phoneLabel"),
              phonePlaceholder: tForm("phonePlaceholder"),
              next: tModal("next"),
            }}
          />
        </div>
      )}

      {/* Step 2 */}
      {step === 2 && (
        <div className="px-4 sm:px-6 pb-6 overflow-y-auto">
          <AddressFormStep2
            mapPosition={mapPosition}
            loading={loading}
            isRTL={isRTL}
            editing={editing}
            onBack={onBack}
            onSave={onSave}
            onLocationUpdate={onLocationUpdate}
            translations={{
              selectLocation: tModal("select-location"),
              findLocation: tMap("findLocation"),
              notSupported: tMap("notSupported"),
              locationError: tMap("locationError"),
              saving: tModal("saving"),
              saveBtn: tModal("save-btn"),
              addBtn: tModal("add-btn"),
            }}
          />
        </div>
      )}
    </>
  );
}
