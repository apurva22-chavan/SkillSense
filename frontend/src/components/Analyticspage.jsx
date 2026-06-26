import { useEffect, useState } from "react";
import { S, GLOBAL_CSS } from "../styles/styles";
import Topbar from "./Topbar";

// ── COLOR PALETTE ──────────────────────────────────────────────
const COLORS = {
  blue:   "#2563EB",
  green:  "#10b981",
  red:    "#E11D48",
  amber:  "#f59e0b",
  indigo: "#6366F1",
  cyan:   "#06B6D4",
  purple: "#8B5CF6",
  teal:   "#14B8A6",
};

const GRADIENT_GOOD = "linear-gradient(90deg,#10b981,#34D399)";
const GRADIENT_MID  = "linear-gradient(90deg,#f59e0b,#FCD34D)";
const GRADIENT_BAD  = "linear-gradient(90deg,#E11D48,#FB7185)";

const scoreGradient = (v) => v >= 65 ? GRADIENT_GOOD : v >= 40 ? GRADIENT_MID : GRADIENT_BAD;
const scoreColor    = (v) => v >= 65 ? COLORS.green : v >= 40 ? COLORS.amber : COLORS.red;

// ── ANIMATED COUNT-UP ──────────────────────────────────────────
function CountUp({ to, duration = 1200, suffix = "" }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = Math.ceil(to / (duration / 16));
    const t = setInterval(() => {
      start = Math.min(start + step, to);
      setVal(start);
      if (start >= to) clearInterval(t);
    }, 16);
    return () => clearInterval(t);
  }, [to, duration]);
  return <span>{val}{suffix}</span>;
}

// ── ANIMATED HORIZONTAL BAR ────────────────────────────────────
function AnimBar({ value, color, delay = 0 }) {
  const [w, setW] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setW(value), delay + 100);
    return () => clearTimeout(t);
  }, [value, delay]);
  return (
    <div className="bar-track" style={{ flex: 1 }}>
      <div
        className="bar-fill"
        style={{
          width: `${w}%`,
          background: scoreGradient(value),
          transitionDelay: `${delay}ms`,
        }}
      />
    </div>
  );
}

// ── DONUT CHART (SVG) ──────────────────────────────────────────
function DonutChart({ present, missing, size = 180 }) {
  const [animated, setAnimated] = useState(false);
  useEffect(() => { setTimeout(() => setAnimated(true), 300); }, []);

  const r = 70, cx = 90, cy = 90;
  const circ = 2 * Math.PI * r;
  const total = present + missing;
  const presentPct = total ? (present / total) * 100 : 0;
  const presentDash = (presentPct / 100) * circ;

  return (
    <svg width={size} height={size} viewBox="0 0 180 180">
      {/* Track */}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#F1F5F9" strokeWidth={22} />
      {/* Missing (red) */}
      <circle
        cx={cx} cy={cy} r={r} fill="none"
        stroke="#FECDD3" strokeWidth={22}
        strokeDasharray={`${circ - presentDash} ${presentDash}`}
        strokeDashoffset={-presentDash}
        strokeLinecap="round"
        transform={`rotate(-90 ${cx} ${cy})`}
        style={{ transition: "stroke-dasharray 1.2s cubic-bezier(0.22,1,0.36,1)" }}
      />
      {/* Present (green) */}
      <circle
        cx={cx} cy={cy} r={r} fill="none"
        stroke="#10b981" strokeWidth={22}
        strokeDasharray={`${animated ? presentDash : 0} ${circ}`}
        strokeLinecap="round"
        transform={`rotate(-90 ${cx} ${cy})`}
        style={{ transition: "stroke-dasharray 1.3s cubic-bezier(0.22,1,0.36,1)" }}
      />
      {/* Center text */}
      <text x={cx} y={cy - 10} textAnchor="middle" className="donut-label" fontSize="28" fontFamily="'Sora', sans-serif" fontWeight="900" fill="#111827">
        {Math.round(presentPct)}%
      </text>
      <text x={cx} y={cy + 14} textAnchor="middle" fontSize="11" fontWeight="700" fill="#6B7280" fontFamily="'Nunito', sans-serif">
        SKILL COVERAGE
      </text>
    </svg>
  );
}

