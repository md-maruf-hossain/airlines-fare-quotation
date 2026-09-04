import { Facebook, Instagram, Linkedin, Mail, Phone, Twitter } from "lucide-react";
import { COLORS } from "./quotation/theme";

const socialLinks = [
  { icon: Facebook, href: "https://facebook.com" },
  { icon: Instagram, href: "https://instagram.com" },
  { icon: Linkedin, href: "https://linkedin.com" },
  { icon: Twitter, href: "https://twitter.com" },
];

export default function Footer() {
  return (
    <footer
      className="flex flex-col md:flex-row items-center justify-between gap-4 px-4 md:px-8 py-6"
      style={{ background: COLORS.navy, fontFamily: "'Poppins', sans-serif" }}
    >
      <div className="text-center md:text-left" style={{ fontSize: 12, color: "#C7CEDD" }}>
        <div>&copy; {new Date().getFullYear()} Wingspan Travels. All rights reserved.</div>
        <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-4 mt-1">
          <span className="flex items-center gap-1">
            <Phone size={12} /> +880 1711-223344
          </span>
          <span className="flex items-center gap-1">
            <Mail size={12} /> book@wingspantravels.com
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {socialLinks.map(({ icon: Icon, href }, i) => (
          <a
            key={i}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center rounded-full"
            style={{ width: 30, height: 30, background: "rgba(255,255,255,0.08)", color: "#C7CEDD" }}
          >
            <Icon size={14} />
          </a>
        ))}
      </div>
    </footer>
  );
}
