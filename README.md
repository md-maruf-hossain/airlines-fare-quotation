# Quotation Builder

Flight quotation preview tool for travel consultants — turns GDS itinerary data into
a client-friendly, shareable quotation.

## Setup

```bash
npm install
npm run dev
```

Open the localhost link shown in your terminal.

## Folder structure

```
src/
├── data/
│   └── sampleQuote.js       # sample flight data — replace with real GDS data or a form later
├── utils/
│   └── whatsappText.js      # builds the WhatsApp-ready text message
├── components/quotation/
│   ├── theme.js              # shared colors + font import
│   ├── FlightSegment.jsx     # one flight leg (route, time, airline, baggage)
│   ├── QuotationActions.jsx  # the 4 footer buttons (PDF, image, WhatsApp, copy)
│   └── QuotationPreview.jsx  # assembles everything into the full card
├── App.jsx
├── main.jsx
└── index.css
```

## Notes

- "Download PDF" is a placeholder for now — wire up jsPDF or a server-side render next.
- "Download image" uses `html2canvas`, loaded lazily so it doesn't slow down the initial page load.
- Edit `src/data/sampleQuote.js` to change what shows in the preview.
