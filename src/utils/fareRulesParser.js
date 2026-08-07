// Parses fare-rule text blocks like:
//
// CANCELLATIONS
//     ANY TIME
//       CHARGE USD 90.00.
//       CHARGE USD 130.00 FOR NO-SHOW.
// CHANGES
//     ANY TIME
//       CHARGE USD 45.00.
//       CHARGE USD 75.00 FOR NO-SHOW.
//
// into structured { label, value } rows.

export function parseFareRulesText(text) {
  const rules = [];
  const sections = text.split(/(?=^\s*CANCELLATIONS|\s*^CHANGES)/gim);

  sections.forEach((section) => {
    const trimmed = section.trim();
    const isCancellation = /^CANCELLATIONS/i.test(trimmed);
    const isChange = /^CHANGES/i.test(trimmed);
    if (!isCancellation && !isChange) return;

    const type = isCancellation ? "Cancellation fee" : "Change fee";
    const chargeRegex = /CHARGE\s+([A-Z]{3})\s+([\d,]+\.\d{2})\s*(FOR NO-SHOW)?/gi;
    let m;
    while ((m = chargeRegex.exec(trimmed))) {
      const [, currency, amount, noShow] = m;
      const label = noShow ? `${type} (no-show)` : type;
      rules.push({ label, value: `${currency} ${amount}` });
    }
  });

  return rules;
}
