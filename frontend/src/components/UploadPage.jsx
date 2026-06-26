import { useState, useEffect, useRef } from "react";
import { S, GLOBAL_CSS } from "../styles/styles";
import { SpinnerIcon } from "./Icons";
import Topbar from "./Topbar";

// ── ANIMATED SCORE BAR ─────────────────────────────────────────
function ScoreBar({ target }) {
  const [w, setW] = useState(0);
  useEffect(() => { setTimeout(() => setW(target), 100); }, [target]);
  return (
    <div style={{ height: "100%", borderRadius: 99, background: "linear-gradient(90deg,#1D4ED8,#3B82F6)", width: `${w}%`, transition: "width 1.2s cubic-bezier(0.22,1,0.36,1)" }} />
  );
}

// ── LOADING STEPS ──────────────────────────────────────────────
const LOADING_STEPS = [
  "📄 Parsing your resume...",
  "🔍 Scanning industry hiring trends...",
  "🧠 Running AI gap analysis...",
  "📊 Calculating your match score...",
  "✅ Finalizing your AI roadmap...",
];

function LoadingSteps({ active }) {
  const [step, setStep] = useState(0);
  useEffect(() => {
    if (!active) { setStep(0); return; }
    const iv = setInterval(() => setStep((s) => Math.min(s + 1, LOADING_STEPS.length - 1)), 900);
    return () => clearInterval(iv);
  }, [active]);
  if (!active) return null;
  return (
    <div style={{ background: "#fff", borderRadius: 18, border: "1.5px solid #DBEAFE", padding: "24px 22px", marginBottom: 18, animation: "fadeUp .4s ease forwards" }}>
      <div style={{ fontSize: 13, fontWeight: 800, color: "#2563EB", marginBottom: 14, fontFamily: "'Sora', sans-serif" }}>AI is analyzing your profile…</div>
      {LOADING_STEPS.map((label, i) => {
        const done = i < step, current = i === step;
        return (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", opacity: i > step ? 0.35 : 1, transition: "opacity .4s" }}>
            <div style={{ width: 22, height: 22, borderRadius: "50%", flexShrink: 0, background: done ? "#10b981" : current ? "linear-gradient(135deg,#1D4ED8,#3B82F6)" : "#E5E7EB", display: "flex", alignItems: "center", justifyContent: "center", transition: "background .4s" }}>
              {done    ? <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
               : current ? <svg style={{ animation: "spin .8s linear infinite" }} width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>
               : <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#9CA3AF" }} />}
            </div>
            <span style={{ fontSize: 13, fontWeight: done ? 700 : current ? 800 : 600, color: done ? "#059669" : current ? "#1D4ED8" : "#9CA3AF" }}>{label}</span>
          </div>
        );
      })}
    </div>
  );
}

// ── NAV BUTTON ─────────────────────────────────────────────────
function NavButton({ icon, label, sublabel, onClick, gradient, borderColor }) {
  return (
    <button
      className="rec-btn"
      onClick={onClick}
      style={{ border: `2px solid ${borderColor}` }}
    >
      <div style={{ width: 52, height: 52, borderRadius: 14, background: gradient, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>
        {icon}
      </div>
      <div style={{ fontSize: 13, fontWeight: 800 }}>{label}</div>
      <span style={{ fontSize: 11.5, color: "#6B7280", fontWeight: 600, textAlign: "center", fontFamily: "'Nunito', sans-serif" }}>{sublabel}</span>
    </button>
  );
}

// ── UPLOAD PAGE ────────────────────────────────────────────────
export default function UploadPage({ onNavigate, state, setState }) {
  const fileRef = useRef();
  const [analyzing, setAnalyzing] = useState(false);
  const [apiError,  setApiError]  = useState("");

  const handleFile = (f) => {
    if (!f) return;
    setState((s) => ({ ...s, fileName: f.name, fileUploaded: true, file: f }));
  };

  const runAnalysis = async () => {
    setApiError("");
    setAnalyzing(true);
    try {
      const fd = new FormData();
      if (state.file) fd.append("resume", state.file);
      fd.append("role", state.role);
      const res = await fetch("/api/analyze/", { method: "POST", body: fd });
      if (!res.ok) {
        const e = await res.json().catch(() => ({}));
        throw new Error(e.error || `Server error ${res.status}`);
      }
      const data = await res.json();
      setState((s) => ({ ...s, analyzed: true, aiResult: data }));
    } catch (err) {
      setApiError(err.message || "Something went wrong. Please try again.");
    } finally {
      setAnalyzing(false);
    }
  };

  const reset = () => {
    setState({ fileName: "", fileUploaded: false, role: "", analyzed: false, file: null, aiResult: null });
    setApiError("");
    if (fileRef.current) fileRef.current.value = "";
  };

  const r = state.aiResult;

  return (
    <div style={{ ...S.page, background: "#F8FAFC" }}>
      <style>{GLOBAL_CSS}</style>
      <Topbar onBack={() => onNavigate("landing")} subtitle={state.analyzed ? `→ ${state.role}` : ""} />

      <div style={{ maxWidth: 700, margin: "0 auto", padding: "48px 5vw 80px", width: "100%" }}>

        {/* ── Header ── */}
        <div style={{ textAlign: "center", marginBottom: 32, paddingTop: 8 }}>
          <span style={{ ...S.sectionBadge, marginBottom: 14, display: "inline-flex" }}>⚡ AI Career Analysis</span>
          <h1 style={{ fontSize: "clamp(24px,3vw,36px)", fontWeight: 900, letterSpacing: -1, color: "#111827", fontFamily: "'Sora', sans-serif", marginBottom: 10 }}>
            Analyze your resume<br />
            <span style={{ background: "linear-gradient(135deg,#1E3A8A,#2563EB)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>powered by Gemini AI</span>
          </h1>
          <p style={{ fontSize: 15, color: "#6B7280", lineHeight: 1.7 }}>Upload → Select role → Get your full AI-powered roadmap</p>
        </div>

        {/* ── Progress stepper ── */}
        <div style={{ display: "flex", alignItems: "center", marginBottom: 32, background: "#fff", borderRadius: 16, border: "1.5px solid #DBEAFE", padding: "16px 20px" }}>
          {[1, 2, 3].map((n, i) => {
            const active = (n === 1 && state.fileUploaded) || (n === 2 && state.role) || (n === 3 && state.analyzed);
            const labels = ["Upload", "Select Role", "AI Results"];
            return (
              <div key={n} style={{ display: "contents" }}>
                <div style={{ flex: 1, textAlign: "center" }}>
                  <div style={{ width: 32, height: 32, borderRadius: "50%", background: active ? "linear-gradient(135deg,#1D4ED8,#3B82F6)" : "#E5E7EB", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 6px", fontSize: 13, fontWeight: 800, color: active ? "#fff" : "#6B7280", fontFamily: "'Sora', sans-serif" }}>{n}</div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: active ? "#2563EB" : "#6B7280" }}>{labels[i]}</div>
                </div>
                {i < 2 && <div style={{ flex: 1, height: 2, background: active ? "linear-gradient(90deg,#1D4ED8,#3B82F6)" : "#DBEAFE", marginBottom: 18 }} />}
              </div>
            );
          })}
        </div>

        {/* ── Upload zone ── */}
        {!state.fileUploaded ? (
          <div className="up-zone" onClick={() => fileRef.current?.click()} onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); handleFile(e.dataTransfer.files[0]); }}>
            <div style={{ width: 56, height: 56, borderRadius: 16, background: "linear-gradient(135deg,#EFF6FF,#DBEAFE)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px", fontSize: 24 }}>📄</div>
            <div style={{ fontSize: 16, fontWeight: 800, color: "#111827", marginBottom: 6, fontFamily: "'Sora', sans-serif" }}>Drop your resume here</div>
            <div style={{ fontSize: 13, color: "#6B7280" }}>PDF, DOCX, or TXT — or click to browse</div>
            <input ref={fileRef} type="file" accept=".pdf,.doc,.docx,.txt" style={{ display: "none" }} onChange={(e) => handleFile(e.target.files[0])} />
          </div>
        ) : (
          <div className="up-done">
            <div style={{ fontSize: 32, marginBottom: 8 }}>✅</div>
            <div style={{ fontSize: 16, fontWeight: 800, color: "#065F46", fontFamily: "'Sora', sans-serif", marginBottom: 4 }}>Resume uploaded!</div>
            <div style={{ fontSize: 13, color: "#059669", fontWeight: 700 }}>{state.fileName}</div>
          </div>
        )}

        {/* File chip */}
        {state.fileUploaded && (
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 16px", borderRadius: 12, background: "#EFF6FF", border: "1.5px solid #BFDBFE", fontSize: 13, fontWeight: 700, color: "#2563EB", marginBottom: 22 }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
            <span>{state.fileName}</span>
            <span style={{ marginLeft: "auto", color: "#10b981", fontSize: 12, fontWeight: 800 }}>✓ Ready</span>
            <button onClick={reset} style={{ background: "none", border: "none", cursor: "pointer", color: "#6B7280", fontSize: 16, padding: "0 0 0 4px" }}>×</button>
          </div>
        )}

        {/* ── Role selector + Analyze ── */}
        {state.fileUploaded && !state.analyzed && (
          <div style={{ animation: "fadeUp .5s ease forwards" }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: "#374151", marginBottom: 8 }}>Select your target job role</p>
            <div style={{ position: "relative", marginBottom: 22 }}>
              <select className="job-sel" value={state.role} onChange={(e) => setState((s) => ({ ...s, role: e.target.value }))} disabled={analyzing}>
                <option value="">— Choose a role —</option>
                <optgroup label="🖥️ Engineering">
                  <option value="Frontend Developer">Frontend Developer</option>
                  <option value="Backend Developer">Backend Developer</option>
                  <option value="Full Stack Developer">Full Stack Developer</option>
                  <option value="DevOps / Cloud Engineer">DevOps / Cloud Engineer</option>
                  <option value="Machine Learning Engineer">Machine Learning Engineer</option>
                  <option value="Data Scientist">Data Scientist</option>
                  <option value="Data Engineer">Data Engineer</option>
                  <option value="Mobile Developer">Mobile Developer</option>
                  <option value="Cybersecurity Engineer">Cybersecurity Engineer</option>
                </optgroup>
                <optgroup label="🎨 Product & Design">
                  <option value="Product Manager">Product Manager</option>
                  <option value="UX Designer">UX Designer</option>
                </optgroup>
                <optgroup label="📊 Business">
                  <option value="Business Analyst">Business Analyst</option>
                  <option value="Digital Marketer">Digital Marketer</option>
                </optgroup>
              </select>
              <span style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "#6B7280" }}>▾</span>
            </div>

            <LoadingSteps active={analyzing} />

            {apiError && (
              <div style={{ background: "#FFF1F2", border: "1.5px solid #FECDD3", borderRadius: 12, padding: "12px 16px", marginBottom: 16, fontSize: 13, color: "#E11D48", fontWeight: 700 }}>
                ⚠ {apiError}
              </div>
            )}

            <button
              onClick={runAnalysis}
              disabled={!state.role || analyzing}
              style={{ width: "100%", padding: 16, borderRadius: 14, border: "none", background: analyzing ? "linear-gradient(135deg,#6B7280,#9CA3AF)" : "linear-gradient(135deg,#1D4ED8,#3B82F6)", color: "#fff", fontSize: 15, fontWeight: 800, fontFamily: "'Sora', sans-serif", cursor: state.role && !analyzing ? "pointer" : "not-allowed", display: "flex", alignItems: "center", justifyContent: "center", gap: 9, marginBottom: 12, transition: "all .25s", boxShadow: "0 6px 24px rgba(37,99,235,0.3)", opacity: !state.role ? 0.6 : 1 }}
            >
              {analyzing ? <><SpinnerIcon /> AI is analyzing...</> : <><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg> Analyze with Gemini AI</>}
            </button>
            <p style={{ fontSize: 12, color: "#9CA3AF", textAlign: "center", lineHeight: 1.6 }}>🤖 Powered by Google Gemini — real industry analysis, not a template</p>
          </div>
        )}

        {/* ── Results ── */}
        {state.analyzed && r && (
          <div style={{ animation: "fadeUp .5s ease forwards" }}>

            {/* AI Summary */}
            {r.summary && (
              <div style={{ background: "linear-gradient(135deg,#EFF6FF,#DBEAFE)", border: "1.5px solid #BFDBFE", borderRadius: 16, padding: "18px 20px", marginBottom: 16 }}>
                <div style={{ fontSize: 11, fontWeight: 900, textTransform: "uppercase", letterSpacing: 1, color: "#2563EB", marginBottom: 8 }}>🤖 AI Career Summary</div>
                <p style={{ fontSize: 14, color: "#1E3A8A", lineHeight: 1.75, fontWeight: 600, margin: 0 }}>{r.summary}</p>
              </div>
            )}

            {/* Score card */}
            <div style={{ background: "#fff", borderRadius: 20, border: "1.5px solid #DBEAFE", padding: 24, marginBottom: 22 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: "#111827", fontFamily: "'Sora', sans-serif" }}>Match Score</div>
                  <div style={{ fontSize: 12, color: "#6B7280", marginTop: 2 }}>vs. <strong>{state.role}</strong> requirements</div>
                </div>
                <div style={{ fontSize: 32, fontWeight: 900, color: "#2563EB", fontFamily: "'Sora', sans-serif" }}>{r.score}%</div>
              </div>
              <div style={{ height: 8, borderRadius: 99, background: "#DBEAFE", overflow: "hidden", margin: "8px 0 10px" }}>
                <ScoreBar target={r.score} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#9CA3AF", fontWeight: 700, marginBottom: 18 }}>
                <span>Needs Work</span>
                <span style={{ color: r.score >= 75 ? "#10b981" : r.score >= 55 ? "#f59e0b" : "#E11D48", fontWeight: 800 }}>
                  {r.score >= 75 ? "Strong Match 🚀" : r.score >= 55 ? "Getting There 💪" : "Gap to Close 📈"}
                </span>
                <span>Perfect Fit</span>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 7, alignItems: "center", marginBottom: 12 }}>
                <span style={{ fontSize: 12, color: "#6B7280", fontWeight: 700, whiteSpace: "nowrap" }}>✓ Strengths:</span>
                {(r.strengths || []).map((s) => <span key={s} style={{ background: "#ECFDF5", color: "#059669", border: "1px solid #6EE7B7", fontSize: 11, padding: "3px 9px", borderRadius: 6, fontWeight: 700 }}>{s}</span>)}
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 7, alignItems: "center" }}>
                <span style={{ fontSize: 12, color: "#6B7280", fontWeight: 700, whiteSpace: "nowrap" }}>⚠ Gaps:</span>
                {(r.gaps || []).map((g) => <span key={g} style={{ background: "#FFF1F2", color: "#E11D48", border: "1px solid #FECDD3", fontSize: 11, padding: "3px 9px", borderRadius: 6, fontWeight: 700 }}>{g}</span>)}
              </div>
            </div>

            {/* ── 4-button nav grid ── */}
            <p style={{ fontSize: 13, fontWeight: 700, color: "#374151", marginBottom: 12 }}>Explore your full AI-powered report:</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 16 }}>
              <NavButton
                icon="📊" label="Skill Analytics"
                sublabel="Charts, radar, gap heatmap & more"
                onClick={() => onNavigate("analytics")}
                gradient="linear-gradient(135deg,#EFF6FF,#DBEAFE)"
                borderColor="#BFDBFE"
              />
              <NavButton
                icon="🗺️" label="Career Roadmap"
                sublabel="Month-by-month path to your goal"
                onClick={() => onNavigate("career")}
                gradient="linear-gradient(135deg,#F5F3FF,#EDE9FE)"
                borderColor="#C4B5FD"
              />
              <NavButton
                icon="🎓" label="Certificate Recs"
                sublabel={`${r.certs?.length || 6} AI-picked certs for your gaps`}
                onClick={() => onNavigate("certs")}
                gradient="linear-gradient(135deg,#FFFBEB,#FDE68A)"
                borderColor="#FDE68A"
              />
              <NavButton
                icon="🚀" label="Project Recs"
                sublabel={`${r.projects?.length || 6} projects to build your portfolio`}
                onClick={() => onNavigate("projects")}
                gradient="linear-gradient(135deg,#ECFDF5,#D1FAE5)"
                borderColor="#6EE7B7"
              />
            </div>

            <button onClick={reset} style={{ width: "100%", padding: "12px 16px", borderRadius: 12, border: "1.5px solid #DBEAFE", background: "#fff", color: "#6B7280", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "'Nunito', sans-serif" }}>
              ↺ Analyze a different resume or role
            </button>
          </div>
        )}
      </div>
    </div>
  );
}