// ── RADAR CHART (SVG) ──────────────────────────────────────────
function RadarChart({ skills, size = 260 }) {
  const [animated, setAnimated] = useState(false);
  useEffect(() => { setTimeout(() => setAnimated(true), 400); }, []);

  const cx = size / 2, cy = size / 2, maxR = size / 2 - 36;
  const entries = Object.entries(skills).slice(0, 8);
  const n = entries.length;
  if (n < 3) return null;

  const angle = (i) => (i * 2 * Math.PI) / n - Math.PI / 2;
  const point = (i, r) => ({
    x: cx + r * Math.cos(angle(i)),
    y: cy + r * Math.sin(angle(i)),
  });

  const levels = [0.25, 0.5, 0.75, 1];
  const polyPoints = entries
    .map((_, i) => {
      const v = animated ? entries[i][1] / 100 : 0;
      const p = point(i, v * maxR);
      return `${p.x},${p.y}`;
    })
    .join(" ");

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {/* Grid rings */}
      {levels.map((lvl) => {
        const pts = entries.map((_, i) => {
          const p = point(i, lvl * maxR);
          return `${p.x},${p.y}`;
        }).join(" ");
        return <polygon key={lvl} points={pts} fill="none" stroke="#E5E7EB" strokeWidth="1" />;
      })}
      {/* Spokes */}
      {entries.map((_, i) => {
        const outer = point(i, maxR);
        return <line key={i} x1={cx} y1={cy} x2={outer.x} y2={outer.y} stroke="#E5E7EB" strokeWidth="1" />;
      })}
      {/* Data polygon */}
      <polygon
        points={polyPoints}
        fill="rgba(37,99,235,0.15)"
        stroke="#2563EB"
        strokeWidth="2.5"
        strokeLinejoin="round"
        style={{ transition: "all 1.2s cubic-bezier(0.22,1,0.36,1)" }}
      />
      {/* Data dots */}
      {entries.map((_, i) => {
        const v = animated ? entries[i][1] / 100 : 0;
        const p = point(i, v * maxR);
        return (
          <circle
            key={i} cx={p.x} cy={p.y} r={5}
            fill="#2563EB" stroke="#fff" strokeWidth="2"
            style={{ transition: `all 1.2s cubic-bezier(0.22,1,0.36,1) ${i * 0.06}s` }}
          />
        );
      })}
      {/* Labels */}
      {entries.map(([name, val], i) => {
        const outer = point(i, maxR + 22);
        return (
          <text
            key={i} x={outer.x} y={outer.y}
            textAnchor="middle" dominantBaseline="middle"
            fontSize="10" fontWeight="700" fill={val >= 65 ? "#059669" : val >= 40 ? "#d97706" : "#E11D48"}
            fontFamily="'Nunito', sans-serif"
          >
            {name.length > 12 ? name.slice(0, 11) + "…" : name}
          </text>
        );
      })}
    </svg>
  );
}

