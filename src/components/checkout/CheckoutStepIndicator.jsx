/**
 * CheckoutStepIndicator Component
 * Shows progress through checkout steps (Shipping → Payment → Done)
 */

export default function CheckoutStepIndicator({ currentStep }) {
  const steps = [
    { number: 1, label: 'Shipping' },
    { number: 2, label: 'Payment' },
    { number: 3, label: 'Done' },
  ];

  return (
    <div className="flex items-center justify-center mb-8">
      {steps.map((step, index) => (
        <div key={step.number} className="flex items-center">
          {/* Step circle and label */}
          <div className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                currentStep >= step.number
                  ? 'bg-accent text-white'
                  : 'bg-dark/10 text-dark/40'
              }`}
            >
              {step.number}
            </div>
            <span
              className={`ml-2 text-sm font-medium transition-colors ${
                currentStep >= step.number ? 'text-accent' : 'text-dark/40'
              }`}
            >
              {step.label}
            </span>
          </div>

          {/* Connector line (not after last step) */}
          {index < steps.length - 1 && (
            <div
              className={`w-16 sm:w-24 h-0.5 mx-3 transition-colors ${
                currentStep > step.number ? 'bg-accent' : 'bg-dark/10'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}
