/**
 * Delivery schedule rules. These mirror the server's, so the checkout form only
 * offers days and times the API will accept.
 */

import { describe, expect, it } from 'vitest';
import {
  bookingDay,
  firstAvailableDay,
  isBookingValid,
  isDayAvailable,
  isSlotAvailable,
  lastAvailableDay,
  slotStartHour,
  toBookingDate,
} from './deliverySchedule';

const MORNING = '09:00 AM - 12:00 PM';
const AFTERNOON = '03:00 PM - 06:00 PM';

// 11:45am on 10 October 2026 in Nepal
const NOW = new Date('2026-10-10T06:00:00.000Z');

describe('slotStartHour', () => {
  it('reads each slot in 24-hour time', () => {
    expect(slotStartHour('09:00 AM - 12:00 PM')).toBe(9);
    expect(slotStartHour('12:00 PM - 03:00 PM')).toBe(12);
    expect(slotStartHour('03:00 PM - 06:00 PM')).toBe(15);
  });
});

describe('booking dates', () => {
  it('sends a calendar day that reads back as the same day in Nepal', () => {
    const sent = toBookingDate(2026, 9, 14);

    expect(bookingDay(sent)).toEqual({ year: 2026, month: 9, day: 14 });
  });

  it('keeps the day when the browser used local midnight in Nepal, the old format', () => {
    // 14 Oct 00:00 in Nepal is 13 Oct 18:15 UTC
    expect(bookingDay('2026-10-13T18:15:00.000Z')).toEqual({ year: 2026, month: 9, day: 14 });
  });
});

describe('slot availability', () => {
  it('needs 24 hours notice', () => {
    // Tomorrow 9am is about 21 hours from 11:45am today, so too soon...
    expect(isSlotAvailable({ year: 2026, month: 9, day: 11 }, MORNING, NOW)).toBe(false);
    // ...but tomorrow 3pm is 27 hours away
    expect(isSlotAvailable({ year: 2026, month: 9, day: 11 }, AFTERNOON, NOW)).toBe(true);
  });

  it('refuses days in the past', () => {
    expect(isDayAvailable({ year: 2026, month: 9, day: 1 }, NOW)).toBe(false);
  });

  it('refuses days more than 90 days away', () => {
    expect(isDayAvailable({ year: 2027, month: 5, day: 1 }, NOW)).toBe(false);
  });
});

describe('the calendar window', () => {
  it('opens on tomorrow when a late slot is still far enough away', () => {
    expect(firstAvailableDay(NOW)).toEqual({ year: 2026, month: 9, day: 11 });
  });

  it('opens on the day after tomorrow late in the day', () => {
    // 4pm in Nepal: even tomorrow's last slot (3pm) is under 24 hours away
    const late = new Date('2026-10-10T10:15:00.000Z');

    expect(firstAvailableDay(late)).toEqual({ year: 2026, month: 9, day: 12 });
  });

  it('closes 90 days ahead', () => {
    expect(lastAvailableDay(NOW)).toEqual({ year: 2027, month: 0, day: 8 });
  });
});

describe('isBookingValid', () => {
  it('accepts a saved booking that is still bookable', () => {
    expect(isBookingValid(toBookingDate(2026, 9, 14), MORNING, NOW)).toBe(true);
  });

  it('rejects a saved booking that has gone out of date', () => {
    expect(isBookingValid(toBookingDate(2026, 9, 9), MORNING, NOW)).toBe(false);
  });

  it('rejects a missing date, a missing slot, or a slot that does not exist', () => {
    expect(isBookingValid(null, MORNING, NOW)).toBe(false);
    expect(isBookingValid(toBookingDate(2026, 9, 14), '', NOW)).toBe(false);
    expect(isBookingValid(toBookingDate(2026, 9, 14), '3am sharp', NOW)).toBe(false);
  });
});
