import { Plane, Clock, Luggage } from "lucide-react";
import { COLORS } from "./theme";

export default function FlightSegment({ seg, isLast }) {
  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center pt-1">
        <div
          className="flex items-center justify-center rounded-full"
          style={{ width: 30, height: 30, background: COLORS.cream, border: `1px solid ${COLORS.line}` }}
        >
          <Plane size={14} color={COLORS.navy} />
        </div>
        {!isLast && <div style={{ width: 1, flex: 1, background: COLORS.line, marginTop: 4 }} />}
      </div>

      <div className="flex-1 pb-6">
        <div className="flex items-baseline justify-between flex-wrap gap-2">
          <div className="flex items-baseline gap-3">
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, fontSize: 22, color: COLORS.navy }}>
              {seg.from}
            </span>
            <span style={{ color: COLORS.slate, fontSize: 13 }}>{seg.fromCity}</span>
            <span style={{ color: COLORS.goldLight, fontSize: 16 }}>&rarr;</span>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, fontSize: 22, color: COLORS.navy }}>
              {seg.to}
            </span>
            <span style={{ color: COLORS.slate, fontSize: 13 }}>{seg.toCity}</span>
          </div>
          <span
            className="px-2 py-1"
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 11,
              letterSpacing: 0.5,
              background: COLORS.cream,
              color: COLORS.navy,
              borderRadius: 4,
              border: `1px solid ${COLORS.line}`,
            }}
          >
            {seg.airline.toUpperCase()} &middot; {seg.flightNo}
          </span>
        </div>

        <div className="mt-2 flex flex-wrap gap-x-6 gap-y-1" style={{ fontFamily: "'Poppins', sans-serif", fontSize: 13, color: COLORS.slate }}>
          <span>{seg.date}</span>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", color: COLORS.ink }}>
            {seg.depart} &ndash; {seg.arrive}
          </span>
          <span className="flex items-center gap-1">
            <Clock size={13} /> {seg.duration}
          </span>
          <span className="flex items-center gap-1">
            <Luggage size={13} /> {seg.baggage}
          </span>
          <span>{seg.cabin}</span>
        </div>
      </div>
    </div>
  );
}
