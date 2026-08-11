// Parses raw GDS (Amadeus-style) itinerary lines like:
// 1  QR 639 V 25NOV 3 DACDOH DK1  0325 0605  25NOV  E  0 77W M
// into structured flight segment objects.

const MONTHS = { JAN: 0, FEB: 1, MAR: 2, APR: 3, MAY: 4, JUN: 5, JUL: 6, AUG: 7, SEP: 8, OCT: 9, NOV: 10, DEC: 11 };
const MONTH_NAMES = { JAN: "Jan", FEB: "Feb", MAR: "Mar", APR: "Apr", MAY: "May", JUN: "Jun", JUL: "Jul", AUG: "Aug", SEP: "Sep", OCT: "Oct", NOV: "Nov", DEC: "Dec" };

// Extend these as you fly more routes/airlines — unknown codes just fall back to the raw code.
const AIRPORTS = {
  DAC: "Dhaka", DOH: "Doha", DXB: "Dubai", LHR: "London", LAX: "Los Angeles",
  SFO: "San Francisco", ORD: "Chicago", JFK: "New York", CDG: "Paris",
  IST: "Istanbul", SIN: "Singapore", BKK: "Bangkok", KUL: "Kuala Lumpur",
  DEL: "Delhi", BOM: "Mumbai", CCU: "Kolkata", AUH: "Abu Dhabi",
  SYD: "Sydney", DPS: "Denpasar (Bali)", MEL: "Melbourne", HKG: "Hong Kong",
  NRT: "Tokyo", ICN: "Seoul", MNL: "Manila", CGK: "Jakarta",
};

const AIRLINES = {
  QR: "Qatar Airways", AA: "American Airlines", EK: "Emirates", BG: "Biman Bangladesh Airlines",
  BS: "US-Bangla Airlines", TK: "Turkish Airlines", SQ: "Singapore Airlines", EY: "Etihad Airways",
  UA: "United Airlines", BA: "British Airways", AI: "Air India", CX: "Cathay Pacific",
  MH: "Malaysia Airlines", TG: "Thai Airways", CI: "China Airlines", MU: "China Eastern",
};

const CABINS = { F: "First class", J: "Business class", C: "Business class", W: "Economy class" };

const LINE_REGEX =
  /^(?:\d+\.?\s+)?([A-Z]{2,3})\s?(\d{2,5})\s+([A-Z])\s+(\d{2}[A-Z]{3})\s+(\d\*?)\s*([A-Z]{3})([A-Z]{3})\s+([A-Z]{2}\d+)\s+(\d{4})\s+(\d{4})\s+(\d{2}[A-Z]{3})\s+([A-Z])?\s*(\d+)?\s*(\S+)?\s*([A-Z])?\s*$/;

function formatGdsDate(raw) {
  const day = parseInt(raw.slice(0, 2), 10);
  const mon = raw.slice(2, 5);
  return `${day} ${MONTH_NAMES[mon] || mon}`;
}

function formatGdsTime(raw) {
  return `${raw.slice(0, 2)}:${raw.slice(2, 4)}`;
}

function buildDateTime(raw, time, year) {
  const day = parseInt(raw.slice(0, 2), 10);
  const mon = MONTHS[raw.slice(2, 5)];
  const hh = parseInt(time.slice(0, 2), 10);
  const mm = parseInt(time.slice(2, 4), 10);
  return new Date(year, mon, day, hh, mm);
}

function computeDuration(depDate, depTime, arrDate, arrTime) {
  const baseYear = 2000;
  const dep = buildDateTime(depDate, depTime, baseYear);
  let arr = buildDateTime(arrDate, arrTime, baseYear);
  if (arr < dep) arr = buildDateTime(arrDate, arrTime, baseYear + 1);
  const totalMin = Math.round((arr - dep) / 60000);
  return `${Math.floor(totalMin / 60)}h ${totalMin % 60}m`;
}

// Returns { segments, unmatched } — unmatched lines are returned as-is so the
// agent can see what couldn't be auto-read and fix it manually.
export function parseGdsSegments(text) {
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
  const segments = [];
  const unmatched = [];

  lines.forEach((line) => {
    const m = line.match(LINE_REGEX);
    if (!m) {
      unmatched.push(line);
      return;
    }
    const [, airlineCode, flightNum, , depDate, , from, to, , depTime, arrTime, arrDate, , , , cabinCode] = m;

    segments.push({
      from,
      fromCity: AIRPORTS[from] || from,
      to,
      toCity: AIRPORTS[to] || to,
      date: formatGdsDate(depDate),
      depart: formatGdsTime(depTime),
      arrive: formatGdsTime(arrTime),
      duration: computeDuration(depDate, depTime, arrDate, arrTime),
      airline: AIRLINES[airlineCode] || airlineCode,
      flightNo: `${airlineCode} ${flightNum}`,
      cabin: CABINS[cabinCode] || "Economy class",
      baggage: "",
    });
  });

  return { segments, unmatched };
}
