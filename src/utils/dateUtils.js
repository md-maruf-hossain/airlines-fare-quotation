const MONTHS = { Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11 };

function parseDisplayDateTime(dateStr, timeStr) {
  if (!dateStr || !timeStr) return null;
  const dateMatch = String(dateStr).match(/(\d{1,2})\s*([A-Za-z]{3})/);
  const timeMatch = String(timeStr).match(/(\d{1,2}):(\d{2})/);
  if (!dateMatch || !timeMatch) return null;

  const day = parseInt(dateMatch[1], 10);
  const monKey = dateMatch[2][0].toUpperCase() + dateMatch[2].slice(1, 3).toLowerCase();
  const mon = MONTHS[monKey];
  if (mon === undefined) return null;

  return { day, mon, hh: parseInt(timeMatch[1], 10), mm: parseInt(timeMatch[2], 10) };
}

function toDate(parsed, year) {
  return new Date(year, parsed.mon, parsed.day, parsed.hh, parsed.mm);
}

// Returns a "Xh Ym" string for the gap between one segment's arrival and the
// next segment's departure, or null if either side can't be parsed.
export function computeTransitTime(prevSeg, nextSeg) {
  const arr = parseDisplayDateTime(prevSeg?.date, prevSeg?.arrive);
  const dep = parseDisplayDateTime(nextSeg?.date, nextSeg?.depart);
  if (!arr || !dep) return null;

  const baseYear = 2000;
  const arrDate = toDate(arr, baseYear);
  let depDate = toDate(dep, baseYear);
  if (depDate < arrDate) depDate = toDate(dep, baseYear + 1);

  const totalMin = Math.round((depDate - arrDate) / 60000);
  if (totalMin < 0) return null;
  if (totalMin > 24 * 60) return null; // gaps over 24h are treated as a separate leg (e.g. return flight), not a layover

  return `${Math.floor(totalMin / 60)}h ${totalMin % 60}m`;
}
