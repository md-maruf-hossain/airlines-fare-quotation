import { useEffect, useState } from "react";
import { Plus, Trash2, Wand2 } from "lucide-react";
import { COLORS } from "./theme";
import { parseGdsSegments } from "../../utils/gdsParser";
import { parseFareRulesText } from "../../utils/fareRulesParser";
import { CABIN_OPTIONS, BAGGAGE_OPTIONS, FARE_RULE_CURRENCIES, FARE_CURRENCIES } from "../../utils/options";

const emptySegment = {
  from: "",
  fromCity: "",
  to: "",
  toCity: "",
  date: "",
  depart: "",
  arrive: "",
  duration: "",
  airline: "",
  flightNo: "",
  cabin: "",
  baggage: "",
};

const emptyFee = { amount: "", currency: "USD" };

function makeFareGroup(airline) {
  return {
    airline,
    cancellation: { ...emptyFee, nonRefundable: false },
    change: { ...emptyFee, nonChangeable: false },
    noshow: { ...emptyFee, notApplicable: false },
    rulesText: "",
  };
}

const inputStyle = {
  width: "100%",
  padding: "8px 10px",
  fontSize: 13,
  border: `1px solid ${COLORS.line}`,
  borderRadius: 6,
  background: "#fff",
  color: COLORS.ink,
};

const selectStyle = { ...inputStyle };

const textareaStyle = {
  ...inputStyle,
  minHeight: 90,
  fontFamily: "'JetBrains Mono', monospace",
  fontSize: 12,
  resize: "vertical",
};

const labelStyle = {
  display: "block",
  fontSize: 11,
  color: COLORS.slate,
  textTransform: "uppercase",
  letterSpacing: 0.4,
  marginBottom: 4,
};

const errorInputStyle = {
  border: "1px solid #C0392B",
  background: "#FDEDEB",
};

const errorTextStyle = {
  fontSize: 11,
  color: "#C0392B",
  marginTop: 3,
};

const disabledInputStyle = {
  background: "#F2F2F2",
  color: COLORS.slate,
  cursor: "not-allowed",
};

function Field({ label, value, onChange, placeholder, type = "text", error, disabled }) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        style={{ ...inputStyle, ...(error ? errorInputStyle : {}), ...(disabled ? disabledInputStyle : {}) }}
      />
      {error && <div style={errorTextStyle}>Fill this in</div>}
    </div>
  );
}

function Select({ label, value, onChange, options, placeholder, error }) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <select value={value} onChange={(e) => onChange(e.target.value)} style={{ ...selectStyle, ...(error ? errorInputStyle : {}) }}>
        <option value="">{placeholder || "-- Select --"}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      {error && <div style={errorTextStyle}>Fill this in</div>}
    </div>
  );
}

function parseAmountValue(value) {
  const m = String(value).match(/^([A-Z]{3})\s*([\d,]+\.?\d*)/);
  if (m) return { currency: m[1], amount: m[2] };
  return { currency: "USD", amount: String(value || "") };
}

// Reconstructs the form's per-airline fee state from a previously generated
// quote (used when editing an existing quotation).
function buildFareGroupsFromQuote(quote) {
  if (!quote || !quote.fareRuleGroups) return { groups: [], nonRefundable: false };
  const groups = [];
  let nonRefundable = false;

  quote.fareRuleGroups.forEach((g) => {
    if (!g.airline && g.rules.length === 1 && g.rules[0].label === "After departure") {
      nonRefundable = true;
      return;
    }
    const group = makeFareGroup(g.airline);
    g.rules.forEach((r) => {
      if (/cancellation/i.test(r.label)) {
        if (/non-refundable/i.test(r.value)) group.cancellation = { ...emptyFee, nonRefundable: true };
        else group.cancellation = { ...parseAmountValue(r.value), nonRefundable: false };
      } else if (/change/i.test(r.label)) {
        if (/non-changeable/i.test(r.value)) group.change = { ...emptyFee, nonChangeable: true };
        else group.change = { ...parseAmountValue(r.value), nonChangeable: false };
      } else if (/no-show/i.test(r.label)) {
        if (/not applicable/i.test(r.value)) group.noshow = { ...emptyFee, notApplicable: true };
        else group.noshow = { ...parseAmountValue(r.value), notApplicable: false };
      }
    });
    groups.push(group);
  });

  return { groups, nonRefundable };
}

