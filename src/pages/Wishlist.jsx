import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Trash2, Bell, ShoppingCart, Plus, Minus, Gift, Heart, ChevronRight } from "lucide-react";
import { toast } from "react-toastify";
import useWishlistStore from "../stores/wishlistStore";
import useCartStore from "../stores/cartStore";
import useAuthStore from "../stores/authStore";
import ReminderModal from "../components/wishlist/ReminderModal"; // Import the modal

// --- 1. Updated Item Card ---
function WishlistItemCard({ item, onRemove, onAddToCart, isLoading, onSetReminder }) {
  const [quantity, setQuantity] = useState(1);
  const cakeData = typeof item === "string" ? null : item.cake;
  const cakeId = typeof item === "string" ? item : item.cake?._id;

  // Schema check: item.reminder is an object
  const hasReminder = item.reminder?.enabled && item.reminder?.date;

  if (!cakeData) return <div className="bg-white rounded-2xl h-48 animate-pulse bg-dark/5" />;

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-dark/5">
      {/* ... Image Section (Same as before) ... */}
      <div className="relative">
        <img src={cakeData.images?.[0]?.url} alt={cakeData.name} className="w-full aspect-4/3 object-cover" />
        <button onClick={() => onRemove(cakeId)} className="absolute top-3 right-3 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center text-red-500 hover:bg-white shadow-sm">
          <Trash2 size={16} />
        </button>
      </div>

      <div className="p-4">
        <div className="flex justify-between mb-2">
          <h3 className="font-medium text-dark">{cakeData.name}</h3>
          <span className="text-accent font-medium">Rs. {cakeData.basePrice}</span>
        </div>
        
        {/* Actions Row */}
        <div className="flex items-center gap-2 mt-4">
          <button 
            onClick={() => onAddToCart({ cakeId, quantity })}
            className="flex-1 flex items-center justify-center gap-2 py-2 bg-dark text-white text-sm rounded-lg hover:bg-dark/90"
          >
            <ShoppingCart size={16} /> Add
          </button>
          
          {/* UPDATED BELL BUTTON */}
          <button
            onClick={() => onSetReminder(item)}
            className={`w-10 h-10 flex items-center justify-center border rounded-lg transition-colors ${
              hasReminder
                ? "border-accent text-accent bg-accent/5" 
                : "border-dark/15 text-dark/40 hover:text-accent hover:border-accent"
            }`}
            title={hasReminder ? `Reminder: ${new Date(item.reminder.date).toLocaleDateString()}` : "Set reminder"}
          >
            <Bell size={18} fill={hasReminder ? "currentColor" : "none"} />
          </button>
        </div>
      </div>
    </div>
  );
}

// --- 2. Updated Sidebar Logic ---
function UpcomingCelebrations({ items }) {
  // Filter and Sort based on Schema
  const reminders = items
    .filter((item) => item.reminder?.enabled && item.reminder?.date)
    .map((item) => {
        const date = new Date(item.reminder.date);
        const today = new Date();
        // Calculate days difference
        const diffTime = date - today;
        const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
        return { ...item, dateObj: date, daysLeft };
    })
    .filter((item) => item.daysLeft >= 0) // Only future dates
    .sort((a, b) => a.dateObj - b.dateObj); // Nearest first

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm sticky top-24 border border-dark/5">
      <div className="flex items-center gap-2 mb-4">
        <Gift size={18} className="text-accent" />
        <h3 className="font-medium text-dark">Upcoming Celebrations</h3>
      </div>

      {reminders.length === 0 ? (
        <div className="text-center py-6 text-dark/40 text-sm">
          <p>No reminders set.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {reminders.map((item) => (
            <div key={item.cake._id} className="flex gap-3 p-3 rounded-lg hover:bg-dark/5 transition-colors">
              <div className="flex flex-col items-center justify-center w-12 h-12 bg-accent/10 rounded-lg text-accent">
                <span className="text-[10px] font-bold uppercase">{item.dateObj.toLocaleString('default', { month: 'short' })}</span>
                <span className="text-lg font-bold leading-none">{item.dateObj.getDate()}</span>
              </div>
              <div>
                <p className="text-sm font-medium text-dark">{item.reminder.note || "Celebration"}</p>
                <p className="text-xs text-dark/50">{item.cake?.name}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// --- 3. Updated Main Component ---
export default function Wishlist() {
  const { items, fetchWishlist, removeFromWishlist, setReminder } = useWishlistStore();
  const { isAuthenticated } = useAuthStore();
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(null);

  useEffect(() => {
    if (isAuthenticated()) fetchWishlist();
  }, [fetchWishlist, isAuthenticated]);

  const handleOpenReminder = (item) => {
    setActiveItem(item);
    setIsModalOpen(true);
  };

  const handleSaveReminder = async (cakeId, date, note) => {
    const result = await setReminder(cakeId, date, note);
    if (result.success) {
      toast.success("Reminder set successfully!");
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className="min-h-[70vh] bg-white py-10 px-4">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main List */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-2xl font-serif mb-6">My Wishlist</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {items.map((item) => (
              <WishlistItemCard 
                key={item._id || item.cake?._id} 
                item={item} 
                onRemove={removeFromWishlist} 
                onSetReminder={handleOpenReminder} 
              />
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div>
          <UpcomingCelebrations items={items} />
        </div>
      </div>

      {/* Modal */}
      <ReminderModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleSaveReminder} 
        item={activeItem} 
      />
    </div>
  );
}