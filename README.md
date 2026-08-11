# ✈️ Quotation Builder

**A tool for travel consultants — paste raw booking data from your GDS (Amadeus/Galileo/Sabre) and get a polished, client-friendly flight quotation in seconds.**

No more manually formatting quotes in Word or Excel — just paste the GDS itinerary, add the fare rules, and export a PDF, image, or WhatsApp-ready quotation with one click.

---

## 🧩 What problem does this solve?

Travel agents deal with raw, cryptic GDS output every day (e.g. `QR 639 V 25NOV 3 DACDOH DK1 0325 0605...`) and have to turn it into something a client can actually understand. That's normally a manual, repetitive, time-consuming task done the same way over and over. This tool automates the whole thing.

---

## ✨ Key Features

### 1. GDS Itinerary Auto-Parser
Paste raw itinerary text from any GDS (Amadeus, Galileo, Sabre) and flight segments (route, date, time, airline, cabin) are automatically detected and filled into the form. Works whether the lines have segment numbers or not, whether there's a booking-class letter or not — the parser is built to tolerate whatever a given GDS omits.

### 2. Multi-Airline Fare Rules
If an itinerary spans multiple airlines (multi-city trip), a separate fare rules section is auto-generated per airline — Cancellation fee, Change fee, No-show fee, plus Non-refundable/Non-changeable checkboxes. Paste the GDS fare rules text and it auto-fills too.

### 3. Transit Time Detection (real transits only)
Real connection time between flights is calculated automatically (same-airport arrival→departure gap, under 24 hours). On multi-city trips with a deliberate multi-day stay in a city, it correctly shows that as a stay — not a transit — by checking both the airport match and the gap length.

### 4. PDF / Image Export
Download the whole quotation card as a **PDF** or **PNG image** with one click — ready to send straight to the client.

### 5. WhatsApp-Ready Share
"Share on WhatsApp" and "Copy as text" both generate the same plain-text message (no pictograph emoji that break as "??" on some devices — just clean, universally-readable formatting).

### 6. Saved Quotations (Sidebar)
Every generated quotation is automatically saved in the browser (localStorage). Revisit or reload any past quotation from the sidebar at any time.

### 7. Full Validation
Route, date, time, cabin, baggage, fare — nothing can be left blank. Empty fields turn red and show exactly what's missing before you can generate.

---

## 🛠️ Tech Stack

- **React + Vite** — UI
- **Tailwind CSS** — styling
- **html2canvas + jsPDF** — PDF/image export
- **localStorage** — quotation history (browser-based, no backend needed)