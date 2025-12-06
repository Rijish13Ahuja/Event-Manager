// src/utils/dateTime.js
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

// Enable plugins
dayjs.extend(utc);
dayjs.extend(timezone);

/**
 * Convert a UTC ISO string to a formatted string in the user's timezone.
 *
 * @param {string} utcString - UTC ISO timestamp (e.g. "2025-12-05T09:00:00.000Z")
 * @param {string} userTimezone - IANA timezone string (e.g. "Asia/Kolkata")
 * @param {string} format - dayjs format string
 * @returns {string}
 */
export function formatDateTime(
    utcString,
    userTimezone,
    format = "DD MMM YYYY, HH:mm"
) {
    if (!utcString || !userTimezone) return "";
    return dayjs.utc(utcString).tz(userTimezone).format(format);
}

/**
 * Convert a UTC ISO string to a dayjs object in the user's timezone.
 * Useful if you want to do further calculations in components.
 */
export function toUserTimezone(utcString, userTimezone) {
    if (!utcString || !userTimezone) return null;
    return dayjs.utc(utcString).tz(userTimezone);
}

/**
 * Helper to build a UTC ISO string from date + time strings in a given timezone.
 * We'll use this later when we build event create/edit forms.
 *
 * @param {string} dateStr - "YYYY-MM-DD"
 * @param {string} timeStr - "HH:mm"
 * @param {string} eventTimezone - IANA timezone
 */
export function buildUtcFromLocal(dateStr, timeStr, eventTimezone) {
    if (!dateStr || !timeStr || !eventTimezone) return null;
    const local = dayjs.tz(`${dateStr} ${timeStr}`, "YYYY-MM-DD HH:mm", eventTimezone);
    return local.utc().toISOString();
}

export function splitToDateAndTime(utcString, timezoneStr) {
    if (!utcString || !timezoneStr) {
        return { date: "", time: "" };
    }
    const local = dayjs.utc(utcString).tz(timezoneStr);
    return {
        date: local.format("YYYY-MM-DD"),
        time: local.format("HH:mm"),
    };
}
