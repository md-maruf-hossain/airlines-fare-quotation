import { computeTransitTime } from "./dateUtils";

// Builds the plain-text message used for both the "Share on WhatsApp" and
// "Copy as text" buttons, so both stay in sync automatically.
// Deliberately avoids pictograph emoji (they render as "??" on some
// WhatsApp/device combinations) — plain labels and basic punctuation only.
export function buildWhatsAppText(q) {
  const lines = ["*Flight Quotation*", ""];

  q.segments.forEach((seg, i) => {
    lines.push(`*Flight ${i + 1}*`);
    lines.push(`${seg.from} -> ${seg.to} (${seg.fromCity} -> ${seg.toCity})`);
    lines.push(`Date: ${seg.date}`);
    lines.push(`Time: ${seg.depart} - ${seg.arrive} (${seg.duration})`);
    lines.push(`${seg.airline} ${seg.flightNo} | ${seg.cabin}`);
    lines.push(`Baggage: ${seg.baggage}`);
    lines.push("");

    if (i < q.segments.length - 1) {
      const transit = computeTransitTime(seg, q.segments[i + 1]);
      if (transit) {
        lines.push(`Transit time: ${transit} in ${seg.toCity} (${seg.to})`);
        lines.push("");
      }
    }
  });

  if (q.totalFare) {
    lines.push(`Total Fare: ${q.totalFareCurrency} ${q.totalFare}`);
    lines.push("");
  }

  lines.push("-".repeat(20));
  lines.push("");
  lines.push("*Fare Rules:*");
  (q.fareRuleGroups || []).forEach((group) => {
    if (group.airline) lines.push(`_${group.airline}_`);
    group.rules.forEach((r) => lines.push(`- ${r.label}: ${r.value}`));
  });

  if (q.extraNotes) {
    lines.push("");
    lines.push(q.extraNotes);
  }

  return lines.join("\n");
}