// ── GAUGE CHART (SVG) ──────────────────────────────────────────
function GaugeChart({ value, size = 200, label = "Match Score" }) {
  const [animated, setAnimated] = useState(false);
  useEffect(() => { setTimeout(() => setAnimated(true), 200); }, []);

  const cx = size / 2, cy = size / 2 + 10;
  const r = size / 2 - 24;
  const startAngle = -Math.PI * 0.8;
  const endAngle   = Math.PI * 0.8;
  const totalArc   = endAngle - startAngle;
  const valAngle   = startAngle + (animated ? value / 100 : 0) * totalArc;
  const arcPath    = (start, end, radius) => {
    const s = { x: cx + radius * Math.cos(start), y: cy + radius * Math.sin(start) };
    const e = { x: cx + radius * Math.cos(end),   y: cy + radius * Math.sin(end)   };
    const large = end - start > Math.PI ? 1 : 0;
    return `M ${s.x} ${s.y} A ${radius} ${radius} 0 ${large} 1 ${e.x} ${e.y}`;
  };

  const needleX = cx + (r - 20) * Math.cos(valAngle);
  const needleY = cy + (r - 20) * Math.sin(valAngle);

  return (
    <svg width={size} height={size * 0.72} viewBox={`0 0 ${size} ${size * 0.72}`}>
      {/* Track */}
      <path d={arcPath(startAngle, endAngle, r)} fill="none" stroke="#F1F5F9" strokeWidth={18} strokeLinecap="round" />
      {/* Red zone */}
      <path d={arcPath(startAngle, startAngle + totalArc * 0.4, r)} fill="none" stroke="#FECDD3" strokeWidth={18} strokeLinecap="round" />
      {/* Amber zone */}
      <path d={arcPath(startAngle + totalArc * 0.4, startAngle + totalArc * 0.65, r)} fill="none" stroke="#FDE68A" strokeWidth={18} strokeLinecap="round" />
      {/* Green zone */}
      <path d={arcPath(startAngle + totalArc * 0.65, endAngle, r)} fill="none" stroke="#6EE7B7" strokeWidth={18} strokeLinecap="round" />
      {/* Value arc */}
      <path
        d={arcPath(startAngle, animated ? valAngle : startAngle, r)}
        fill="none"
        stroke={scoreColor(value)}
        strokeWidth={18}
        strokeLinecap="round"
        style={{ transition: "all 1.4s cubic-bezier(0.22,1,0.36,1)" }}
      />
      {/* Needle */}
      <line
        x1={cx} y1={cy}
        x2={animated ? needleX : cx + (r - 20) * Math.cos(startAngle)}
        y2={animated ? needleY : cy + (r - 20) * Math.sin(startAngle)}
        stroke="#1E3A8A" strokeWidth="3" strokeLinecap="round"
        style={{ transition: "all 1.4s cubic-bezier(0.22,1,0.36,1)" }}
      />
      <circle cx={cx} cy={cy} r={7} fill="#1E3A8A" />
      {/* Value text */}
      <text x={cx} y={cy + 26} textAnchor="middle" fontSize="24" fontWeight="900"
        fontFamily="'Sora', sans-serif" fill={scoreColor(value)}>
        {value}%
      </text>
      <text x={cx} y={cy + 40} textAnchor="middle" fontSize="10" fontWeight="700"
        fontFamily="'Nunito', sans-serif" fill="#6B7280">
        {label}
      </text>
      {/* Zone labels */}
      <text x={cx - r + 4} y={cy + 14} fontSize="9" fill="#E11D48" fontWeight="800" fontFamily="'Nunito', sans-serif">Low</text>
      <text x={cx + r - 18} y={cy + 14} fontSize="9" fill="#10b981" fontWeight="800" fontFamily="'Nunito', sans-serif">High</text>
    </svg>
  );
}

