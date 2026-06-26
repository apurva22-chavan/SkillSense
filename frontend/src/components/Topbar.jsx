import { S } from "../styles/styles";
import { TargetIcon, BackIcon } from "./Icons";

// ── TOPBAR COMPONENT ────────────────────────────────────────────
// Shared sticky header used by Upload, Certs, and Projects pages.
export default function Topbar({ onBack, backLabel = "Back to Home", subtitle }) {
  return (
    <div
      style={{
        height: 64,
        background: "rgba(255,255,255,0.95)",
        backdropFilter: "blur(18px)",
        borderBottom: "1px solid #DBEAFE",
        display: "flex",
        alignItems: "center",
        padding: "0 28px",
        gap: 12,
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}
    >
      <div style={{ ...S.logoIcon, width: 34, height: 34 }}>
        <TargetIcon />
      </div>
      <span style={S.logoText}>
        Align<span style={{ color: "#2563EB" }}>er</span>
      </span>

      {subtitle && (
        <span style={{ fontSize: 13, color: "#6B7280", marginLeft: 12 }}>
          {subtitle}
        </span>
      )}

      <button
        onClick={onBack}
        style={{
          marginLeft: "auto",
          display: "flex",
          alignItems: "center",
          gap: 6,
          padding: "8px 16px",
          borderRadius: 10,
          border: "1.5px solid #DBEAFE",
          background: "#fff",
          color: "#2563EB",
          fontWeight: 700,
          fontSize: 13,
          cursor: "pointer",
          fontFamily: "'Nunito', sans-serif",
          transition: "all .2s",
        }}
      >
        <BackIcon /> {backLabel}
      </button>
    </div>
  );
}