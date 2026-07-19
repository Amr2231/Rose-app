"use client";

// Types
interface StepProgressProps {
  currentStep: number;
  totalSteps: number;
  isRTL: boolean;
}

// Component
export function StepProgress({
  currentStep,
  totalSteps,
  isRTL,
}: StepProgressProps) {
  const progressWidth = `${(currentStep / totalSteps) * 100}%`;

  return (
    <div className="relative" dir={isRTL ? "rtl" : "ltr"}>
      {/* Background track */}
      <div className="absolute top-2.5 left-0 right-0 border-4 h-2 bg-gray-200 rounded-full" />

      {/* Progress bar */}
      <div
        className={`absolute top-2.5 h-2 bg-maroon-600 rounded-full transition-all duration-300 ${
          isRTL ? "right-0" : "left-0"
        }`}
        style={{ width: progressWidth }}
      />

      {/* Step circles */}
      <div className="relative flex justify-around px-2">
        {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
          <div
            key={step}
            className={`w-7 h-7 rounded-full text-sm flex items-center justify-center font-semibold ${
              step <= currentStep
                ? "bg-maroon-600 text-white"
                : "bg-zinc-200 text-zinc-500"
            }`}
          >
            {step}
          </div>
        ))}
      </div>
    </div>
  );
}
