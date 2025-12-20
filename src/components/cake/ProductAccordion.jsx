/**
 * ProductAccordion Component
 * Collapsible sections for product details
 */

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

function AccordionItem({ title, children, defaultOpen = false }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-dark/10">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-4 text-left"
      >
        <span className="font-medium text-dark">{title}</span>
        <ChevronDown
          size={20}
          className={`text-dark/50 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      <div
        className={`overflow-hidden transition-all duration-200 ${
          isOpen ? 'max-h-96 pb-4' : 'max-h-0'
        }`}
      >
        <div className="text-sm sm:text-base text-dark/60 leading-relaxed">
          {children}
        </div>
      </div>
    </div>
  );
}

export default function ProductAccordion({
  ingredients,
  storageInfo,
  deliveryInfo
}) {
  return (
    <div className="border-t border-dark/10">
      {ingredients && (
        <AccordionItem title="Ingredients" defaultOpen>
          {ingredients}
        </AccordionItem>
      )}

      {storageInfo && (
        <AccordionItem title="Storage & Care">
          {storageInfo}
        </AccordionItem>
      )}

      {deliveryInfo && (
        <AccordionItem title="Delivery Info">
          {deliveryInfo}
        </AccordionItem>
      )}
    </div>
  );
}
