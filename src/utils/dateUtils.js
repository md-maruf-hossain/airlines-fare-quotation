// Computes the gap between one flight segment's arrival and the next
// segment's departure, and classifies it as a "transit" (a real connection —
// short wait, same trip) or a "stay" (a deliberate stopover of a day or
// more, e.g. a multi-city trip or a long layover with a hotel).
//
// Two things matter for getting this right:
//
// 1. A segment only stores its DEPARTURE date, not its arrival date (an
//    overnight flight can land the next day). So the previous flight's
//    actual arrival moment is derived as departure date+time + duration,
//    which is always correct even when the flight crosses midnight.
//
// 2. A gap only counts as a transit/stay at all if the previous flight's
//    arrival airport matches the next flight's departure airport — the
//    plane has to actually be sitting at the same airport for it to be a
//    connection point.

const MONTHS = { Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11 };

const TRANSIT_THRESHOLD_MINUTES = 24 * 60; // gaps at or under this are a "transit"; longer is a "stay"

function parseDisplayDate(dateStr) {
  const m = String(dateStr || "").match(/(\d{1,2})\s*([A-Za-z]{3})/);
  if (!m) return null;
  const day = parseInt(m[1], 10);
  const monKey = m[2][0].toUpperCase() + m[2].slice(1, 3).toLowerCase();
  const mon = MONTHS[monKey];
  if (mon === undefined) return null;
  return { day, mon };
}

function parseDisplayTime(timeStr) {
  const m = String(timeStr || "").match(/(\d{1,2}):(\d{2})/);
  if (!m) return null;
  return { hh: parseInt(m[1], 10), mm: parseInt(m[2], 10) };
}

<<<<<<< HEAD
// Returns a "Xh Ym" string for the gap between one segment's arrival and the
// next segment's departure, or null if either side can't be parsed.
export function computeTransitTime(prevSeg, nextSeg) {
  const arr = parseDisplayDateTime(prevSeg?.date, prevSeg?.arrive);
  const dep = parseDisplayDateTime(nextSeg?.date, nextSeg?.depart);
if (prevSeg.to !== nextSeg.from) return null;
=======
// Reads "8h 23m", "8h", or "45m" — anything missing is treated as 0.
function parseDurationMinutes(durationStr) {
  const m = String(durationStr || "").match(/(?:(\d+)\s*h)?\s*(?:(\d+)\s*m)?/i);
  if (!m || (!m[1] && !m[2])) return null;
  return parseInt(m[1] || "0", 10) * 60 + parseInt(m[2] || "0", 10);
}

function toDate(dateParts, timeParts, year) {
  return new Date(year, dateParts.mon, dateParts.day, timeParts.hh, timeParts.mm);
}

// Returns { type: "transit" | "stay", totalMinutes, days, hours, minutes, formatted }
// or null if the data can't be parsed, or the two segments don't actually
// connect at the same airport.
export function computeConnectionGap(prevSeg, nextSeg) {
  if (!prevSeg?.to || !nextSeg?.from || prevSeg.to !== nextSeg.from) return null;

  const prevDate = parseDisplayDate(prevSeg?.date);
  const prevDepTime = parseDisplayTime(prevSeg?.depart);
  const prevDurationMin = parseDurationMinutes(prevSeg?.duration);
  const nextDate = parseDisplayDate(nextSeg?.date);
  const nextDepTime = parseDisplayTime(nextSeg?.depart);

  if (!prevDate || !prevDepTime || prevDurationMin === null || !nextDate || !nextDepTime) return null;
>>>>>>> bfb1a8456fea1842329ffaee7c2e310eaec63b3b

  const baseYear = 2000;
  const prevDepartDateTime = toDate(prevDate, prevDepTime, baseYear);
  const prevArrivalDateTime = new Date(prevDepartDateTime.getTime() + prevDurationMin * 60000);

  let nextDepartDateTime = toDate(nextDate, nextDepTime, baseYear);
  if (nextDepartDateTime < prevArrivalDateTime) {
    nextDepartDateTime = toDate(nextDate, nextDepTime, baseYear + 1);
  }

  const totalMinutes = Math.round((nextDepartDateTime - prevArrivalDateTime) / 60000);
  if (totalMinutes < 0) return null;

  const days = Math.floor(totalMinutes / 1440);
  const hours = Math.floor((totalMinutes % 1440) / 60);
  const minutes = totalMinutes % 60;
  const type = totalMinutes <= TRANSIT_THRESHOLD_MINUTES ? "transit" : "stay";
  const formatted = days > 0 ? `${days}d ${hours}h ${minutes}m` : `${hours}h ${minutes}m`;

  return { type, totalMinutes, days, hours, minutes, formatted };
}
