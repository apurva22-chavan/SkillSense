import { useEffect, useState } from "react";
import { S, GLOBAL_CSS } from "../styles/styles";
import Topbar from "./Topbar";

// ── PHASE COLOR MAP ────────────────────────────────────────────
const PHASE_COLORS = [
  { bg: "linear-gradient(135deg,#EFF6FF,#DBEAFE)", border: "#BFDBFE", accent: "#2563EB",  dot: "#2563EB"  },
  { bg: "linear-gradient(135deg,#ECFDF5,#D1FAE5)", border: "#6EE7B7", accent: "#059669",  dot: "#059669"  },
  { bg: "linear-gradient(135deg,#FFFBEB,#FDE68A)", border: "#FDE68A", accent: "#D97706",  dot: "#D97706"  },
  { bg: "linear-gradient(135deg,#FDF4FF,#E9D5FF)", border: "#D8B4FE", accent: "#7C3AED",  dot: "#7C3AED"  },
];

const TIER_COLORS = {
  "FAANG":    { bg: "#EFF6FF", color: "#1D4ED8", border: "#BFDBFE" },
  "Tier-1":   { bg: "#F0FDF4", color: "#15803D", border: "#86EFAC" },
  "Startup":  { bg: "#FFF7ED", color: "#C2410C", border: "#FDBA74" },
  "Mid-size": { bg: "#F5F3FF", color: "#6D28D9", border: "#C4B5FD" },
};

// ── LOADING SKELETON ───────────────────────────────────────────
function Skeleton({ h = 18, w = "100%", mb = 10 }) {
  return (
    <div style={{
      height: h, width: w, marginBottom: mb, borderRadius: 8,
      background: "linear-gradient(90deg,#F1F5F9 25%,#E2E8F0 50%,#F1F5F9 75%)",
      backgroundSize: "200% 100%",
      animation: "shimmer 1.4s infinite",
    }} />
  );
}

function CareerSkeleton() {
  return (
    <div style={{ animation: "fadeUp .4s ease" }}>
      <Skeleton h={32} w="60%" mb={16} />
      <Skeleton h={60} mb={28} />
      <div style={{ display: "flex", gap: 14, marginBottom: 28, flexWrap: "wrap" }}>
        {[1,2,3,4].map(i => <Skeleton key={i} h={80} w="calc(25% - 12px)" mb={0} />)}
      </div>
      {[1,2,3,4].map(i => <Skeleton key={i} h={140} mb={16} />)}
    </div>
  );
}

