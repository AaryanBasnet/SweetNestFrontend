/**
 * ShippingStep Component
 * Step 1: Contact info, delivery schedule, address
 */

import { useState, useEffect } from 'react';
import { Mail, Calendar, MessageSquare, MapPin, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import useCheckoutStore from '../../stores/checkoutStore';
import useAuthStore from '../../stores/authStore';
import { AddressSelector } from '../address';

// Time slots
const TIME_SLOTS = [
  '09:00 AM - 12:00 PM',
  '12:00 PM - 03:00 PM',
  '03:00 PM - 06:00 PM',
];

// Get days in month
const getDaysInMonth = (year, month) => {
  return new Date(year, month + 1, 0).getDate();
};

// Get first day of month (0 = Sunday)
const getFirstDayOfMonth = (year, month) => {
  return new Date(year, month, 1).getDay();
};

// Simple Calendar Component
function DeliveryCalendar({ selectedDate, onSelectDate }) {
  const today = new Date();
  const minDate = new Date(today);
  minDate.setDate(minDate.getDate() + 2); // At least 2 days from now (24 hours notice)

  const [currentMonth, setCurrentMonth] = useState(minDate.getMonth());
  const [currentYear, setCurrentYear] = useState(minDate.getFullYear());

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDayOfMonth = getFirstDayOfMonth(currentYear, currentMonth);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const isDateDisabled = (day) => {
    const date = new Date(currentYear, currentMonth, day);
    return date < minDate;
  };

  const isDateSelected = (day) => {
    if (!selectedDate) return false;
    const date = new Date(currentYear, currentMonth, day);
    const selected = new Date(selectedDate);
    return (
      date.getDate() === selected.getDate() &&
      date.getMonth() === selected.getMonth() &&
      date.getFullYear() === selected.getFullYear()
    );
  };

  const handleDateClick = (day) => {
    if (isDateDisabled(day)) return;
    const date = new Date(currentYear, currentMonth, day);
    onSelectDate(date.toISOString());
  };

  // Can't go before current month
  const canGoPrev = currentYear > minDate.getFullYear() ||
    (currentYear === minDate.getFullYear() && currentMonth > minDate.getMonth());

  return (
    <div className="bg-white rounded-xl border border-dark/10 p-4">
      {/* Month Navigation */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium text-dark">
          {monthNames[currentMonth]} {currentYear}
        </span>
        <div className="flex items-center gap-1">
          <button
            onClick={prevMonth}
            disabled={!canGoPrev}
            className="p-1.5 rounded-lg hover:bg-dark/5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft size={16} className="text-dark/60" />
          </button>
          <button
            onClick={nextMonth}
            className="p-1.5 rounded-lg hover:bg-dark/5 transition-colors"
          >
            <ChevronRight size={16} className="text-dark/60" />
          </button>
        </div>
      </div>

      {/* Day Headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map((day) => (
          <div key={day} className="text-center text-xs text-dark/40 py-1">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {/* Empty cells for days before first of month */}
        {Array.from({ length: firstDayOfMonth }).map((_, i) => (
          <div key={`empty-${i}`} className="h-9" />
        ))}

        {/* Day cells */}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const disabled = isDateDisabled(day);
          const selected = isDateSelected(day);

          return (
            <button
              key={day}
              onClick={() => handleDateClick(day)}
              disabled={disabled}
              className={`h-9 rounded-lg text-sm font-medium transition-colors ${
                selected
                  ? 'bg-accent text-white'
                  : disabled
                  ? 'text-dark/20 cursor-not-allowed'
                  : 'text-dark hover:bg-dark/5'
              }`}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function ShippingStep({ onNext, errors = {} }) {
  const {
    shippingData,
    setShippingData,
    prefillFromUser,
    selectedAddressId,
    selectSavedAddress,
    useManualEntry,
  } = useCheckoutStore();
  const user = useAuthStore((state) => state.user);
  const [saveAddress, setSaveAddress] = useState(false);

  // Pre-fill from user on mount
  useEffect(() => {
    if (user && !shippingData.email) {
      prefillFromUser(user);
    }
  }, [user, prefillFromUser, shippingData.email]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setShippingData({ [name]: type === 'checkbox' ? checked : value });
  };

  const handleDateSelect = (date) => {
    setShippingData({ deliveryDate: date });
  };

  const handleTimeSelect = (time) => {
    setShippingData({ deliveryTime: time });
  };

  const handleSelectAddress = (address) => {
    selectSavedAddress(address);
  };

  const handleUseManualEntry = () => {
    useManualEntry();
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl sm:text-3xl font-serif text-dark text-center mb-8">
        Shipping Details
      </h1>

      {/* Contact Information */}
      <div className="bg-white rounded-2xl p-5 border border-dark/5">
        <div className="flex items-center gap-2 mb-4">
          <Mail size={18} className="text-dark/40" />
          <h3 className="font-medium text-dark">Contact Information</h3>
        </div>

        <div className="space-y-3">
          <div>
            <input
              type="email"
              name="email"
              value={shippingData.email}
              onChange={handleInputChange}
              placeholder="Email Address"
              className={`w-full px-4 py-3 bg-cream/30 rounded-xl text-dark text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all ${
                errors.email ? 'ring-2 ring-red-400' : ''
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="subscribeNewsletter"
              checked={shippingData.subscribeNewsletter}
              onChange={handleInputChange}
              className="w-4 h-4 rounded border-dark/20 text-accent focus:ring-accent/20"
            />
            <span className="text-sm text-dark/60">
              Keep me updated on news and exclusive offers
            </span>
          </label>
        </div>
      </div>

      {/* Delivery Schedule */}
      <div className="bg-white rounded-2xl p-5 border border-dark/5">
        <div className="flex items-center gap-2 mb-4">
          <Calendar size={18} className="text-dark/40" />
          <h3 className="font-medium text-dark">Delivery Schedule</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Calendar */}
          <div>
            <p className="text-sm text-dark/60 mb-2">Select Date</p>
            <DeliveryCalendar
              selectedDate={shippingData.deliveryDate}
              onSelectDate={handleDateSelect}
            />
            {errors.deliveryDate && (
              <p className="text-red-500 text-xs mt-1">{errors.deliveryDate}</p>
            )}
          </div>

          {/* Time Slots */}
          <div>
            <p className="text-sm text-dark/60 mb-2">Preferred Time</p>
            <div className="space-y-2">
              {TIME_SLOTS.map((slot) => (
                <button
                  key={slot}
                  onClick={() => handleTimeSelect(slot)}
                  className={`w-full px-4 py-3 rounded-xl text-sm font-medium text-left transition-colors ${
                    shippingData.deliveryTime === slot
                      ? 'bg-dark text-white'
                      : 'bg-cream/30 text-dark hover:bg-cream'
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
            {errors.deliveryTime && (
              <p className="text-red-500 text-xs mt-1">{errors.deliveryTime}</p>
            )}

            {/* Note */}
            <div className="mt-4 p-3 bg-amber-50 rounded-xl">
              <p className="text-xs text-amber-700">
                <span className="font-medium">Note:</span> We need at least 24 hours to
                prepare custom orders to ensure maximum freshness.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Special Requests */}
      <div className="bg-white rounded-2xl p-5 border border-dark/5">
        <div className="flex items-center gap-2 mb-4">
          <MessageSquare size={18} className="text-dark/40" />
          <h3 className="font-medium text-dark">Special Requests</h3>
        </div>

        <textarea
          name="specialRequests"
          value={shippingData.specialRequests}
          onChange={handleInputChange}
          placeholder='Add any special instructions for the baker or delivery driver (e.g. "Write Happy Birthday", "Ring the bell two times")...'
          rows={3}
          className="w-full px-4 py-3 bg-cream/30 rounded-xl text-dark text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 resize-none transition-all"
        />
      </div>

      {/* Shipping Address */}
      <div className="bg-white rounded-2xl p-5 border border-dark/5">
        <div className="flex items-center gap-2 mb-4">
          <MapPin size={18} className="text-dark/40" />
          <h3 className="font-medium text-dark">Shipping Address</h3>
        </div>

        {/* Address Selector - Only show if user is authenticated */}
        {user && (
          <div className="mb-5">
            <AddressSelector
              selectedAddressId={selectedAddressId}
              onSelectAddress={handleSelectAddress}
              onUseManualEntry={handleUseManualEntry}
            />
          </div>
        )}

        {/* Manual Entry Form - Show when no address selected or user not authenticated */}
        {(selectedAddressId === null || !user) && (
          <>
            {user && (
              <div className="mb-4 pb-4 border-b border-dark/10">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={saveAddress}
                    onChange={(e) => setSaveAddress(e.target.checked)}
                    className="w-4 h-4 rounded border-dark/20 text-accent focus:ring-accent/20"
                  />
                  <span className="text-sm text-dark/70">
                    Save this address for future orders
                  </span>
                </label>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <input
              type="text"
              name="firstName"
              value={shippingData.firstName}
              onChange={handleInputChange}
              placeholder="First Name"
              className={`w-full px-4 py-3 bg-cream/30 rounded-xl text-dark text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all ${
                errors.firstName ? 'ring-2 ring-red-400' : ''
              }`}
            />
            {errors.firstName && (
              <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
            )}
          </div>

          <div>
            <input
              type="text"
              name="lastName"
              value={shippingData.lastName}
              onChange={handleInputChange}
              placeholder="Last Name"
              className={`w-full px-4 py-3 bg-cream/30 rounded-xl text-dark text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all ${
                errors.lastName ? 'ring-2 ring-red-400' : ''
              }`}
            />
            {errors.lastName && (
              <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
            )}
          </div>

          <div className="sm:col-span-2">
            <input
              type="text"
              name="address"
              value={shippingData.address}
              onChange={handleInputChange}
              placeholder="Address"
              className={`w-full px-4 py-3 bg-cream/30 rounded-xl text-dark text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all ${
                errors.address ? 'ring-2 ring-red-400' : ''
              }`}
            />
            {errors.address && (
              <p className="text-red-500 text-xs mt-1">{errors.address}</p>
            )}
          </div>

          <div className="sm:col-span-2">
            <input
              type="text"
              name="apartment"
              value={shippingData.apartment}
              onChange={handleInputChange}
              placeholder="Apartment, suite, etc. (optional)"
              className="w-full px-4 py-3 bg-cream/30 rounded-xl text-dark text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all"
            />
          </div>

          <div>
            <input
              type="text"
              name="city"
              value={shippingData.city}
              onChange={handleInputChange}
              placeholder="City"
              className={`w-full px-4 py-3 bg-cream/30 rounded-xl text-dark text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all ${
                errors.city ? 'ring-2 ring-red-400' : ''
              }`}
            />
            {errors.city && (
              <p className="text-red-500 text-xs mt-1">{errors.city}</p>
            )}
          </div>

          <div>
            <input
              type="text"
              name="postalCode"
              value={shippingData.postalCode}
              onChange={handleInputChange}
              placeholder="Postal Code"
              className="w-full px-4 py-3 bg-cream/30 rounded-xl text-dark text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all"
            />
          </div>

          <div className="sm:col-span-2">
            <input
              type="tel"
              name="phone"
              value={shippingData.phone}
              onChange={handleInputChange}
              placeholder="Phone"
              className={`w-full px-4 py-3 bg-cream/30 rounded-xl text-dark text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all ${
                errors.phone ? 'ring-2 ring-red-400' : ''
              }`}
            />
            {errors.phone && (
              <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
            )}
          </div>
        </div>
          </>
        )}
      </div>

      {/* Continue Button */}
      <button
        onClick={onNext}
        className="w-full flex items-center justify-center gap-2 py-4 bg-dark text-white font-medium rounded-2xl hover:bg-dark/90 transition-colors"
      >
        Continue to Payment
        <ArrowRight size={18} />
      </button>
    </div>
  );
}
