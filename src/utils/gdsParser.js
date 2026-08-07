const MONTHS = {
  JAN: 0,
  FEB: 1,
  MAR: 2,
  APR: 3,
  MAY: 4,
  JUN: 5,
  JUL: 6,
  AUG: 7,
  SEP: 8,
  OCT: 9,
  NOV: 10,
  DEC: 11,
};

const MONTH_NAMES = {
  JAN: "Jan",
  FEB: "Feb",
  MAR: "Mar",
  APR: "Apr",
  MAY: "May",
  JUN: "Jun",
  JUL: "Jul",
  AUG: "Aug",
  SEP: "Sep",
  OCT: "Oct",
  NOV: "Nov",
  DEC: "Dec",
};

const AIRPORTS = {
DAC: "Dhaka",
DOH: "Doha",
DXB: "Dubai",
AUH: "Abu Dhabi",
SHJ: "Sharjah",
LHR: "London",
LGW: "London Gatwick",
MAN: "Manchester",
CDG: "Paris",
ORY: "Paris Orly",
FRA: "Frankfurt",
MUC: "Munich",
AMS: "Amsterdam",
BRU: "Brussels",
ZRH: "Zurich",
VIE: "Vienna",
FCO: "Rome",
MXP: "Milan",
MAD: "Madrid",
BCN: "Barcelona",
LIS: "Lisbon",
CPH: "Copenhagen",
ARN: "Stockholm",
OSL: "Oslo",
HEL: "Helsinki",
DUB: "Dublin",
ATH: "Athens",
IST: "Istanbul",
SAW: "Istanbul Sabiha",
JFK: "New York",
EWR: "Newark",
LAX: "Los Angeles",
SFO: "San Francisco",
ORD: "Chicago",
ATL: "Atlanta",
MIA: "Miami",
DFW: "Dallas",
IAH: "Houston",
SEA: "Seattle",
BOS: "Boston",
IAD: "Washington DC",
YYZ: "Toronto",
YVR: "Vancouver",
YUL: "Montreal",
MEX: "Mexico City",
GRU: "São Paulo",
EZE: "Buenos Aires",
LIM: "Lima",
SCL: "Santiago",
NRT: "Tokyo",
HND: "Tokyo Haneda",
KIX: "Osaka",
ICN: "Seoul",
GMP: "Seoul Gimpo",
PVG: "Shanghai",
PEK: "Beijing",
HKG: "Hong Kong",
TPE: "Taipei",
SIN: "Singapore",
KUL: "Kuala Lumpur",
BKK: "Bangkok",
DMK: "Bangkok Don Mueang",
MNL: "Manila",
CGK: "Jakarta",
DPS: "Denpasar (Bali)",
SGN: "Ho Chi Minh City",
HAN: "Hanoi",
DEL: "Delhi",
BOM: "Mumbai",
CCU: "Kolkata",
MAA: "Chennai",
BLR: "Bangalore",
HYD: "Hyderabad",
COK: "Kochi",
KTM: "Kathmandu",
CMB: "Colombo",
MLE: "Malé",
KHI: "Karachi",
LHE: "Lahore",
ISB: "Islamabad",
JED: "Jeddah",
RUH: "Riyadh",
MED: "Madinah",
KWI: "Kuwait City",
BAH: "Bahrain",
MCT: "Muscat",
CAI: "Cairo",
JNB: "Johannesburg",
CPT: "Cape Town",
ADD: "Addis Ababa",
NBO: "Nairobi",
SYD: "Sydney",
MEL: "Melbourne",
PER: "Perth",
AKL: "Auckland",
CHC: "Christchurch",
};

