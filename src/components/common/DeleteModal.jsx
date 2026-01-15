import { X, AlertTriangle } from "lucide-react";

export default function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  isLoading,
  title = "Remove Item?",
  message = "Are you sure you want to remove this item?"
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm transition-all">
      <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-xl border border-gray-100 relative animate-in fade-in zoom-in duration-200">
        
        {/* Close Button */}
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <X size={20} />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle size={24} />
          </div>
          
          <h3 className="text-xl font-serif font-medium text-gray-900 mb-2">
            {title}
          </h3>

          <p className="text-gray-500 text-sm mb-6">
            {message}
          </p>

          <div className="flex gap-3 w-full">
            <button 
              onClick={onClose}
              className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={onConfirm}
              disabled={isLoading}
              className="flex-1 px-4 py-2.5 bg-red-500 text-white font-medium rounded-xl hover:bg-red-600 transition-colors shadow-sm disabled:opacity-50 flex justify-center"
            >
              {isLoading ? "Removing..." : "Remove"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}