import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

// Internal helper component
function AccordionItem({ title, children, defaultOpen = false }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-dark/10">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-4 text-left"
      >
        <span className="text-sm sm:text-base text-dark">{title}</span>
        {isOpen ? (
          <ChevronUp size={20} className="text-dark/40" />
        ) : (
          <ChevronDown size={20} className="text-dark/40" />
        )}
      </button>
      <div
        className={`overflow-hidden transition-all duration-200 ${
          isOpen ? "max-h-96 pb-4" : "max-h-0"
        }`}
      >
        <div className="text-sm text-dark/60 leading-relaxed">{children}</div>
      </div>
    </div>
  );
}

export default function CakeInfoAccordion({
  ingredients = [],
  storageAndCare,
  deliveryInfo,
}) {
  return (
    <div className="border-t border-dark/10">
      {ingredients?.length > 0 && (
        <AccordionItem title="Ingredients" defaultOpen>
          {ingredients.join(", ")}
        </AccordionItem>
      )}

      {storageAndCare && (
        <AccordionItem title="Storage & Care">{storageAndCare}</AccordionItem>
      )}

      <AccordionItem title="Delivery Info">
        {deliveryInfo?.deliveryNote ||
          "Standard delivery within 2-3 business days. Express delivery available for orders placed before 2 PM."}
      </AccordionItem>
    </div>
  );
}