const AIRLINES = {
  QR: "Qatar Airways",
  AA: "American Airlines",
  EK: "Emirates",
  BG: "Biman Bangladesh Airlines",
  BS: "US-Bangla Airlines",
  TK: "Turkish Airlines",
  SQ: "Singapore Airlines",
  EY: "Etihad Airways",
  UA: "United Airlines",
  BA: "British Airways",
  AI: "Air India",
  CX: "Cathay Pacific",
  MH: "Malaysia Airlines",
  TG: "Thai Airways",
  CI: "China Airlines",
  MU: "China Eastern",
  QR: "Qatar Airways",
SQ: "Singapore Airlines",
EK: "Emirates",
CX: "Cathay Pacific",
TK: "Turkish Airlines",
NH: "All Nippon Airways",
JL: "Japan Airlines",
KE: "Korean Air",
AF: "Air France",
LH: "Lufthansa",
BA: "British Airways",
QF: "Qantas",
EY: "Etihad Airways",
SV: "Saudia",
LX: "SWISS",
BR: "EVA Air",
OZ: "Asiana Airlines",
KL: "KLM Royal Dutch Airlines",
VS: "Virgin Atlantic",
AC: "Air Canada",
UA: "United Airlines",
AA: "American Airlines",
DL: "Delta Air Lines",
WN: "Southwest Airlines",
AS: "Alaska Airlines",
B6: "JetBlue",
F9: "Frontier Airlines",
HA: "Hawaiian Airlines",
WN: "Southwest Airlines",
AM: "Aeromexico",
LA: "LATAM Airlines",
CM: "Copa Airlines",
AV: "Avianca",
AR: "Aerolineas Argentinas",
G3: "GOL Linhas Aereas",
AD: "Azul Brazilian Airlines",
IB: "Iberia",
UX: "Air Europa",
TP: "TAP Air Portugal",
AZ: "ITA Airways",
SK: "Scandinavian Airlines",
AY: "Finnair",
DY: "Norwegian",
WF: "Widerøe",
OS: "Austrian Airlines",
SN: "Brussels Airlines",
LO: "LOT Polish Airlines",
A3: "Aegean Airlines",
FR: "Ryanair",
U2: "easyJet",
W6: "Wizz Air",
VY: "Vueling",
EW: "Eurowings",
XQ: "SunExpress",
PC: "Pegasus Airlines",
VF: "AJet",
FZ: "flydubai",
G9: "Air Arabia",
WY: "Oman Air",
GF: "Gulf Air",
KU: "Kuwait Airways",
ME: "Middle East Airlines",
RJ: "Royal Jordanian",
MS: "EgyptAir",
ET: "Ethiopian Airlines",
KQ: "Kenya Airways",
SA: "South African Airways",
WB: "RwandAir",
AT: "Royal Air Maroc",
UL: "SriLankan Airlines",
AI: "Air India",
UK: "Vistara",
BG: "Biman Bangladesh Airlines",
MH: "Malaysia Airlines",
AK: "AirAsia",
OD: "Batik Air Malaysia",
TR: "Scoot",
TG: "Thai Airways",
FD: "Thai AirAsia",
VN: "Vietnam Airlines",
VJ: "VietJet Air",
PR: "Philippine Airlines",
GA: "Garuda Indonesia",
QZ: "Indonesia AirAsia",
CI: "China Airlines",
BR: "EVA Air",
JX: "STARLUX Airlines",
MU: "China Eastern Airlines",
CZ: "China Southern Airlines",
CA: "Air China",
HU: "Hainan Airlines",
MF: "XiamenAir",
ZH: "Shenzhen Airlines",
HO: "Juneyao Airlines",
J2: "Azerbaijan Airlines",
HY: "Uzbekistan Airways",
KC: "Air Astana",
NZ: "Air New Zealand",
VA: "Virgin Australia",
JQ: "Jetstar",
FJ: "Fiji Airways",
"9C": "Spring Airlines",
"3U": "Sichuan Airlines",
"5J": "Cebu Pacific",
"6E": "IndiGo",
"6R": "Alrosa Airlines",
"8M": "Myanmar Airways International",
};