// ── CAREER PATH PAGE ───────────────────────────────────────────
export default function CareerPathPage({ onNavigate, state }) {
  const [careerData, setCareerData] = useState(null);
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState("");
  const [activePhase, setActivePhase] = useState(null);

  const r = state.aiResult;

  // Auto-fetch on mount
  useEffect(() => {
    if (!r || careerData) return;
    fetchCareerPath();
  }, []);

  const fetchCareerPath = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/career-path/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role:  state.role   || "",
          gaps:  r?.gaps      || [],
          score: r?.score     || 50,
        }),
      });
      if (!res.ok) {
        const e = await res.json().catch(() => ({}));
        throw new Error(e.error || `Server error ${res.status}`);
      }
      const data = await res.json();
      setCareerData(data);
    } catch (err) {
      setError(err.message || "Failed to generate career path.");
    } finally {
      setLoading(false);
    }
  };

  if (!r) { onNavigate("upload"); return null; }

  return (
    <div style={{ ...S.page, background: "#F8FAFC" }}>
      <style>{GLOBAL_CSS}</style>
      <Topbar onBack={() => onNavigate("upload")} backLabel="Back to Analysis" />

      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "40px 5vw 80px" }}>

        {/* ── Header ── */}
        <div style={{ marginBottom: 32 }}>
          <span style={{ ...S.sectionBadge, marginBottom: 14, display: "inline-flex" }}>🗺️ AI Career Roadmap</span>
          <h1 style={{ fontSize: "clamp(26px,3vw,42px)", fontWeight: 900, color: "#111827", letterSpacing: -1.5, fontFamily: "'Sora', sans-serif", marginBottom: 10 }}>
            Your Personalised Career Path
          </h1>
          <p style={{ fontSize: 15, color: "#6B7280", lineHeight: 1.7 }}>
            Step-by-step AI roadmap to become a <strong>{state.role}</strong> — built around your specific gaps.
          </p>
        </div>

        {/* ── Loading / Error ── */}
        {loading && <CareerSkeleton />}

        {error && (
          <div style={{ background: "#FFF1F2", border: "1.5px solid #FECDD3", borderRadius: 14, padding: "20px 24px", marginBottom: 20 }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: "#E11D48", marginBottom: 8 }}>⚠ {error}</div>
            <button onClick={fetchCareerPath} style={{ ...S.btnPrimary, fontSize: 13, padding: "10px 20px" }}>
              Retry
            </button>
          </div>
        )}

        {/* ── Career Data ── */}
        {careerData && !loading && (
          <div style={{ animation: "fadeUp .5s ease forwards" }}>

            {/* Overview card */}
            <div style={{ background: "linear-gradient(135deg,#1E3A8A,#2563EB)", borderRadius: 22, padding: "28px 32px", marginBottom: 24, position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: -40, right: -40, width: 180, height: 180, borderRadius: "50%", background: "rgba(255,255,255,0.06)" }} />
              <div style={{ position: "relative" }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 12px", borderRadius: 99, background: "rgba(255,255,255,0.15)", fontSize: 11, fontWeight: 800, color: "#fff", marginBottom: 12, border: "1px solid rgba(255,255,255,0.25)" }}>
                  🤖 Generated by Gemini AI
                </div>
                <h2 style={{ fontSize: "clamp(18px,2.5vw,28px)", fontWeight: 900, color: "#fff", fontFamily: "'Sora', sans-serif", marginBottom: 10, letterSpacing: -0.5 }}>
                  {careerData.title}
                </h2>
                <p style={{ fontSize: 14, color: "rgba(255,255,255,0.82)", lineHeight: 1.75, marginBottom: 20, maxWidth: 620 }}>
                  {careerData.overview}
                </p>

                {/* Meta stats */}
                <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                  {[
                    { label: "Est. Timeline",    value: `${careerData.estimated_months} months`,        icon: "⏱️" },
                    { label: "Current Level",     value: careerData.current_level || "Mid-level",        icon: "📍" },
                    { label: "Target Level",      value: careerData.target_level  || state.role,         icon: "🏆" },
                    { label: "Current Est. CTC",  value: careerData.salary_range?.current_est || "—",    icon: "💰" },
                    { label: "Target CTC",        value: careerData.salary_range?.target_est  || "—",    icon: "🚀" },
                  ].map(({ label, value, icon }) => (
                    <div key={label} style={{ background: "rgba(255,255,255,0.12)", borderRadius: 12, padding: "10px 16px", border: "1px solid rgba(255,255,255,0.2)" }}>
                      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", fontWeight: 700, marginBottom: 4 }}>{icon} {label}</div>
                      <div style={{ fontSize: 14, fontWeight: 800, color: "#fff", fontFamily: "'Sora', sans-serif" }}>{value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Phase timeline ── */}
            <div style={{ marginBottom: 28 }}>
              <h3 style={{ fontSize: 18, fontWeight: 900, color: "#111827", fontFamily: "'Sora', sans-serif", marginBottom: 20, letterSpacing: -0.5 }}>
                📅 Phase-by-Phase Roadmap
              </h3>

              <div style={{ position: "relative" }}>
                {/* Vertical timeline line */}
                <div style={{ position: "absolute", left: 20, top: 28, bottom: 28, width: 2, background: "linear-gradient(to bottom,#2563EB,#7C3AED)", borderRadius: 99 }} />

                {(careerData.phases || []).map((phase, i) => {
                  const col = PHASE_COLORS[i % 4];
                  const isOpen = activePhase === i;
                  return (
                    <div
                      key={i}
                      style={{ position: "relative", paddingLeft: 54, marginBottom: 16, animation: `phaseIn .5s ease ${i * 0.1}s both` }}
                    >
                      {/* Timeline dot */}
                      <div className="timeline-dot" style={{ position: "absolute", left: 14, top: 20, background: col.dot }} />

                      <div
                        className="phase-card"
                        style={{ cursor: "pointer" }}
                        onClick={() => setActivePhase(isOpen ? null : i)}
                      >
                        {/* Phase header */}
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                              <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 10px", borderRadius: 99, fontSize: 11, fontWeight: 800, background: col.bg, color: col.accent, border: `1px solid ${col.border}` }}>
                                Phase {phase.phase} · {phase.duration}
                              </span>
                            </div>
                            <div style={{ fontSize: 16, fontWeight: 800, color: "#111827", fontFamily: "'Sora', sans-serif" }}>{phase.title}</div>
                            <div style={{ fontSize: 13, color: "#6B7280", marginTop: 4 }}>{phase.focus}</div>
                          </div>
                          <svg
                            width="20" height="20" viewBox="0 0 24 24" fill="none"
                            stroke="#9CA3AF" strokeWidth="2"
                            style={{ flexShrink: 0, transform: isOpen ? "rotate(180deg)" : "none", transition: "transform .3s" }}
                          >
                            <polyline points="6 9 12 15 18 9" />
                          </svg>
                        </div>

                        {/* Expanded content */}
                        {isOpen && (
                          <div style={{ marginTop: 18, paddingTop: 18, borderTop: `1px solid ${col.border}`, animation: "fadeUp .3s ease" }}>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                              {/* Milestones */}
                              <div>
                                <div style={{ fontSize: 12, fontWeight: 800, color: col.accent, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 10 }}>🎯 Milestones</div>
                                {(phase.milestones || []).map((m, mi) => (
                                  <div key={mi} className="milestone-item">
                                    <div style={{ width: 20, height: 20, borderRadius: 6, background: col.bg, border: `1px solid ${col.border}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 10, fontWeight: 800, color: col.accent }}>
                                      {mi + 1}
                                    </div>
                                    {m}
                                  </div>
                                ))}
                              </div>

                              {/* Skills + Deliverable */}
                              <div>
                                <div style={{ fontSize: 12, fontWeight: 800, color: col.accent, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 10 }}>🔧 Skills to Gain</div>
                                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 18 }}>
                                  {(phase.skills_to_gain || []).map((s) => (
                                    <span key={s} style={{ background: col.bg, color: col.accent, border: `1px solid ${col.border}`, borderRadius: 8, padding: "4px 10px", fontSize: 12, fontWeight: 700 }}>{s}</span>
                                  ))}
                                </div>
                                {phase.deliverable && (
                                  <div style={{ background: col.bg, border: `1px solid ${col.border}`, borderRadius: 12, padding: "12px 14px" }}>
                                    <div style={{ fontSize: 11, fontWeight: 800, color: col.accent, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 }}>📦 End Deliverable</div>
                                    <div style={{ fontSize: 13, color: "#374151", fontWeight: 600, lineHeight: 1.6 }}>{phase.deliverable}</div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ── Two col: Quick wins + Interview prep ── */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 28 }}>

              {/* Quick wins */}
              <div className="chart-card">
                <div style={{ fontSize: 14, fontWeight: 800, color: "#111827", fontFamily: "'Sora', sans-serif", marginBottom: 16 }}>⚡ Quick Wins (This Week)</div>
                <p style={{ fontSize: 12, color: "#9CA3AF", marginBottom: 16, lineHeight: 1.6 }}>Actions you can take in under 7 days that immediately improve your profile.</p>
                {(careerData.quick_wins || []).map((win, i) => (
                  <div key={i} className="quick-win" style={{ animationDelay: `${i * 0.1}s` }}>
                    <span style={{ fontSize: 16 }}>⚡</span>
                    {win}
                  </div>
                ))}
              </div>

              {/* Interview prep */}
              <div className="chart-card">
                <div style={{ fontSize: 14, fontWeight: 800, color: "#111827", fontFamily: "'Sora', sans-serif", marginBottom: 16 }}>🎤 Interview Preparation Topics</div>
                <p style={{ fontSize: 12, color: "#9CA3AF", marginBottom: 16, lineHeight: 1.6 }}>Critical topics to master before interviewing for <strong>{state.role}</strong> roles.</p>
                {(careerData.interview_prep || []).map((topic, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 0", borderBottom: "1px solid #F1F5F9", animation: `fadeUp .4s ease ${i * 0.07}s both` }}>
                    <div style={{ width: 26, height: 26, borderRadius: 8, background: "linear-gradient(135deg,#EFF6FF,#DBEAFE)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 900, color: "#2563EB", flexShrink: 0 }}>{i + 1}</div>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "#374151" }}>{topic}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Target companies ── */}
            {careerData.top_companies?.length > 0 && (
              <div className="chart-card" style={{ marginBottom: 28 }}>
                <div style={{ fontSize: 14, fontWeight: 800, color: "#111827", fontFamily: "'Sora', sans-serif", marginBottom: 8 }}>🏢 Target Companies</div>
                <p style={{ fontSize: 12, color: "#9CA3AF", marginBottom: 20, lineHeight: 1.6 }}>Realistic companies to target at different career stages based on your profile.</p>
                <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                  {careerData.top_companies.map((co, i) => {
                    const tc = TIER_COLORS[co.tier] || TIER_COLORS["Mid-size"];
                    return (
                      <div key={i} className="company-chip" style={{ animation: `fadeUp .4s ease ${i * 0.08}s both`, background: tc.bg, border: `1.5px solid ${tc.border}`, flexDirection: "column", alignItems: "flex-start", gap: 4, minWidth: 160 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, width: "100%" }}>
                          <span style={{ fontSize: 15, fontWeight: 900, color: tc.color }}>{co.name}</span>
                          <span style={{ fontSize: 10, fontWeight: 800, padding: "2px 7px", borderRadius: 5, background: tc.bg, color: tc.color, border: `1px solid ${tc.border}`, marginLeft: "auto" }}>{co.tier}</span>
                        </div>
                        <span style={{ fontSize: 11, color: "#6B7280", fontWeight: 600, lineHeight: 1.5 }}>{co.reason}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ── CTAs ── */}
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
              <button onClick={() => onNavigate("analytics")} style={{ ...S.btnOutline, fontSize: 14, padding: "12px 24px" }}>
                📊 View Analytics
              </button>
              <button onClick={() => onNavigate("certs")}    style={{ ...S.btnOutline, fontSize: 14, padding: "12px 24px" }}>
                🎓 View Certificates
              </button>
              <button onClick={() => onNavigate("projects")} style={{ ...S.btnOutline, fontSize: 14, padding: "12px 24px" }}>
                🚀 View Projects
              </button>
              <button
                onClick={fetchCareerPath}
                style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "12px 20px", borderRadius: 13, border: "1.5px solid #E5E7EB", background: "#fff", color: "#6B7280", fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "'Nunito', sans-serif", transition: "all .2s" }}
              >
                ↺ Regenerate Path
              </button>
            </div>

          </div>
        )}

        {/* Initial state — show generate button if not yet loaded */}
        {!careerData && !loading && !error && (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🗺️</div>
            <h3 style={{ fontSize: 22, fontWeight: 800, color: "#111827", fontFamily: "'Sora', sans-serif", marginBottom: 10 }}>Generate Your Career Path</h3>
            <p style={{ fontSize: 15, color: "#6B7280", marginBottom: 28, maxWidth: 400, margin: "0 auto 28px" }}>
              AI will build a personalised month-by-month roadmap to become a <strong>{state.role}</strong>.
            </p>
            <button onClick={fetchCareerPath} style={{ ...S.btnPrimary, fontSize: 15, padding: "14px 32px" }}>
              🚀 Generate My Roadmap
            </button>
          </div>
        )}

      </div>
    </div>
  );
}