export default function QuotationForm({ onSubmit, initialData }) {
  const [ref, setRef] = useState(initialData?.ref || "QT-" + Date.now().toString().slice(-6));
  const [segments, setSegments] = useState(
    initialData?.segments?.length ? initialData.segments : [{ ...emptySegment }]
  );
  const [extraNotes, setExtraNotes] = useState(initialData?.extraNotes || "");
  const [totalFare, setTotalFare] = useState(initialData?.totalFare || "");
  const [totalFareCurrency, setTotalFareCurrency] = useState(initialData?.totalFareCurrency || "BDT");

  const initialFareState = useState(() => buildFareGroupsFromQuote(initialData))[0];
  const [fareGroups, setFareGroups] = useState(initialFareState.groups);
  const [nonRefundableAfterDeparture, setNonRefundableAfterDeparture] = useState(initialFareState.nonRefundable);

  const [gdsText, setGdsText] = useState("");
  const [gdsWarning, setGdsWarning] = useState("");
  const [attempted, setAttempted] = useState(false);

  // keep fare-rule sections in sync with the airlines actually used in the itinerary
  useEffect(() => {
    const uniqueAirlines = [...new Set(segments.map((s) => s.airline).filter(Boolean))];
    setFareGroups((prev) => uniqueAirlines.map((airline) => prev.find((g) => g.airline === airline) || makeFareGroup(airline)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [segments.map((s) => s.airline).join("|")]);

  const updateSegment = (index, field, value) => {
    setSegments((prev) => prev.map((seg, i) => (i === index ? { ...seg, [field]: value } : seg)));
  };
  const addSegment = () => setSegments((prev) => [...prev, { ...emptySegment }]);
  const removeSegment = (index) => setSegments((prev) => prev.filter((_, i) => i !== index));

  const handleParseGds = () => {
    const { segments: parsed, unmatched } = parseGdsSegments(gdsText);
    if (parsed.length > 0) setSegments(parsed);
    setGdsWarning(
      unmatched.length > 0
        ? `${unmatched.length} line(s) could not be read automatically — check/fix them manually: ${unmatched.join(" | ")}`
        : ""
    );
  };

  const updateGroupFee = (airline, feeKey, field, value) => {
    setFareGroups((prev) =>
      prev.map((g) => (g.airline === airline ? { ...g, [feeKey]: { ...g[feeKey], [field]: value } } : g))
    );
  };

  const toggleGroupFlag = (airline, feeKey, flagField, checked) => {
    setFareGroups((prev) =>
      prev.map((g) =>
        g.airline === airline
          ? { ...g, [feeKey]: { ...g[feeKey], [flagField]: checked, amount: "", currency: g[feeKey].currency } }
          : g
      )
    );
  };

  const updateGroupRulesText = (airline, value) => {
    setFareGroups((prev) => prev.map((g) => (g.airline === airline ? { ...g, rulesText: value } : g)));
  };

  const handleParseGroupRules = (airline) => {
    setFareGroups((prev) =>
      prev.map((g) => {
        if (g.airline !== airline) return g;
        const parsed = parseFareRulesText(g.rulesText);
        const next = { ...g };
        parsed.forEach((r) => {
          const val = parseAmountValue(r.value);
          if (/cancellation/i.test(r.label)) next.cancellation = val;
          else if (/change/i.test(r.label)) next.change = val;
          else if (/no-show/i.test(r.label)) next.noshow = val;
        });
        return next;
      })
    );
  };

  const requiredSegmentFields = [
    "from", "fromCity", "to", "toCity", "date", "depart", "arrive", "duration", "airline", "flightNo", "cabin", "baggage",
  ];

  const hasErrors = () => {
    if (!ref.trim()) return true;
    if (segments.some((seg) => requiredSegmentFields.some((f) => !String(seg[f] || "").trim()))) return true;
    if (
      fareGroups.some((g) => {
        const cancellationMissing = !g.cancellation.nonRefundable && !String(g.cancellation.amount || "").trim();
        const changeMissing = !g.change.nonChangeable && !String(g.change.amount || "").trim();
        const noshowMissing = !g.noshow.notApplicable && !String(g.noshow.amount || "").trim();
        return cancellationMissing || changeMissing || noshowMissing;
      })
    )
      return true;
    if (!String(totalFare).trim()) return true;
    return false;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (hasErrors()) {
      setAttempted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    setAttempted(false);

    const finalFareGroups = fareGroups.map((g) => ({
      airline: g.airline,
      rules: [
        {
          label: "Cancellation fee",
          value: g.cancellation.nonRefundable ? "Non-refundable" : `${g.cancellation.currency} ${g.cancellation.amount}`,
        },
        {
          label: "Change fee",
          value: g.change.nonChangeable ? "Non-changeable" : `${g.change.currency} ${g.change.amount}`,
        },
        { label: "No-show fee", value: g.noshow.notApplicable ? "Not applicable" : `${g.noshow.currency} ${g.noshow.amount}` },
      ],
    }));

    if (nonRefundableAfterDeparture) {
      finalFareGroups.push({ airline: "", rules: [{ label: "After departure", value: "Non-refundable" }] });
    }

    onSubmit({
      ref,
      segments,
      fareRuleGroups: finalFareGroups,
      extraNotes,
      totalFare,
      totalFareCurrency,
    });
  };

  return (
    <div style={{ background: "#F0EDE4", minHeight: "100vh", padding: "32px 16px", fontFamily: "'Poppins', sans-serif" }}>
      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto" style={{ background: "#fff", borderRadius: 16, padding: 24 }}>
        <h1 style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: 18, color: COLORS.navy, marginBottom: 20 }}>
          {initialData ? "Edit quotation" : "Create quotation"}
        </h1>

        <div className="mb-6">
          <Field label="Quote reference" value={ref} onChange={setRef} placeholder="QT-2026-0001" error={attempted && !ref.trim()} />
        </div>

        <div className="mb-6" style={{ border: `1px solid ${COLORS.line}`, borderRadius: 10, padding: 16, background: COLORS.cream }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.navy, marginBottom: 8 }}>Paste GDS itinerary</div>
          <textarea
            value={gdsText}
            onChange={(e) => setGdsText(e.target.value)}
            placeholder={"MH 197 N 02NOV 1 DACKUL DK1  0050 0650  02NOV  E  0 7M8 M"}
            style={textareaStyle}
          />
          <button
            type="button"
            onClick={handleParseGds}
            className="flex items-center gap-2 mt-2"
            style={{ fontSize: 13, color: "#fff", background: COLORS.navy, border: "none", borderRadius: 8, padding: "8px 12px", cursor: "pointer" }}
          >
            <Wand2 size={14} /> Auto-fill flights below
          </button>
          {gdsWarning && <div style={{ fontSize: 12, color: "#B34A3C", marginTop: 8, lineHeight: 1.5 }}>{gdsWarning}</div>}
        </div>

        {segments.map((seg, i) => (
          <div key={i} className="mb-6" style={{ border: `1px solid ${COLORS.line}`, borderRadius: 10, padding: 16 }}>
            <div className="flex items-center justify-between mb-3">
              <span style={{ fontSize: 13, fontWeight: 600, color: COLORS.navy }}>Flight {i + 1}</span>
              {segments.length > 1 && (
                <button type="button" onClick={() => removeSegment(i)} style={{ color: COLORS.slate, background: "none", border: "none", cursor: "pointer" }}>
                  <Trash2 size={15} />
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
              <Field label="From (code)" value={seg.from} onChange={(v) => updateSegment(i, "from", v.toUpperCase())} placeholder="DAC" error={attempted && !seg.from.trim()} />
              <Field label="From city" value={seg.fromCity} onChange={(v) => updateSegment(i, "fromCity", v)} placeholder="Dhaka" error={attempted && !seg.fromCity.trim()} />
              <Field label="To (code)" value={seg.to} onChange={(v) => updateSegment(i, "to", v.toUpperCase())} placeholder="DXB" error={attempted && !seg.to.trim()} />
              <Field label="To city" value={seg.toCity} onChange={(v) => updateSegment(i, "toCity", v)} placeholder="Dubai" error={attempted && !seg.toCity.trim()} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
              <Field label="Date" value={seg.date} onChange={(v) => updateSegment(i, "date", v)} placeholder="14 Sep 2026" error={attempted && !seg.date.trim()} />
              <Field label="Depart time" value={seg.depart} onChange={(v) => updateSegment(i, "depart", v)} placeholder="23:45" error={attempted && !seg.depart.trim()} />
              <Field label="Arrive time" value={seg.arrive} onChange={(v) => updateSegment(i, "arrive", v)} placeholder="02:55" error={attempted && !seg.arrive.trim()} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
              <Field label="Duration" value={seg.duration} onChange={(v) => updateSegment(i, "duration", v)} placeholder="4h 10m" error={attempted && !seg.duration.trim()} />
              <Select label="Baggage" value={seg.baggage} onChange={(v) => updateSegment(i, "baggage", v)} options={BAGGAGE_OPTIONS} placeholder="-- Select baggage --" error={attempted && !seg.baggage.trim()} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Field label="Airline" value={seg.airline} onChange={(v) => updateSegment(i, "airline", v)} placeholder="Emirates" error={attempted && !seg.airline.trim()} />
              <Field label="Flight no" value={seg.flightNo} onChange={(v) => updateSegment(i, "flightNo", v)} placeholder="EK 585" error={attempted && !seg.flightNo.trim()} />
              <Select label="Cabin" value={seg.cabin} onChange={(v) => updateSegment(i, "cabin", v)} options={CABIN_OPTIONS} placeholder="-- Select cabin --" error={attempted && !seg.cabin.trim()} />
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={addSegment}
          className="flex items-center gap-2 mb-6"
          style={{ fontSize: 13, color: COLORS.navy, background: "none", border: `1px dashed ${COLORS.line}`, borderRadius: 8, padding: "8px 12px", cursor: "pointer" }}
        >
          <Plus size={14} /> Add another flight
        </button>

        <div className="mb-3" style={{ fontSize: 12, fontWeight: 600, color: COLORS.slate, textTransform: "uppercase", letterSpacing: 0.5 }}>
          Fare rules
        </div>

        {fareGroups.length === 0 && (
          <div style={{ fontSize: 12, color: COLORS.slate, marginBottom: 16 }}>
            Fill in the airline name on a flight above to add its fare rules here.
          </div>
        )}

        {fareGroups.map((g) => (
          <div key={g.airline} className="mb-4" style={{ border: `1px solid ${COLORS.line}`, borderRadius: 10, padding: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.navy, marginBottom: 10 }}>{g.airline}</div>

            <div className="mb-3" style={{ background: COLORS.cream, borderRadius: 10, padding: 12 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: COLORS.navy, marginBottom: 6 }}>Paste fare rules text (optional)</div>
              <textarea
                value={g.rulesText}
                onChange={(e) => updateGroupRulesText(g.airline, e.target.value)}
                placeholder={"CANCELLATIONS\n    ANY TIME\n      CHARGE USD 90.00.\nCHANGES\n    ANY TIME\n      CHARGE USD 45.00."}
                style={{ ...textareaStyle, minHeight: 70 }}
              />
              <button
                type="button"
                onClick={() => handleParseGroupRules(g.airline)}
                className="flex items-center gap-2 mt-2"
                style={{ fontSize: 12, color: "#fff", background: COLORS.navy, border: "none", borderRadius: 8, padding: "7px 10px", cursor: "pointer" }}
              >
                <Wand2 size={13} /> Auto-fill below
              </button>
            </div>

            <div className="mb-2">
              <div className="flex flex-col sm:flex-row gap-2 sm:items-end">
                <div style={{ flex: 2 }}>
                  <Field
                    label="Cancellation fee"
                    value={g.cancellation.amount}
                    onChange={(v) => updateGroupFee(g.airline, "cancellation", "amount", v)}
                    placeholder="90.00"
                    error={attempted && !g.cancellation.nonRefundable && !String(g.cancellation.amount || "").trim()}
                    disabled={g.cancellation.nonRefundable}
                  />
                </div>
                {!g.cancellation.nonRefundable && (
                  <div style={{ flex: 1 }}>
                    <label style={labelStyle}>Currency</label>
                    <select
                      value={g.cancellation.currency}
                      onChange={(e) => updateGroupFee(g.airline, "cancellation", "currency", e.target.value)}
                      style={selectStyle}
                    >
                      {FARE_RULE_CURRENCIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
              <label className="flex items-center gap-2 mt-1" style={{ fontSize: 12, color: COLORS.slate, cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={g.cancellation.nonRefundable}
                  onChange={(e) => toggleGroupFlag(g.airline, "cancellation", "nonRefundable", e.target.checked)}
                />
                Non-refundable (no cancellation fee applies)
              </label>
            </div>

            <div className="mb-2">
              <div className="flex flex-col sm:flex-row gap-2 sm:items-end">
                <div style={{ flex: 2 }}>
                  <Field
                    label="Change fee"
                    value={g.change.amount}
                    onChange={(v) => updateGroupFee(g.airline, "change", "amount", v)}
                    placeholder="45.00"
                    error={attempted && !g.change.nonChangeable && !String(g.change.amount || "").trim()}
                    disabled={g.change.nonChangeable}
                  />
                </div>
                {!g.change.nonChangeable && (
                  <div style={{ flex: 1 }}>
                    <label style={labelStyle}>Currency</label>
                    <select
                      value={g.change.currency}
                      onChange={(e) => updateGroupFee(g.airline, "change", "currency", e.target.value)}
                      style={selectStyle}
                    >
                      {FARE_RULE_CURRENCIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
              <label className="flex items-center gap-2 mt-1" style={{ fontSize: 12, color: COLORS.slate, cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={g.change.nonChangeable}
                  onChange={(e) => toggleGroupFlag(g.airline, "change", "nonChangeable", e.target.checked)}
                />
                Non-changeable (no date change allowed)
              </label>
            </div>

            <div className="mb-2">
              <div className="flex flex-col sm:flex-row gap-2 sm:items-end">
                <div style={{ flex: 2 }}>
                  <Field
                    label="No-show fee"
                    value={g.noshow.amount}
                    onChange={(v) => updateGroupFee(g.airline, "noshow", "amount", v)}
                    placeholder="130.00"
                    error={attempted && !g.noshow.notApplicable && !String(g.noshow.amount || "").trim()}
                    disabled={g.noshow.notApplicable}
                  />
                </div>
                {!g.noshow.notApplicable && (
                  <div style={{ flex: 1 }}>
                    <label style={labelStyle}>Currency</label>
                    <select
                      value={g.noshow.currency}
                      onChange={(e) => updateGroupFee(g.airline, "noshow", "currency", e.target.value)}
                      style={selectStyle}
                    >
                      {FARE_RULE_CURRENCIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
              <label className="flex items-center gap-2 mt-1" style={{ fontSize: 12, color: COLORS.slate, cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={g.noshow.notApplicable}
                  onChange={(e) => toggleGroupFlag(g.airline, "noshow", "notApplicable", e.target.checked)}
                />
                No no-show fee applies
              </label>
            </div>
          </div>
        ))}

        <label className="flex items-center gap-2 mb-4" style={{ fontSize: 13, color: COLORS.ink, cursor: "pointer" }}>
          <input
            type="checkbox"
            checked={nonRefundableAfterDeparture}
            onChange={(e) => setNonRefundableAfterDeparture(e.target.checked)}
          />
          After departure, ticket is non-refundable
        </label>

        <div className="mb-6">
          <label style={labelStyle}>Additional notes (optional)</label>
          <textarea
            value={extraNotes}
            onChange={(e) => setExtraNotes(e.target.value)}
            placeholder="Any extra terms specific to this booking..."
            style={{ ...textareaStyle, fontFamily: "'Poppins', sans-serif", minHeight: 70 }}
          />
        </div>

        <div className="mb-6 flex flex-col sm:flex-row gap-2">
          <div style={{ flex: 2 }}>
            <Field label="Total fare" value={totalFare} onChange={setTotalFare} placeholder="85,000" error={attempted && !String(totalFare).trim()} />
          </div>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Currency</label>
            <select value={totalFareCurrency} onChange={(e) => setTotalFareCurrency(e.target.value)} style={selectStyle}>
              {FARE_CURRENCIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3 rounded-lg"
          style={{ background: COLORS.navy, color: "#fff", fontFamily: "'Poppins', sans-serif", fontWeight: 500, fontSize: 14 }}
        >
          {initialData ? "Update quotation" : "Generate quotation"}
        </button>
      </form>
    </div>
  );
}