const CABINS = {
  F: "First class",
  J: "Business class",
  C: "Business class",
  W: "Economy class",
  Y: "Economy class",
  M: "Economy class",
  B: "Economy class",
  H: "Economy class",
  K: "Economy class",
  L: "Economy class",
  Q: "Economy class",
  T: "Economy class",
  V: "Economy class",
  S: "Economy class",
  N: "Economy class",
};

function formatGdsDate(raw) {
  const day = parseInt(raw.slice(0, 2), 10);
  const month = raw.slice(2, 5).toUpperCase();

  return `${day} ${MONTH_NAMES[month] || month}`;
}

function formatGdsTime(raw) {
  return `${raw.slice(0, 2)}:${raw.slice(2, 4)}`;
}

function buildDateTime(raw, time, year) {
  const day = parseInt(raw.slice(0, 2), 10);
  const month = MONTHS[raw.slice(2, 5).toUpperCase()];
  const hour = parseInt(time.slice(0, 2), 10);
  const minute = parseInt(time.slice(2, 4), 10);

  return new Date(year, month, day, hour, minute);
}

function computeDuration(depDate, depTime, arrDate, arrTime) {
  const baseYear = 2000;

  const dep = buildDateTime(depDate, depTime, baseYear);
  let arr = buildDateTime(arrDate, arrTime, baseYear);

  if (arr < dep) {
    arr = buildDateTime(arrDate, arrTime, baseYear + 1);
  }

  const totalMinutes = Math.max(
    0,
    Math.round((arr - dep) / 60000)
  );

  return `${Math.floor(totalMinutes / 60)}h ${totalMinutes % 60}m`;
}

function isDateToken(token) {
  return /^\d{2}[A-Z]{3}$/i.test(token);
}

function isTimeToken(token) {
  return /^\d{4}$/.test(token);
}

function isAirportPair(token) {
  return /^[A-Z]{6}$/i.test(token);
}

function isAirportCode(token) {
  return /^[A-Z]{3}$/i.test(token);
}

function isCabinCode(token) {
  return /^[A-Z]$/i.test(token);
}

function normalizeLine(line) {
  return String(line || "")
    .replace(/\s+/g, " ")
    .trim()
    .toUpperCase();
}

