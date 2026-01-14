import React from "react";
import PropTypes from "prop-types";
import * as LucideIcons from "lucide-react";

/**
 * StepIndicator - Shows the current step in the configuration process
 * Displays a vertical list of steps with icons and status indicators
 */
export const StepIndicator = ({ steps, currentStep, onStepClick }) => {
  const currentIndex = steps.findIndex((step) => step.id === currentStep);

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xs font-bold text-dark/50 mb-2 tracking-widest uppercase">
        Customize Your Cake
      </h2>
      <div className="flex flex-col gap-3">
        {steps.map((step, index) => {
          const Icon = LucideIcons[step.icon] || LucideIcons.Circle;
          const isActive = step.id === currentStep;
          const isCompleted = index < currentIndex;
          const isAccessible = index <= currentIndex;

          return (
            <button
              key={step.id}
              type="button"
              onClick={() => isAccessible && onStepClick(step.id)}
              disabled={!isAccessible}
              className={`text-left text-sm font-medium transition-all duration-300 flex items-center gap-3 group disabled:opacity-40 disabled:cursor-not-allowed
                ${
                  isActive
                    ? "text-accent translate-x-1"
                    : isCompleted
                    ? "text-dark hover:text-accent"
                    : "text-dark/40 hover:text-dark/60"
                }
              `}
            >
              {/* Icon/Indicator */}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all
                ${
                  isActive
                    ? "border-accent bg-accent/10 text-accent"
                    : isCompleted
                    ? "border-accent/50 bg-accent/5 text-accent"
                    : "border-dark/20 bg-transparent text-dark/40 group-hover:border-dark/40"
                }
              `}
              >
                {isCompleted ? (
                  <LucideIcons.Check size={16} strokeWidth={2.5} />
                ) : (
                  <Icon size={16} strokeWidth={2} />
                )}
              </div>

              {/* Label */}
              <div className="flex-1">
                <div className="font-medium">{step.label}</div>
                <div
                  className={`text-xs mt-0.5 ${
                    isActive
                      ? "text-accent/70"
                      : isCompleted
                      ? "text-dark/50"
                      : "text-dark/30"
                  }`}
                >
                  {step.description}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

StepIndicator.propTypes = {
  steps: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      icon: PropTypes.string,
      description: PropTypes.string,
    })
  ).isRequired,
  currentStep: PropTypes.string.isRequired,
  onStepClick: PropTypes.func.isRequired,
};

/**
 * CompactStepIndicator - Mobile-friendly horizontal step indicator
 */
export const CompactStepIndicator = ({ steps, currentStep }) => {
  const currentIndex = steps.findIndex((step) => step.id === currentStep);
  const progress = ((currentIndex + 1) / steps.length) * 100;

  return (
    <div className="w-full">
      {/* Progress Bar */}
      <div className="relative h-1 bg-dark/10 rounded-full overflow-hidden mb-4">
        <div
          className="absolute inset-y-0 left-0 bg-accent transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Current Step Info */}
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm font-medium text-dark">
            Step {currentIndex + 1} of {steps.length}
          </div>
          <div className="text-xs text-dark/60 mt-0.5">
            {steps[currentIndex]?.label}
          </div>
        </div>
        <div className="text-xs font-medium text-accent">
          {Math.round(progress)}% Complete
        </div>
      </div>
    </div>
  );
};

CompactStepIndicator.propTypes = {
  steps: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  currentStep: PropTypes.string.isRequired,
};
