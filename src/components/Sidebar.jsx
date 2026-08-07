import { Plus, Trash2, FileText } from "lucide-react";
import { COLORS } from "./quotation/theme";

function routeSummary(quote) {
  if (!quote.segments || quote.segments.length === 0) return "No route";
  const first = quote.segments[0];
  const last = quote.segments[quote.segments.length - 1];
  return `${first.from || "?"} \u2192 ${last.to || "?"}`;
}

function formatSavedAt(ts) {
  if (!ts) return "";
  return new Date(ts).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
}

export default function Sidebar({ savedQuotes, activeRef, onSelect, onNew, onDelete }) {
  return (
    <div
      className="w-full md:w-64 md:min-h-screen flex-shrink-0"
      style={{
        minHeight: "auto",
        background: COLORS.navy,
        padding: "20px 14px",
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      <div style={{ color: "#fff", fontWeight: 700, fontSize: 15, marginBottom: 16, paddingLeft: 4 }}>
        Quotations
      </div>

      <button
        onClick={onNew}
        className="flex items-center gap-2 w-full"
        style={{
          fontSize: 13,
          color: COLORS.navy,
          background: COLORS.goldLight,
          border: "none",
          borderRadius: 8,
          padding: "9px 12px",
          marginBottom: 16,
          cursor: "pointer",
          fontWeight: 500,
        }}
      >
        <Plus size={15} /> New quotation
      </button>

      {savedQuotes.length === 0 && (
        <div style={{ fontSize: 12, color: "#8891A8", padding: "0 4px", lineHeight: 1.6 }}>
          No saved quotations yet. Generate one and it'll show up here.
        </div>
      )}

      <div className="flex flex-col gap-1 max-h-64 overflow-y-auto md:max-h-none md:overflow-visible">
        {savedQuotes.map((q) => (
          <div
            key={q.ref}
            onClick={() => onSelect(q)}
            className="flex items-start gap-2"
            style={{
              padding: "10px 10px",
              borderRadius: 8,
              cursor: "pointer",
              background: q.ref === activeRef ? "rgba(255,255,255,0.1)" : "transparent",
            }}
          >
            <FileText size={14} color="#C7CEDD" style={{ marginTop: 2, flexShrink: 0 }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, color: "#fff", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {routeSummary(q)}
              </div>
              <div style={{ fontSize: 11, color: "#8891A8" }}>
                {q.ref} &middot; {formatSavedAt(q.savedAt)}
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(q.ref);
              }}
              style={{ background: "none", border: "none", color: "#8891A8", cursor: "pointer", flexShrink: 0 }}
            >
              <Trash2 size={13} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