function parseSingleLine(rawLine) {
  const line = normalizeLine(rawLine);

  if (!line) {
    return null;
  }

  // Remove optional line number:
  // 1 MH 197 J ...
  // 1. MH 197 J ...
  // 1) MH 197 J ...
  // 1-MH 197 J ...
let working = line.replace(/^\s*\d+\s*[.)-]?\s*#?\s*/, "");

  const tokens = working.split(" ").filter(Boolean);

  if (tokens.length < 4) {
    return null;
  }

  // ------------------------------------------------------------
  // AIRLINE CODE
  // ------------------------------------------------------------

const airlineIndex = tokens.findIndex((token) =>
  /^[A-Z0-9]{2,3}$/.test(token) &&
  /[A-Z]/.test(token) &&
  /[0-9]/.test(token) || /^[A-Z]{2,3}$/.test(token)
);

  if (airlineIndex === -1) {
    return null;
  }

  const airlineCode = tokens[airlineIndex];

  // ------------------------------------------------------------
  // FLIGHT NUMBER + CABIN
  //
  // Supports:
  // 197
  // 197J
  // 197 J
  // ------------------------------------------------------------

  let flightNum = "";
  let cabinCode = "";

  for (
    let i = airlineIndex + 1;
    i < Math.min(tokens.length, airlineIndex + 4);
    i++
  ) {
    const token = tokens[i];

    const joinedFlight = token.match(/^(\d{2,5})([A-Z])?$/);

    if (!joinedFlight) {
      continue;
    }

    flightNum = joinedFlight[1];

    // Example: 197J
    if (joinedFlight[2]) {
      cabinCode = joinedFlight[2];
    }

    // Example: 197 J
    if (
      !cabinCode &&
      tokens[i + 1] &&
      isCabinCode(tokens[i + 1])
    ) {
      cabinCode = tokens[i + 1];
    }

    break;
  }

  if (!flightNum) {
    return null;
  }

  // ------------------------------------------------------------
  // DEPARTURE DATE
  // ------------------------------------------------------------

  const dateIndex = tokens.findIndex(
    (token, index) =>
      index > airlineIndex && isDateToken(token)
  );

  if (dateIndex === -1) {
    return null;
  }

  const depDate = tokens[dateIndex];

  // ------------------------------------------------------------
  // ROUTE
  //
  // Supports:
  // DACKUL
  // DAC KUL
  // ------------------------------------------------------------

  let from = "";
  let to = "";
  let routeIndex = -1;

  for (
    let i = dateIndex + 1;
    i < tokens.length;
    i++
  ) {
    const token = tokens[i];

    // Example: DACKUL
    if (isAirportPair(token)) {
      from = token.slice(0, 3);
      to = token.slice(3, 6);
      routeIndex = i;
      break;
    }

    // Example: DAC KUL
    if (
      isAirportCode(token) &&
      isAirportCode(tokens[i + 1])
    ) {
      from = token;
      to = tokens[i + 1];
      routeIndex = i;
      break;
    }
  }

  if (!from || !to) {
    return null;
  }

  // ------------------------------------------------------------
  // DEPARTURE + ARRIVAL TIME
  //
  // We don't care about optional GDS status tokens.
  //
  // HS1 / DK1 / SS1
  // O / E / TH
  // /DCMH /E
  // 7M8
  // etc.
  // ------------------------------------------------------------

  const timeTokens = [];

  for (
    let i = routeIndex + 1;
    i < tokens.length;
    i++
  ) {
    if (isTimeToken(tokens[i])) {
      timeTokens.push(tokens[i]);

      if (timeTokens.length === 2) {
        break;
      }
    }
  }

  if (timeTokens.length < 2) {
    return null;
  }

  const depTime = timeTokens[0];
  const arrTime = timeTokens[1];

  // ------------------------------------------------------------
  // ARRIVAL DATE
  //
  // If another date exists after arrival time,
  // use that as arrival date.
  //
  // Otherwise use departure date.
  // ------------------------------------------------------------

  let arrDate = depDate;

  let secondTimeIndex = -1;

  for (
    let i = routeIndex + 1;
    i < tokens.length;
    i++
  ) {
    if (tokens[i] === arrTime && isTimeToken(tokens[i])) {
      secondTimeIndex = i;
      break;
    }
  }

  if (secondTimeIndex !== -1) {
    for (
      let i = secondTimeIndex + 1;
      i < tokens.length;
      i++
    ) {
      if (isDateToken(tokens[i])) {
        arrDate = tokens[i];
        break;
      }
    }
  }

  // ------------------------------------------------------------
  // CABIN
  // ------------------------------------------------------------

  const cabin = CABINS[cabinCode] || "Economy class";

  // ------------------------------------------------------------
  // BAGGAGE
  //
  // GDS lines don't always contain baggage information.
  // Your form currently requires baggage, so use a safe
  // default instead of an empty string.
  // ------------------------------------------------------------

  const baggage = "Not specified";

  return {
    from,
    fromCity: AIRPORTS[from] || from,

    to,
    toCity: AIRPORTS[to] || to,

    date: formatGdsDate(depDate),

    depart: formatGdsTime(depTime),
    arrive: formatGdsTime(arrTime),

    duration: computeDuration(
      depDate,
      depTime,
      arrDate,
      arrTime
    ),

    airline: AIRLINES[airlineCode] || airlineCode,

    flightNo: `${airlineCode} ${flightNum}`,

    cabin,

    baggage,
  };
}

export function parseGdsSegments(text) {
  const lines = String(text || "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const segments = [];
  const unmatched = [];

  lines.forEach((line) => {
    const parsed = parseSingleLine(line);

    if (parsed) {
      segments.push(parsed);
    } else {
      unmatched.push(line);
    }
  });

  return {
    segments,
    unmatched,
  };
}