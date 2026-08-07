// Sample data — replace this with real GDS data or data submitted via the form.
export const quote = {
  ref: "QT-2026-0731",
  segments: [
    {
      from: "DAC",
      fromCity: "Dhaka",
      to: "DXB",
      toCity: "Dubai",
      date: "14 Sep 2026",
      depart: "23:45",
      arrive: "02:55",
      duration: "4h 10m",
      airline: "Emirates",
      flightNo: "EK 585",
      cabin: "Economy class",
      baggage: "30 KG",
    },
    {
      from: "DXB",
      fromCity: "Dubai",
      to: "LHR",
      toCity: "London",
      date: "15 Sep 2026",
      depart: "09:35",
      arrive: "13:50",
      duration: "7h 15m",
      airline: "Emirates",
      flightNo: "EK 001",
      cabin: "Economy class",
      baggage: "30 KG",
    },
  ],
  fareRuleGroups: [
    {
      airline: "Emirates",
      rules: [
        { label: "Cancellation fee", value: "USD 90.00" },
        { label: "Change fee", value: "USD 45.00" },
        { label: "No-show fee", value: "USD 130.00" },
      ],
    },
    { airline: "", rules: [{ label: "After departure", value: "Non-refundable" }] },
  ],
  extraNotes: "",
  totalFare: "85,000",
  totalFareCurrency: "BDT",
};
