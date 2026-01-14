import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Trash2, Bell, ShoppingCart, Plus, Minus, Gift, Heart, ChevronRight, Calendar } from "lucide-react";
import { toast } from "react-toastify";
import useWishlistStore from "../stores/wishlistStore";
import useCartStore from "../stores/cartStore";
import useAuthStore from "../stores/authStore";
import ReminderModal from "../components/wishlist/ReminderModal"; // Import the modal
import DeleteConfirmationModal from "../components/common/DeleteModal";
 // Import delete confirmation modal



function WishlistItemCard({ item, onRemove, onAddToCart, isLoading, onSetReminder }) {
  const [quantity, setQuantity] = useState(1);
  const cakeData = typeof item === "string" ? null : item.cake;
  const cakeId = typeof item === "string" ? item : item.cake?._id;

  // Schema check: item.reminder is an object
  const hasReminder = item.reminder?.enabled && item.reminder?.date;
  const reminderDate = hasReminder ? new Date(item.reminder.date) : null;

  // Skeleton Loader
  if (!cakeData) return (
    <div className="bg-white rounded-2xl h-[340px] border border-gray-100 shadow-sm p-4">
      <div className="w-full h-48 bg-gray-100 rounded-xl animate-pulse mb-4" />
      <div className="h-4 w-3/4 bg-gray-100 rounded animate-pulse mb-2" />
      <div className="h-4 w-1/4 bg-gray-100 rounded animate-pulse" />
    </div>
  );

  return (
    <div className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all duration-300 flex flex-col h-full overflow-hidden relative">
      
      {/* --- Image Section --- */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-50">
        <img 
          src={cakeData.images?.[0]?.url} 
          alt={cakeData.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out" 
        />
        
        {/* Glass Remove Button */}
        <button 
          onClick={(e) => {
            e.preventDefault(); 
            onRemove(cakeId);
          }} 
          className="absolute top-3 right-3 w-8 h-8 bg-white/60 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center text-gray-500 hover:bg-red-50 hover:text-red-500 transition-colors z-10"
        >
          <Trash2 size={14} />
        </button>

        {/* Reminder Badge (Visual Indicator on Image) */}
        {hasReminder && (
          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1.5 shadow-sm border border-white/20">
            <Calendar size={12} className="text-orange-500" />
            <span className="text-[10px] font-bold text-gray-700 uppercase tracking-wide">
              {reminderDate.getDate()} {reminderDate.toLocaleString('default', { month: 'short' })}
            </span>
          </div>
        )}
      </div>

      {/* --- Content Section --- */}
      <div className="p-5 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-2">
          <Link to={`/cake/${cakeId}`} className="hover:text-orange-500 transition-colors">
            <h3 className="font-heading font-medium text-lg text-gray-900 line-clamp-1">{cakeData.name}</h3>
          </Link>
          <span className=" font-heading text-h4 font-bold text-lg text-orange-500">Rs. {cakeData.basePrice}</span>
        </div>
        
        <p className="font-body text-sm text-gray-500 line-clamp-2 mb-4 flex-1">
           {cakeData.description || "A delicious addition to your celebration."}
        </p>

        {/* --- Actions Row --- */}
        <div className="flex items-center gap-3 pt-4 border-t border-gray-100 mt-auto">
          {/* Add to Cart - Primary Action */}
          <button 
            onClick={() => onAddToCart({ cakeId, quantity })}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-xl hover:bg-gray-800 active:scale-95 transition-all shadow-sm hover:shadow"
          >
            <ShoppingCart size={16} /> 
            <span>Add to Cart</span>
          </button>
          
          {/* Set Reminder - Secondary Action */}
          <button
            onClick={() => onSetReminder(item)}
            className={`w-11 h-11 flex items-center justify-center rounded-xl border transition-all duration-200 active:scale-95 relative group/btn ${
              hasReminder
                ? "bg-orange-50 border-orange-200 text-orange-600" 
                : "bg-white border-gray-200 text-gray-400 hover:border-orange-200 hover:text-orange-500"
            }`}
            title={hasReminder ? `Reminder set for ${reminderDate.toLocaleDateString()}` : "Set reminder"}
          >
             {/* If reminder exists, show Bell with checkmark, else regular bell */}
            {hasReminder ? (
                <>
                    <Bell size={20} className="fill-current" />
                    <div className="absolute top-2 right-2.5 w-1.5 h-1.5 bg-orange-500 rounded-full border border-white" />
                </>
            ) : (
                <Bell size={20} />
            )}
            
            {/* Tooltip on Hover */}
            <span className="absolute bottom-full mb-2 hidden group-hover/btn:block bg-gray-800 text-white text-[10px] py-1 px-2 rounded whitespace-nowrap">
                {hasReminder ? "Edit Reminder" : "Set Reminder"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

// --- 2. Updated Sidebar Logic ---
function UpcomingCelebrations({ items }) {
  const reminders = items
    .filter((item) => item.reminder?.enabled && item.reminder?.date)
    .map((item) => {
        const date = new Date(item.reminder.date);
        const today = new Date();
        const diffTime = date - today;
        const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
        return { ...item, dateObj: date, daysLeft };
    })
    .filter((item) => item.daysLeft >= 0)
    .sort((a, b) => a.dateObj - b.dateObj);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-24">
      <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-4">
        <div className="p-2 bg-orange-50 rounded-lg text-orange-500">
             <Gift size={20} />
        </div>
        <h3 className="font-serif text-lg font-medium text-gray-900">Celebrations</h3>
      </div>

      {reminders.length === 0 ? (
        <div className="text-center py-8">
          <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3 text-gray-300">
            <Bell size={20} />
          </div>
          <p className="text-gray-400 text-sm">No upcoming reminders.</p>
          <p className="text-xs text-gray-300 mt-1">Mark items to get notified.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reminders.map((item) => (
            <div key={item.cake._id} className="group flex gap-4 items-start">
              {/* Date Box */}
              <div className="flex flex-col items-center justify-center min-w-[50px] h-[50px] bg-white border border-gray-200 rounded-xl shadow-sm group-hover:border-orange-200 group-hover:bg-orange-50 transition-colors">
                <span className="text-[10px] font-bold text-gray-400 uppercase group-hover:text-orange-400">
                    {item.dateObj.toLocaleString('default', { month: 'short' })}
                </span>
                <span className="text-lg font-bold text-gray-800 leading-none group-hover:text-orange-600">
                    {item.dateObj.getDate()}
                </span>
              </div>
              
              {/* Text Info */}
              <div className="pt-0.5">
                <p className="text-sm font-medium text-gray-900 line-clamp-1">
                    {item.reminder.note || "Celebration"}
                </p>
                <Link to={`/cake/${item.cake?._id}`} className="text-xs text-gray-500 hover:text-orange-500 transition-colors line-clamp-1">
                    {item.cake?.name}
                </Link>
                {item.daysLeft === 0 ? (
                    <span className="text-[10px] font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded mt-1 inline-block">Today!</span>
                ) : (
                    <span className="text-[10px] text-gray-400 mt-1 inline-block">{item.daysLeft} days to go</span>
                )}
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

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

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


  // --- Handlers: Delete ---
  const initiateDelete = (cakeId) => {
    setItemToDelete(cakeId);
    setIsDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;

    setIsDeleting(true);
    // Note: We don't need to pass isLoggedIn here, the store handles it now
    const result = await removeFromWishlist(itemToDelete);
    setIsDeleting(false);

    if (result.success) {
      setIsDeleteOpen(false);
      setItemToDelete(null);
      toast.success("Item removed from wishlist", {
        icon: "🗑️"
      });
    } else {
      toast.error(result.message || "Failed to remove item");
    }
  };

  return (
    <div className="min-h-[70vh] bg-white py-10 px-4">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main List */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-2xl font-serif mb-6">My Wishlist</h2>
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4 bg-gray-50 rounded-2xl border border-dashed border-gray-200 text-center">
               <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4 text-gray-300">
                 <Heart size={32} />
               </div>
               <h3 className="text-lg font-medium text-gray-900 mb-2 font-serif">Your wishlist is empty</h3>
               <p className="text-gray-500 mb-6 max-w-sm text-sm">
                 Looks like you haven't saved any cakes yet. Browse our menu to find your favorites!
               </p>
               <Link 
                 to="/menu" 
                 className="px-6 py-2.5 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors font-medium flex items-center gap-2 text-sm"
               >
                 <Gift size={16} />
                 Browse Menu
               </Link>
            </div>
          ) : (
            /* Existing Grid */
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {items.map((item) => (
                <WishlistItemCard 
                  key={item._id || item.cake?._id} 
                  item={item} 
                  onRemove={initiateDelete} 
                  onSetReminder={handleOpenReminder} 
                />
              ))}
            </div>
          )}
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

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal 
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={confirmDelete}
        isLoading={isDeleting}
      />
    </div>
  );
}