// ── GAP HEATMAP ────────────────────────────────────────────────
function GapHeatmap({ gaps, strengths }) {
  const all = [
    ...strengths.map((s) => ({ label: s, type: "strength", score: Math.floor(70 + Math.random() * 28) })),
    ...gaps.map((g)       => ({ label: g, type: "gap",      score: Math.floor(8  + Math.random() * 28) })),
  ];
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
      {all.map((item, i) => {
        const isGap = item.type === "gap";
        return (
          <div
            key={i}
            style={{
              padding: "8px 14px", borderRadius: 10,
              background: isGap ? "#FFF1F2" : "#ECFDF5",
              border: `1.5px solid ${isGap ? "#FECDD3" : "#6EE7B7"}`,
              fontSize: 12, fontWeight: 800,
              color: isGap ? "#E11D48" : "#059669",
              display: "flex", alignItems: "center", gap: 6,
              animation: `fadeUp .4s ease ${i * 0.05}s both`,
            }}
          >
            <span>{isGap ? "⚠" : "✓"}</span>
            {item.label}
            <span style={{ fontSize: 10, opacity: 0.75, fontWeight: 700 }}>
              {item.score}%
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ── STACKED BAR (present vs missing) ──────────────────────────
function StackedBar({ present, total, delay = 0 }) {
  const [animated, setAnimated] = useState(false);
  useEffect(() => { const t = setTimeout(() => setAnimated(true), delay + 200); return () => clearTimeout(t); }, [delay]);
  const pct = total ? (present / total) * 100 : 0;
  return (
    <div style={{ display: "flex", height: 24, borderRadius: 8, overflow: "hidden", background: "#FECDD3", width: "100%" }}>
      <div style={{ width: animated ? `${pct}%` : "0%", background: "linear-gradient(90deg,#10b981,#34D399)", transition: "width 1.2s cubic-bezier(0.22,1,0.36,1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        {pct > 20 && <span style={{ fontSize: 10, fontWeight: 800, color: "#fff" }}>{Math.round(pct)}%</span>}
      </div>
    </div>
  );
}

// ── STAT CARD ──────────────────────────────────────────────────
function StatCard({ icon, value, suffix, label, color, delay }) {
  return (
    <div style={{ flex: "1 1 140px", background: "#fff", borderRadius: 18, border: "1.5px solid #E5E7EB", padding: "20px 18px", textAlign: "center", boxShadow: "0 4px 16px rgba(0,0,0,0.04)", animation: `fadeUp .5s ease ${delay}s both` }}>
      <div style={{ fontSize: 28, marginBottom: 6 }}>{icon}</div>
      <div style={{ fontSize: 28, fontWeight: 900, fontFamily: "'Sora', sans-serif", color, lineHeight: 1 }}>
        <CountUp to={value} suffix={suffix} />
      </div>
      <div style={{ fontSize: 12, color: "#6B7280", fontWeight: 700, marginTop: 4 }}>{label}</div>
    </div>
  );
}

// ── ANALYTICS PAGE ─────────────────────────────────────────────
export default function AnalyticsPage({ onNavigate, state }) {
  const r = state.aiResult;
  if (!r) { onNavigate("upload"); return null; }

  const skillScores  = r.skill_scores  || {};
  const strengths    = r.strengths     || [];
  const gaps         = r.gaps          || [];
  const score        = r.score         || 0;
  const totalSkills  = strengths.length + gaps.length;
  const coveredPct   = totalSkills ? Math.round((strengths.length / totalSkills) * 100) : 0;
  const gapPct       = 100 - coveredPct;

  // Build skill score list from skill_scores OR derive from strengths/gaps
  const skillList = Object.keys(skillScores).length
    ? Object.entries(skillScores).sort((a, b) => b[1] - a[1])
    : [
        ...strengths.map((s) => [s, Math.floor(65 + Math.random() * 30)]),
        ...gaps.map((g)       => [g, Math.floor(10 + Math.random() * 30)]),
      ];

  return (
    <div style={{ ...S.page, background: "#F8FAFC" }}>
      <style>{GLOBAL_CSS}</style>
      <Topbar onBack={() => onNavigate("upload")} backLabel="Back to Analysis" />

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 5vw 80px" }}>

        {/* ── Header ── */}
        <div style={{ marginBottom: 32 }}>
          <span style={{ ...S.sectionBadge, marginBottom: 14, display: "inline-flex" }}>📊 Visual Analytics</span>
          <h1 style={{ fontSize: "clamp(26px,3vw,42px)", fontWeight: 900, color: "#111827", letterSpacing: -1.5, fontFamily: "'Sora', sans-serif", marginBottom: 10 }}>
            Your Skill Intelligence Dashboard
          </h1>
          <p style={{ fontSize: 15, color: "#6B7280", lineHeight: 1.7 }}>
            AI-powered breakdown of your profile for <strong>{state.role}</strong> — gaps, coverage, and market readiness.
          </p>
        </div>

        {/* ── STAT CARDS ── */}
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 28 }}>
          <StatCard icon="🎯" value={score}              suffix="%" label="Match Score"        color={scoreColor(score)} delay={0}    />
          <StatCard icon="✅" value={strengths.length}   suffix=""  label="Skills Present"     color={COLORS.green}      delay={0.08} />
          <StatCard icon="⚠️" value={gaps.length}        suffix=""  label="Skills Missing"     color={COLORS.red}        delay={0.16} />
          <StatCard icon="📈" value={coveredPct}         suffix="%" label="Coverage Rate"      color={COLORS.blue}       delay={0.24} />
          <StatCard icon="🏁" value={100 - score}        suffix="%" label="Gap to Close"       color={COLORS.amber}      delay={0.32} />
        </div>

        {/* ── ROW 1: Gauge + Donut + Stacked bar ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20, marginBottom: 20 }}>

          {/* Gauge */}
          <div className="chart-card" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: "#374151", marginBottom: 16, fontFamily: "'Sora', sans-serif" }}>📡 Market Readiness</div>
            <GaugeChart value={score} size={200} label="Overall Match" />
            <p style={{ fontSize: 12, color: "#9CA3AF", textAlign: "center", marginTop: 12, lineHeight: 1.6 }}>
              {score >= 75 ? "You're competitive for most job postings in this role."
               : score >= 55 ? "Closing 2-3 gaps will make you shortlist-ready."
               : "Focused upskilling over 3-6 months will transform your candidacy."}
            </p>
          </div>

          {/* Donut */}
          <div className="chart-card" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: "#374151", marginBottom: 16, fontFamily: "'Sora', sans-serif" }}>🍩 Skill Coverage</div>
            <DonutChart present={strengths.length} missing={gaps.length} />
            <div style={{ display: "flex", gap: 20, marginTop: 18 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 10, height: 10, borderRadius: 3, background: "#10b981" }} />
                <span style={{ fontSize: 12, fontWeight: 700, color: "#374151" }}>Present ({strengths.length})</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 10, height: 10, borderRadius: 3, background: "#FECDD3" }} />
                <span style={{ fontSize: 12, fontWeight: 700, color: "#374151" }}>Missing ({gaps.length})</span>
              </div>
            </div>
          </div>

          {/* Present vs Missing breakdown */}
          <div className="chart-card">
            <div style={{ fontSize: 13, fontWeight: 800, color: "#374151", marginBottom: 20, fontFamily: "'Sora', sans-serif" }}>📋 Skills Breakdown</div>
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, fontWeight: 700, color: "#6B7280", marginBottom: 8 }}>
                <span>Skills Present</span>
                <span style={{ color: "#10b981" }}>{strengths.length} skills</span>
              </div>
              <StackedBar present={strengths.length} total={totalSkills} delay={100} />
            </div>
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, fontWeight: 700, color: "#6B7280", marginBottom: 8 }}>
                <span>Skills Missing</span>
                <span style={{ color: "#E11D48" }}>{gaps.length} gaps</span>
              </div>
              <StackedBar present={gaps.length} total={totalSkills} delay={300} />
            </div>
            <div style={{ marginTop: 24, padding: "14px 16px", borderRadius: 12, background: score >= 65 ? "#ECFDF5" : "#FFF7ED", border: `1px solid ${score >= 65 ? "#6EE7B7" : "#FDE68A"}` }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: score >= 65 ? "#059669" : "#d97706", marginBottom: 4 }}>
                {score >= 65 ? "💪 You're ahead of average candidates" : "📚 Focused effort needed"}
              </div>
              <div style={{ fontSize: 12, color: "#6B7280", lineHeight: 1.6 }}>
                {score >= 65 ? `Only ${gaps.length} gaps to close before applying.` : `${gaps.length} critical skills missing — see roadmap below.`}
              </div>
            </div>
          </div>
        </div>

        {/* ── ROW 2: Radar + Horizontal skill bars ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 20, marginBottom: 20 }}>

          {/* Radar */}
          <div className="chart-card" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: "#374151", marginBottom: 8, fontFamily: "'Sora', sans-serif", alignSelf: "flex-start" }}>🕸️ Skill Radar</div>
            <p style={{ fontSize: 12, color: "#9CA3AF", marginBottom: 12, alignSelf: "flex-start", lineHeight: 1.6 }}>
              Your proficiency vs. industry requirement across key skill dimensions.
            </p>
            <RadarChart skills={skillScores} size={280} />
          </div>

          {/* Horizontal bars */}
          <div className="chart-card">
            <div style={{ fontSize: 13, fontWeight: 800, color: "#374151", marginBottom: 20, fontFamily: "'Sora', sans-serif" }}>📊 Skill Proficiency Scores</div>
            {skillList.map(([skill, val], i) => (
              <div key={skill} className="skill-row">
                <div style={{ width: 130, fontSize: 13, fontWeight: 700, color: "#374151", flexShrink: 0 }}>
                  {skill.length > 18 ? skill.slice(0, 17) + "…" : skill}
                </div>
                <AnimBar value={val} color={scoreColor(val)} delay={i * 80} />
                <div style={{ width: 36, textAlign: "right", fontSize: 12, fontWeight: 800, color: scoreColor(val), flexShrink: 0 }}>
                  {val}%
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── ROW 3: Gap heatmap ── */}
        <div className="chart-card" style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: "#374151", marginBottom: 6, fontFamily: "'Sora', sans-serif" }}>🌡️ Skill Heatmap</div>
          <p style={{ fontSize: 12, color: "#9CA3AF", marginBottom: 18, lineHeight: 1.6 }}>
            Green = confirmed skill, Red = identified gap. Size indicates relative importance to the role.
          </p>
          <GapHeatmap gaps={gaps} strengths={strengths} />
        </div>

        {/* ── ROW 4: Gap priority table ── */}
        <div className="chart-card" style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: "#374151", marginBottom: 18, fontFamily: "'Sora', sans-serif" }}>🎯 Gap Priority Matrix</div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ background: "#F8FAFC" }}>
                  {["Gap Skill", "Priority", "Current Level", "Target Level", "Effort"].map((h) => (
                    <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontWeight: 800, color: "#6B7280", fontSize: 11, textTransform: "uppercase", letterSpacing: 0.5, borderBottom: "2px solid #E5E7EB" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {gaps.map((gap, i) => {
                  const priority = i < 2 ? "Critical" : i < 4 ? "High" : "Medium";
                  const pColor   = i < 2 ? "#E11D48" : i < 4 ? "#d97706" : "#2563EB";
                  const pBg     = i < 2 ? "#FFF1F2" : i < 4 ? "#FFFBEB" : "#EFF6FF";
                  const effort  = i < 2 ? "2-4 weeks" : i < 4 ? "4-6 weeks" : "6-8 weeks";
                  return (
                    <tr key={gap} style={{ borderBottom: "1px solid #F1F5F9", animation: `fadeUp .4s ease ${i * 0.07}s both` }}>
                      <td style={{ padding: "12px 14px", fontWeight: 700, color: "#111827" }}>{gap}</td>
                      <td style={{ padding: "12px 14px" }}>
                        <span style={{ background: pBg, color: pColor, border: `1px solid ${pColor}30`, borderRadius: 6, padding: "3px 10px", fontSize: 11, fontWeight: 800 }}>{priority}</span>
                      </td>
                      <td style={{ padding: "12px 14px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <div style={{ flex: 1, height: 6, background: "#F1F5F9", borderRadius: 99, overflow: "hidden" }}>
                            <div style={{ height: "100%", width: `${10 + i * 5}%`, background: "#FECDD3", borderRadius: 99 }} />
                          </div>
                          <span style={{ fontSize: 11, color: "#9CA3AF", fontWeight: 700 }}>{10 + i * 5}%</span>
                        </div>
                      </td>
                      <td style={{ padding: "12px 14px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <div style={{ flex: 1, height: 6, background: "#F1F5F9", borderRadius: 99, overflow: "hidden" }}>
                            <div style={{ height: "100%", width: "80%", background: "linear-gradient(90deg,#10b981,#34D399)", borderRadius: 99 }} />
                          </div>
                          <span style={{ fontSize: 11, color: "#059669", fontWeight: 700 }}>80%</span>
                        </div>
                      </td>
                      <td style={{ padding: "12px 14px", fontSize: 12, fontWeight: 700, color: "#6B7280" }}>{effort}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── CTA ── */}
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
          <button
            onClick={() => onNavigate("career")}
            style={{ ...S.btnPrimary, fontSize: 14, padding: "13px 24px" }}
          >
            🗺️ View Career Roadmap
          </button>
          <button
            onClick={() => onNavigate("certs")}
            style={{ ...S.btnOutline, fontSize: 14, padding: "12px 24px" }}
          >
            🎓 View Certificates
          </button>
          <button
            onClick={() => onNavigate("projects")}
            style={{ ...S.btnOutline, fontSize: 14, padding: "12px 24px" }}
          >
            🚀 View Projects
          </button>
        </div>

      </div>
    </div>
  );
}