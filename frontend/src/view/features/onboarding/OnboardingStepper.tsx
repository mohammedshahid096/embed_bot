import { Building2, Globe, Check } from "lucide-react";
import { useLocation } from "react-router-dom";

const ONBOARDING_STEPS = [
  {
    id: 1,
    label: "Company Details",
    path: "/onboard/organisation-details",
    icon: Building2,
  },
  {
    id: 2,
    label: "Website URLs",
    path: "/onboard/website-urls",
    icon: Globe,
  },
];

export default function OnboardingStepper() {
  const location = useLocation();

  const currentStepIndex = ONBOARDING_STEPS.findIndex(
    (step) => step.path === location.pathname
  );

  return (
    <div className="w-full max-w-md mx-auto mb-10 animate-in fade-in slide-in-from-top-2 duration-500">
      <div className="flex items-center justify-center">
        {ONBOARDING_STEPS.map((step, index) => {
          const StepIcon = step.icon;
          const isActive = index === currentStepIndex;
          const isCompleted = index < currentStepIndex;

          return (
            <div key={step.id} className="flex items-center">
              {/* Step circle + label */}
              <div className="flex flex-col items-center gap-2">
                <div
                  className={`
                    relative flex h-10 w-10 items-center justify-center rounded-full 
                    transition-all duration-500 ease-out
                    ${
                      isCompleted
                        ? "bg-gradient-to-br from-purple-600 to-blue-600 shadow-lg shadow-purple-500/30 scale-100"
                        : isActive
                          ? "bg-gradient-to-br from-purple-600 to-blue-600 shadow-lg shadow-purple-500/30 ring-4 ring-purple-500/20 scale-110"
                          : "bg-white/5 border border-white/15"
                    }
                  `}
                >
                  {isCompleted ? (
                    <Check className="h-4.5 w-4.5 text-white stroke-[2.5]" />
                  ) : (
                    <StepIcon
                      className={`h-4.5 w-4.5 transition-colors duration-300 ${
                        isActive ? "text-white" : "text-muted-foreground/50"
                      }`}
                    />
                  )}

                  {/* Glow pulse for active step */}
                  {isActive && (
                    <span className="absolute inset-0 rounded-full bg-purple-500/20 animate-ping opacity-75" />
                  )}
                </div>

                <span
                  className={`text-[11px] font-medium tracking-wide transition-colors duration-300 ${
                    isActive
                      ? "text-purple-400"
                      : isCompleted
                        ? "text-foreground/70"
                        : "text-muted-foreground/40"
                  }`}
                >
                  {step.label}
                </span>
              </div>

              {/* Connector line between steps */}
              {index < ONBOARDING_STEPS.length - 1 && (
                <div className="relative mx-4 mb-6 h-[2px] w-20 overflow-hidden rounded-full bg-white/10">
                  <div
                    className={`absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-700 ease-out ${
                      isCompleted ? "w-full" : "w-0"
                    }`}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
