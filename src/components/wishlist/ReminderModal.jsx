import { useState } from "react";
import { X, Calendar, Type } from "lucide-react";

export default function ReminderModal({ isOpen, onClose, onSave, item }) {
  // Extract existing data securely using optional chaining
  // Schema: item.reminder.date / item.reminder.note
  const existingDate = item?.reminder?.date ? new Date(item.reminder.date).toISOString().split("T")[0] : "";
  const existingNote = item?.reminder?.note || "";

  const [date, setDate] = useState(existingDate);
  const [note, setNote] = useState(existingNote);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Pass cakeId (handle both populated object or string ID string)
    const cakeId = item.cake._id || item.cake;
    
    await onSave(cakeId, date, note);
    
    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl animate-in fade-in zoom-in-95 duration-200">
        
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-serif text-dark">Set Reminder</h3>
          <button onClick={onClose} className="p-1 hover:bg-dark/5 rounded-full transition-colors">
            <X size={20} className="text-dark/50" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-dark/70 mb-1.5">
              Celebration Date
            </label>
            <div className="relative">
              <Calendar size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark/40" />
              <input
                type="date"
                required
                min={new Date().toISOString().split("T")[0]}
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-dark/5 border-none rounded-lg focus:ring-2 focus:ring-accent/20 outline-none text-dark"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-dark/70 mb-1.5">
              Note (Optional)
            </label>
            <div className="relative">
              <Type size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark/40" />
              <input
                type="text"
                placeholder="e.g. Mom's Birthday"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-dark/5 border-none rounded-lg focus:ring-2 focus:ring-accent/20 outline-none text-dark"
              />
            </div>
          </div>

          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 border border-dark/10 rounded-lg text-dark/70 hover:bg-dark/5 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-2.5 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors font-medium disabled:opacity-50"
            >
              {isSubmitting ? "Saving..." : "Save Reminder"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}