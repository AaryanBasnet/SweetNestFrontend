/**
 * Delivery schedule rules, the same as the server's (utils/deliverySchedule.js
 * in the backend), so the form only offers what the API will accept.
 *
 * The bakery works in Nepal time and a cake needs notice. A booking is a
 * calendar day plus a time slot; the day is sent as an instant around midday
 * UTC, which falls on the same calendar day in every time zone from the
 * Americas to Nepal, so a customer's browser time zone can't shift it.
 */

export const TIME_SLOTS = ['09:00 AM - 12:00 PM', '12:00 PM - 03:00 PM', '03:00 PM - 06:00 PM'];

export const MIN_NOTICE_HOURS = 24;
export const MAX_DAYS_AHEAD = 90;

// Nepal Standard Time is UTC+5:45 all year
const NEPAL_OFFSET_MS = (5 * 60 + 45) * 60 * 1000;
const HOUR_MS = 3600000;

/** The hour a slot starts, in 24-hour time. */
export function slotStartHour(slot) {
  const [time, meridiem] = slot.split(' - ')[0].split(' ');
  const hour = Number(time.split(':')[0]) % 12;
  return meridiem === 'PM' ? hour + 12 : hour;
}

/** What to send for a calendar day the customer picked (month is 0-11). */
export function toBookingDate(year, month, day) {
  return new Date(Date.UTC(year, month, day, 12)).toISOString();
}

/** The Nepal-time calendar day of a stored booking date. */
export function bookingDay(date) {
  const nepal = new Date(new Date(date).getTime() + NEPAL_OFFSET_MS);
  return { year: nepal.getUTCFullYear(), month: nepal.getUTCMonth(), day: nepal.getUTCDate() };
}

function slotStart({ year, month, day }, slot) {
  return Date.UTC(year, month, day, slotStartHour(slot)) - NEPAL_OFFSET_MS;
}

/** Whether a slot on a calendar day can still be booked. */
export function isSlotAvailable(dayParts, slot, now = new Date()) {
  const hoursAway = (slotStart(dayParts, slot) - now.getTime()) / HOUR_MS;
  return hoursAway >= MIN_NOTICE_HOURS && hoursAway <= MAX_DAYS_AHEAD * 24;
}

/** Whether a calendar day has at least one slot left. */
export function isDayAvailable(dayParts, now = new Date()) {
  return TIME_SLOTS.some((slot) => isSlotAvailable(dayParts, slot, now));
}

/** Whether a saved booking (date and slot) can still go ahead. */
export function isBookingValid(date, slot, now = new Date()) {
  if (!date || !slot || !TIME_SLOTS.includes(slot)) return false;
  return isSlotAvailable(bookingDay(date), slot, now);
}

/** The first calendar day (Nepal time) that still has a slot to book. */
export function firstAvailableDay(now = new Date()) {
  const today = bookingDay(now);
  for (let offset = 0; offset <= MAX_DAYS_AHEAD + 1; offset += 1) {
    const date = new Date(Date.UTC(today.year, today.month, today.day + offset));
    const parts = { year: date.getUTCFullYear(), month: date.getUTCMonth(), day: date.getUTCDate() };
    if (isDayAvailable(parts, now)) return parts;
  }
  return today;
}

/** The last calendar day that can still be booked. */
export function lastAvailableDay(now = new Date()) {
  return bookingDay(new Date(now.getTime() + MAX_DAYS_AHEAD * 24 * HOUR_MS));
}
