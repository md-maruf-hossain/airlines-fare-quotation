import { useState } from "react";
import { Download, Image as ImageIcon, MessageCircle, Copy, Check } from "lucide-react";
import { buildWhatsAppText } from "../../utils/whatsappText";
import { COLORS } from "./theme";

const btnBase = {
  fontFamily: "'Poppins', sans-serif",
  fontWeight: 500,
  fontSize: 14,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  lineHeight: "16px",
};

const iconStyle = { flexShrink: 0, display: "block", marginRight: 8, position: "relative", top: 0 };

export default function QuotationActions({ quote, cardRef }) {
  const [copied, setCopied] = useState(false);

  const handleDownloadImage = async () => {
    if (!cardRef.current) return;
    const html2canvas = (await import("html2canvas")).default;
    const canvas = await html2canvas(cardRef.current, { backgroundColor: "#ffffff", scale: 2 });
    const link = document.createElement("a");
    link.download = `${quote.ref}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const handleCopyText = async () => {
    await navigator.clipboard.writeText(buildWhatsAppText(quote));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(buildWhatsAppText(quote));
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  const handleDownloadPDF = async () => {
    if (!cardRef.current) return;
    const html2canvas = (await import("html2canvas")).default;
    const { jsPDF } = await import("jspdf");

    const canvas = await html2canvas(cardRef.current, { backgroundColor: "#ffffff", scale: 2 });
    const imgData = canvas.toDataURL("image/png");

    // page sized to match the card's own aspect ratio, in points
    const pdf = new jsPDF({
      orientation: canvas.height > canvas.width ? "portrait" : "landscape",
      unit: "px",
      format: [canvas.width, canvas.height],
    });
    pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
    pdf.save(`${quote.ref}.pdf`);
  };

  return (
    <div
      data-html2canvas-ignore="true"
      className="grid grid-cols-1 sm:grid-cols-2 gap-3 px-6 py-4"
      style={{ background: COLORS.cream, borderTop: `1px solid ${COLORS.line}` }}
    >
      <button
        onClick={handleDownloadPDF}
        className="py-2.5 rounded-lg"
        style={{ ...btnBase, background: COLORS.navy, color: "#fff" }}
      >
        <Download size={16} style={iconStyle} />
        <span style={{ lineHeight: "16px" }}>Download PDF</span>
      </button>

      <button
        onClick={handleDownloadImage}
        className="py-2.5 rounded-lg"
        style={{ ...btnBase, background: "#fff", color: COLORS.navy, border: `1px solid ${COLORS.line}` }}
      >
        <ImageIcon size={16} style={iconStyle} />
        <span style={{ lineHeight: "16px" }}>Download image</span>
      </button>

      <button
        onClick={handleShareWhatsApp}
        className="py-2.5 rounded-lg"
        style={{ ...btnBase, background: "#fff", color: COLORS.navy, border: `1px solid ${COLORS.line}` }}
      >
        <MessageCircle size={16} style={iconStyle} />
        <span style={{ lineHeight: "16px" }}>Share on WhatsApp</span>
      </button>

      <button
        onClick={handleCopyText}
        className="py-2.5 rounded-lg"
        style={{ ...btnBase, background: "#fff", color: COLORS.navy, border: `1px solid ${COLORS.line}` }}
      >
        {copied ? <Check size={16} style={iconStyle} /> : <Copy size={16} style={iconStyle} />}
        <span style={{ lineHeight: "16px" }}>{copied ? "Copied!" : "Copy as text"}</span>
      </button>
    </div>
  );
}
