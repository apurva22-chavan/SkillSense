// ── SHARED STYLE CONSTANTS ─────────────────────────────────────
export const S = {
  page: {
    fontFamily: "'Nunito', sans-serif",
    background: "#fff",
    color: "#111827",
    minHeight: "100vh",
  },
  navbar: (scrolled) => ({
    position: "fixed", top: 0, left: 0, right: 0, zIndex: 500,
    height: 68, display: "flex", alignItems: "center",
    justifyContent: "space-between", padding: "0 5vw",
    transition: "all .3s",
    background: scrolled ? "rgba(255,255,255,0.93)" : "transparent",
    backdropFilter: scrolled ? "blur(20px)" : "none",
    borderBottom: scrolled ? "1px solid #DBEAFE" : "none",
    boxShadow: scrolled ? "0 4px 24px rgba(37,99,235,0.06)" : "none",
  }),
  logoIcon: {
    width: 34, height: 34, borderRadius: 11,
    background: "linear-gradient(135deg,#1E3A8A,#2563EB)",
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  logoText: {
    fontFamily: "'Sora', sans-serif", fontSize: 22,
    fontWeight: 900, letterSpacing: -0.8, color: "#111827",
  },
  btnPrimary: {
    display: "inline-flex", alignItems: "center", gap: 8,
    padding: "11px 22px", borderRadius: 13, border: "none", cursor: "pointer",
    background: "linear-gradient(135deg,#1D4ED8,#3B82F6)", color: "#fff",
    fontWeight: 800, fontSize: 14, fontFamily: "'Sora', sans-serif",
    boxShadow: "0 6px 24px rgba(37,99,235,0.3)", transition: "all .25s",
  },
  btnOutline: {
    display: "inline-flex", alignItems: "center", gap: 8,
    padding: "10px 20px", borderRadius: 13, cursor: "pointer",
    background: "#fff", color: "#2563EB", fontWeight: 800, fontSize: 14,
    fontFamily: "'Sora', sans-serif", border: "2px solid #BFDBFE",
    boxShadow: "0 2px 12px rgba(37,99,235,0.08)", transition: "all .25s",
  },
  sectionBadge: {
    display: "inline-flex", alignItems: "center", gap: 7,
    padding: "7px 16px", borderRadius: 99,
    background: "linear-gradient(135deg,#EFF6FF,#DBEAFE)",
    border: "1.5px solid #BFDBFE", color: "#2563EB",
    fontSize: 13, fontWeight: 800, fontFamily: "'Sora', sans-serif",
    boxShadow: "0 2px 12px rgba(37,99,235,0.1)",
  },
};

// ── GLOBAL CSS ─────────────────────────────────────────────────
export const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800;900&family=Nunito:wght@400;500;600;700;800&display=swap');

  @keyframes blob1 {
    0%,100%{border-radius:60% 40% 55% 45%/45% 55% 40% 60%;transform:translate(0,0) scale(1)}
    33%{border-radius:40% 60% 45% 55%/55% 40% 60% 45%;transform:translate(20px,-15px) scale(1.04)}
    66%{border-radius:55% 45% 60% 40%/40% 60% 45% 55%;transform:translate(-10px,10px) scale(0.97)}
  }
  @keyframes blob2 {
    0%,100%{border-radius:45% 55% 40% 60%/60% 40% 55% 45%;transform:translate(0,0) scale(1)}
    50%{border-radius:60% 40% 55% 45%/45% 60% 40% 55%;transform:translate(-20px,10px) scale(1.06)}
  }
  @keyframes tagFloat {
    from{transform:translateY(0) rotate(-1.5deg)}
    to{transform:translateY(-12px) rotate(1.5deg)}
  }
  @keyframes cardHover {
    from{transform:perspective(1000px) rotateY(-6deg) rotateX(3deg) translateY(0)}
    to{transform:perspective(1000px) rotateY(-4deg) rotateX(1deg) translateY(-10px)}
  }
  @keyframes pulseRing {
    0%{box-shadow:0 0 0 0 rgba(37,99,235,0.35)}
    70%{box-shadow:0 0 0 12px rgba(37,99,235,0)}
    100%{box-shadow:0 0 0 0 rgba(37,99,235,0)}
  }
  @keyframes spin {from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
  @keyframes fadeUp {from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
  @keyframes fillBar {from{width:0}to{width:var(--target-width)}}
  @keyframes drawCircle {from{stroke-dashoffset:var(--circumference)}to{stroke-dashoffset:var(--offset)}}
  @keyframes countUp {from{opacity:0;transform:scale(0.8)}to{opacity:1;transform:scale(1)}}
  @keyframes shimmer {0%{background-position:-200% 0}100%{background-position:200% 0}}
  @keyframes phaseIn {from{opacity:0;transform:translateX(-16px)}to{opacity:1;transform:translateX(0)}}

  .pulse{animation:pulseRing 2.5s infinite}
  .card-float{animation:cardHover 5s ease-in-out infinite alternate}
  .btn-primary-hover:hover{transform:translateY(-2px);box-shadow:0 10px 32px rgba(37,99,235,0.4)!important}
  .btn-outline-hover:hover{border-color:#2563EB!important;background:#EFF6FF!important;transform:translateY(-2px)}

  /* ── Layout cards ── */
  .step-card{background:#fff;border-radius:20px;padding:28px 24px;border:1.5px solid #DBEAFE;box-shadow:0 4px 24px rgba(37,99,235,0.07);position:relative;overflow:hidden;flex:1 1 220px}
  .feature-card{border-radius:22px;padding:32px 28px;background:#F8FAFC;border:1.5px solid #E5E7EB;box-shadow:0 4px 20px rgba(0,0,0,0.05);cursor:pointer;transition:all .3s}
  .feature-card:hover{background:#fff;box-shadow:0 16px 48px rgba(0,0,0,0.05);transform:translateY(-4px)}
  .testimonial-card{flex:1 1 260px;max-width:340px;border-radius:20px;padding:28px 24px;background:#fff;border:1.5px solid #E5E7EB;box-shadow:0 4px 20px rgba(0,0,0,0.05)}

  /* ── Nav ── */
  .footer-link{color:rgba(255,255,255,0.65);font-size:14px;font-weight:600;cursor:pointer;transition:color .2s}
  .footer-link:hover{color:#fff}
  .nav-link{color:#6B7280;font-size:14px;font-weight:700;cursor:pointer;transition:color .2s;background:none;border:none;font-family:'Nunito',sans-serif}
  .nav-link:hover{color:#2563EB}
  .drop-item{width:100%;display:flex;align-items:center;gap:10px;padding:11px 14px;border-radius:10px;border:none;background:transparent;color:#374151;font-size:14px;font-weight:700;cursor:pointer;font-family:'Nunito',sans-serif;transition:background .15s;text-align:left}
  .drop-item:hover{background:#EFF6FF}

  /* ── Upload ── */
  .rec-btn{padding:22px 16px;border-radius:18px;border:2px solid #DBEAFE;background:#fff;font-family:'Sora',sans-serif;cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:10px;transition:all .25s;color:#111827;width:100%}
  .rec-btn:hover{background:#EFF6FF;border-color:#2563EB;transform:translateY(-3px);box-shadow:0 8px 28px rgba(37,99,235,0.12)}
  .up-zone{border:2px dashed #BFDBFE;border-radius:18px;padding:40px 28px;text-align:center;background:#fff;transition:all .25s;cursor:pointer;margin-bottom:22px}
  .up-zone:hover{border-color:#2563EB;background:#EFF6FF}
  .up-done{border:2px solid #10b981;border-radius:18px;padding:40px 28px;text-align:center;background:#ECFDF5;margin-bottom:22px}
  .job-sel{width:100%;padding:14px 16px;border-radius:13px;border:1.5px solid #DBEAFE;background:#fff;font-size:14px;font-weight:700;color:#374151;font-family:'Nunito',sans-serif;appearance:none;cursor:pointer;transition:all .2s;outline:none}
  .job-sel:focus{border-color:#2563EB;box-shadow:0 0 0 3px rgba(37,99,235,0.1)}

  /* ── Certs ── */
  .cert-card{background:#fff;border-radius:22px;border:1.5px solid #E5E7EB;padding:28px 26px;transition:all .3s;animation:fadeUp .5s ease forwards}
  .cert-card:hover{border-color:#BFDBFE;box-shadow:0 16px 48px rgba(37,99,235,0.1);transform:translateY(-4px)}
  .cert-link{display:inline-flex;align-items:center;gap:6px;font-size:13px;font-weight:700;color:#2563EB;padding:9px 16px;border-radius:10px;border:1.5px solid #BFDBFE;background:#EFF6FF;text-decoration:none;transition:all .2s;cursor:pointer}
  .cert-link:hover{background:#DBEAFE;border-color:#93C5FD}

  /* ── Projects ── */
  .proj-card{background:#fff;border-radius:22px;border:1.5px solid #E5E7EB;padding:28px 26px;transition:all .3s;animation:fadeUp .5s ease forwards;display:flex;flex-direction:column}
  .proj-card:hover{border-color:#BFDBFE;box-shadow:0 16px 48px rgba(37,99,235,0.1);transform:translateY(-4px)}
  .proj-link{display:inline-flex;align-items:center;gap:6px;font-size:13px;font-weight:700;color:#2563EB;padding:8px 14px;border-radius:9px;border:1.5px solid #BFDBFE;background:#EFF6FF;text-decoration:none;transition:all .2s;cursor:pointer}
  .proj-link:hover{background:#DBEAFE;border-color:#93C5FD}
  .proj-link-yt{background:#FFF1F2;border-color:#FECDD3;color:#E11D48}
  .proj-link-yt:hover{background:#FFE4E6;border-color:#FDA4AF}

  /* ── Analytics charts ── */
  .chart-card{background:#fff;border-radius:22px;border:1.5px solid #E5E7EB;padding:28px;box-shadow:0 4px 20px rgba(0,0,0,0.04);animation:fadeUp .6s ease forwards}
  .bar-track{background:#F1F5F9;border-radius:99px;height:10px;overflow:hidden;position:relative}
  .bar-fill{height:100%;border-radius:99px;transition:width 1.2s cubic-bezier(0.22,1,0.36,1)}
  .skill-row{display:flex;align-items:center;gap:12px;padding:10px 0;border-bottom:1px solid #F1F5F9}
  .skill-row:last-child{border-bottom:none}
  .donut-label{font-family:'Sora',sans-serif;font-weight:900;font-size:22px;fill:#111827}
  .donut-sub{font-size:11px;font-weight:700;fill:#6B7280}

  /* ── Career path ── */
  .phase-card{background:#fff;border-radius:20px;border:1.5px solid #E5E7EB;padding:24px;transition:all .3s;animation:phaseIn .5s ease forwards;position:relative;overflow:hidden}
  .phase-card:hover{border-color:#BFDBFE;box-shadow:0 12px 36px rgba(37,99,235,0.08);transform:translateY(-2px)}
  .timeline-dot{width:14px;height:14px;border-radius:50%;background:linear-gradient(135deg,#1D4ED8,#3B82F6);flex-shrink:0;box-shadow:0 0 0 4px rgba(37,99,235,0.15)}
  .company-chip{display:inline-flex;align-items:center;gap:6px;padding:8px 14px;border-radius:12px;background:#F8FAFC;border:1.5px solid #E5E7EB;font-size:13px;font-weight:700;color:#374151;transition:all .2s}
  .company-chip:hover{background:#EFF6FF;border-color:#BFDBFE;color:#2563EB}
  .milestone-item{display:flex;align-items:flex-start;gap:8px;padding:6px 0;font-size:13.5px;color:#374151;font-weight:600;line-height:1.6}
  .quick-win{display:flex;align-items:center;gap:10px;padding:12px 16px;border-radius:12px;background:#FFFBEB;border:1px solid #FDE68A;font-size:13px;font-weight:700;color:#92400E;margin-bottom:8px}
`;