import { useRef } from "react";
import { ArrowLeft, Clock } from "lucide-react";
import { quote as sampleQuote } from "../../data/sampleQuote";
import { COLORS, fontImport } from "./theme";
import FlightSegment from "./FlightSegment";
import QuotationActions from "./QuotationActions";
import { computeConnectionGap } from "../../utils/dateUtils";

export default function QuotationPreview({ quote = sampleQuote, onEdit }) {
  const cardRef = useRef(null);

  return (
    <div style={{ background: "#F0EDE4", minHeight: "100vh", padding: "32px 16px", fontFamily: "'Poppins', sans-serif" }}>
      <style>{fontImport}</style>

      {onEdit && (
        <div className="max-w-2xl mx-auto mb-3">
          <button
            onClick={onEdit}
            className="flex items-center gap-2"
            style={{ fontSize: 13, color: COLORS.navy, background: "none", border: "none", cursor: "pointer" }}
          >
            <ArrowLeft size={14} /> Edit this quotation
          </button>
        </div>
      )}

      <div
        ref={cardRef}
        className="max-w-2xl mx-auto"
        style={{ background: COLORS.card, borderRadius: 16, overflow: "hidden", boxShadow: "0 1px 3px rgba(20,33,61,0.08)" }}
      >
        {/* title bar */}
        <div className="flex items-center justify-between px-6 py-5" style={{ background: COLORS.navy }}>
          <div style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: 17, color: "#fff" }}>
            Flight Quotation
          </div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: "#C7CEDD" }}>
            {quote.ref}
          </div>
        </div>

        {/* itinerary */}
        <div className="px-6 pt-6">
          <div
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 500,
              fontSize: 13,
              color: COLORS.gold,
              textTransform: "uppercase",
              letterSpacing: 0.8,
              marginBottom: 16,
            }}
          >
            Flight itinerary
          </div>

          {quote.segments.map((seg, i) => {
            const gap = i < quote.segments.length - 1 ? computeConnectionGap(seg, quote.segments[i + 1]) : null;
            return (
              <div key={i}>
                <FlightSegment seg={seg} isLast={i === quote.segments.length - 1} />
                {gap && gap.type === "transit" && (
                  <div
                    style={{ display: "flex", alignItems: "center", marginLeft: 42, marginTop: -16, marginBottom: 16, fontSize: 12, color: COLORS.gold }}
                  >
                    <Clock size={12} style={{ marginRight: 8, flexShrink: 0 }} />
                    <span>Transit time: {gap.formatted} in {seg.toCity} ({seg.to})</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* total fare */}
        {quote.totalFare && (
          <div className="flex items-center justify-between px-6" style={{ paddingBottom: 16 }}>
            <span style={{ fontSize: 13, color: COLORS.slate, fontWeight: 500 }}>Total Fare</span>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 20, fontWeight: 700, color: COLORS.navy }}>
              {quote.totalFareCurrency} {quote.totalFare}
            </span>
          </div>
        )}

        {/* perforated tear divider */}
        <div className="relative" style={{ margin: "8px 0" }}>
          <div style={{ borderTop: `1.5px dashed ${COLORS.line}` }} />
          <div className="absolute rounded-full" style={{ width: 20, height: 20, background: "#F0EDE4", left: -10, top: -10 }} />
          <div className="absolute rounded-full" style={{ width: 20, height: 20, background: "#F0EDE4", right: -10, top: -10 }} />
        </div>

        {/* fare rules */}
        <div className="px-6 pb-4">
          <div className="flex items-center gap-2 mb-2">
            <span style={{ fontSize: 12, fontWeight: 600, color: COLORS.slate, textTransform: "uppercase", letterSpacing: 0.5 }}>
              Fare rules
            </span>
          </div>
          {(quote.fareRuleGroups || []).map((group, gi) => (
            <div key={gi} style={{ marginBottom: 12 }}>
              {group.airline && (
                <div style={{ fontSize: 12, fontWeight: 600, color: COLORS.gold, marginBottom: 4, marginTop: gi > 0 ? 8 : 0 }}>
                  {group.airline}
                </div>
              )}
              <div style={{ borderTop: `1px solid ${COLORS.line}` }}>
                {group.rules.map((r, ri) => (
                  <div
                    key={ri}
                    className="flex items-center justify-between"
                    style={{ padding: "8px 0", borderBottom: `1px solid ${COLORS.line}`, fontSize: 13 }}
                  >
                    <span style={{ color: COLORS.slate }}>{r.label}</span>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", color: COLORS.ink, fontWeight: 500 }}>{r.value}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
          {quote.extraNotes && (
            <div style={{ fontSize: 13, color: COLORS.slate, marginTop: 10, lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
              {quote.extraNotes}
            </div>
          )}
        </div>

        {/* action buttons */}
        <QuotationActions quote={quote} cardRef={cardRef} />
      </div>
    </div>
  );
}
