import { Check } from "lucide-react";

interface ProgressStepsProps {
  steps: string[];
  currentStep: number;
}

export default function ProgressSteps({ steps, currentStep }: ProgressStepsProps) {
  return (
    <ol className="flex items-center justify-between gap-2" aria-label="Registration progress">
      {steps.map((step, index) => {
        const stepNumber = index + 1;
        const isComplete = stepNumber < currentStep;
        const isActive = stepNumber === currentStep;

        return (
          <li key={step} className="flex flex-1 flex-col items-center gap-2 text-center">
            <div className="flex w-full items-center">
              <div
                aria-current={isActive ? "step" : undefined}
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                  isComplete
                    ? "bg-[#2563EB] text-white"
                    : isActive
                    ? "border-2 border-[#2563EB] text-[#2563EB]"
                    : "border-2 border-slate-200 text-[#94A3B8]"
                }`}
              >
                {isComplete ? <Check className="h-4 w-4" aria-hidden="true" /> : stepNumber}
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`h-0.5 flex-1 transition-colors ${
                    isComplete ? "bg-[#2563EB]" : "bg-slate-200"
                  }`}
                />
              )}
            </div>
            <span
              className={`hidden text-xs font-medium sm:block ${
                isActive ? "text-[#2563EB]" : "text-[#64748B]"
              }`}
            >
              {step}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
