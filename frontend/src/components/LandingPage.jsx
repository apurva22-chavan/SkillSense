import { useState, useEffect } from "react";
import { S, GLOBAL_CSS } from "../styles/styles";
import { TargetIcon, UploadIcon } from "./Icons";

// ── LANDING PAGE ───────────────────────────────────────────────
export default function LandingPage({ onNavigate }) {
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    setTimeout(() => setVisible(true), 100);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const fadeStyle = (delay) => ({
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(22px)",
    transition: `all .7s ease ${delay}s`,
  });

  return (
    <div style={{ ...S.page, overflowX: "hidden" }}>
      <style>{GLOBAL_CSS}</style>

      {/* ── NAVBAR ── */}
      <nav style={S.navbar(scrolled)}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
          <div className="pulse" style={S.logoIcon}>
            <TargetIcon />
          </div>
          <span style={S.logoText}>
            Align<span style={{ color: "#2563EB" }}>er</span>
          </span>
        </div>

        {/* <div style={{ display: "flex", gap: 32, alignItems: "center" }}>
          {["Features", "How It Works", "Pricing", "Blog"].map((l) => (
            <button key={l} className="nav-link">{l}</button>
          ))}
        </div> */}

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {/* Account dropdown */}
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setDropOpen((o) => !o)}
              style={{
                display: "flex", alignItems: "center", gap: 7,
                padding: "9px 16px", borderRadius: 12,
                border: "1.5px solid #DBEAFE", background: "#fff",
                color: "#2563EB", fontSize: 14, fontWeight: 800,
                cursor: "pointer", fontFamily: "'Sora', sans-serif", transition: "all .2s",
              }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
              </svg>
              Account
              <svg
                width="13" height="13" viewBox="0 0 24 24" fill="none"
                stroke="#6B7280" strokeWidth="2"
                style={{ transform: dropOpen ? "rotate(180deg)" : "none", transition: ".2s" }}
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            {dropOpen && (
              <div
                style={{
                  position: "absolute", top: "calc(100% + 10px)", right: 0,
                  minWidth: 170, background: "#fff", borderRadius: 16,
                  border: "1.5px solid #DBEAFE",
                  boxShadow: "0 16px 48px rgba(37,99,235,0.14)",
                  padding: 6, zIndex: 100, animation: "fadeUp .15s ease",
                }}
              >
                <button className="drop-item">Login</button>
                <button className="drop-item">Sign Up</button>
              </div>
            )}
          </div>

          <button
            className="btn-primary-hover"
            style={S.btnPrimary}
            onClick={() => onNavigate("upload")}
          >
            <UploadIcon /> Upload Resume
          </button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section
        style={{
          position: "relative", minHeight: "100vh",
          display: "flex", alignItems: "center",
          padding: "110px 5vw 80px", overflow: "hidden",
        }}
      >
        {/* Background blobs */}
        <div style={{ position:"absolute", top:"5%", right:"-5%", width:500, height:500, background:"linear-gradient(135deg,#DBEAFE,#EFF6FF)", animation:"blob1 10s ease-in-out infinite", zIndex:0, opacity:0.8 }} />
        <div style={{ position:"absolute", bottom:0, left:"-8%", width:400, height:400, background:"linear-gradient(135deg,#E0F2FE,#CFFAFE)", animation:"blob2 12s ease-in-out infinite", zIndex:0, opacity:0.6 }} />
        <div style={{ position:"absolute", inset:0, zIndex:0, backgroundImage:"radial-gradient(circle,#BFDBFE 1px,transparent 1px)", backgroundSize:"28px 28px", opacity:0.35, pointerEvents:"none" }} />

        <div style={{ position:"relative", zIndex:2, width:"100%", display:"flex", alignItems:"center", gap:"5vw", flexWrap:"wrap" }}>
          {/* Left copy */}
          <div style={{ flex:"1 1 320px", maxWidth:580 }}>
            <div style={{ ...fadeStyle(0.1), display:"inline-flex", alignItems:"center", gap:8, padding:"7px 16px", borderRadius:99, background:"linear-gradient(135deg,#EFF6FF,#DBEAFE)", border:"1.5px solid #BFDBFE", color:"#2563EB", fontSize:13, fontWeight:800, fontFamily:"'Sora', sans-serif", marginBottom:28 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
              AI-Powered Career Intelligence
            </div>

            <h1 style={{ ...fadeStyle(0.2), fontSize:"clamp(34px,4.8vw,62px)", fontWeight:900, lineHeight:1.08, letterSpacing:-2, color:"#111827", marginBottom:24, fontFamily:"'Sora', sans-serif" }}>
              Bridge the gap<br />
              <span style={{ background:"linear-gradient(135deg,#1E3A8A,#2563EB)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>between where you are</span><br />
              <span>&amp; where the industry</span><br />
              <span style={{ background:"linear-gradient(135deg,#1D4ED8,#3B82F6)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>needs you to be.</span>
            </h1>

            <p style={{ ...fadeStyle(0.32), fontSize:17, lineHeight:1.75, color:"#6B7280", marginBottom:36, maxWidth:460 }}>
              Upload your resume. Let AI identify your skill gaps. Get a personalized roadmap to land your dream role — in seconds.
            </p>

            <div style={{ ...fadeStyle(0.42), display:"flex", flexWrap:"wrap", gap:14 }}>
              <button className="btn-primary-hover" style={{ ...S.btnPrimary, fontSize:15, padding:"14px 28px" }} onClick={() => onNavigate("upload")}>
                <UploadIcon size={17} /> Upload Resume — Free
              </button>
              {/* <button className="btn-outline-hover" style={{ ...S.btnOutline, fontSize:15, padding:"13px 26px" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="#2563EB"><polygon points="5 3 19 12 5 21 5 3" /></svg>
                Watch Demo
              </button> */}
            </div>

            {/* Social proof */}
            {/* <div style={{ ...fadeStyle(0.52), display:"flex", alignItems:"center", gap:16, marginTop:40, padding:"16px 20px", borderRadius:16, background:"#fff", border:"1.5px solid #DBEAFE", boxShadow:"0 4px 16px rgba(37,99,235,0.07)", maxWidth:380, flexWrap:"wrap" }}> */}
              {/* <div style={{ display:"flex" }}>
                {["#1E3A8A","#2563EB","#1D4ED8","#3B82F6"].map((bg, i) => (
                  <div key={i} style={{ width:30, height:30, borderRadius:"50%", border:"2px solid #fff", background:bg, display:"flex", alignItems:"center", justifyContent:"center", marginLeft:i ? -8 : 0 }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                  </div>
                ))}
              </div> */}
              {/* <div>
                <div style={{ display:"flex", gap:2, marginBottom:2 }}><span style={{ color:"#f59e0b", fontSize:13 }}>★★★★★</span></div>
                <span style={{ fontSize:12.5, color:"#6B7280", fontWeight:700 }}><b style={{ color:"#111827" }}>12,000+</b> professionals trust Aligner</span>
              </div> */}
              {/* <div style={{ marginLeft:"auto", textAlign:"right" }}>
                <div style={{ fontSize:11, color:"#10b981", fontWeight:800 }}>✓ Free Forever</div>
                <div style={{ fontSize:11, color:"#6B7280" }}>No credit card</div>
              </div> */}
            {/* </div> */}
          </div>

          {/* Right: floating resume card */}
          <div style={{ ...fadeStyle(0.3), flex:"1 1 300px", maxWidth:460 }}>
            <div style={{ position:"relative", minHeight:440, display:"flex", alignItems:"center", justifyContent:"center" }}>
              <div style={{ position:"absolute", width:380, height:380, borderRadius:"50%", background:"radial-gradient(circle at 40% 40%,#DBEAFE 0%,#F8FAFC 40%,#E0F2FE 70%,transparent 100%)" }} />
              <div className="card-float" style={{ position:"relative", zIndex:5, width:260, borderRadius:20, background:"#fff", boxShadow:"0 32px 80px rgba(37,99,235,0.18),0 8px 24px rgba(0,0,0,0.08)", overflow:"hidden", border:"1px solid #DBEAFE" }}>
                <div style={{ height:6, background:"linear-gradient(90deg,#1E3A8A,#2563EB,#06B6D4)" }} />
                <div style={{ padding:"16px 18px 12px" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:14 }}>
                    <div style={{ width:40, height:40, borderRadius:"50%", background:"linear-gradient(135deg,#1D4ED8,#3B82F6)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                    </div>
                    <div style={{ flex:1 }}>
                      <div style={{ height:10, borderRadius:5, background:"#1E3A8A", width:90 }} />
                      <div style={{ height:7, borderRadius:5, background:"#BFDBFE", width:60, marginTop:5 }} />
                    </div>
                    <div style={{ background:"#EFF6FF", borderRadius:8, padding:"4px 8px", fontSize:10, fontWeight:800, color:"#2563EB" }}>78%</div>
                  </div>
                  <div style={{ display:"flex", gap:5, flexWrap:"wrap" }}>
                    {["React","Python","AWS"].map(t => (
                      <span key={t} style={{ fontSize:10, padding:"3px 8px", borderRadius:99, background:"#EFF6FF", color:"#2563EB", fontWeight:700 }}>{t}</span>
                    ))}
                  </div>
                </div>
                <div style={{ height:1, background:"#DBEAFE", margin:"0 18px" }} />
                {[["Experience","#1E3A8A",[92,72,55]],["Education","#2563EB",[80,60]],["Skills","#06B6D4",[95,75,50]]].map(([label, color, bars]) => (
                  <div key={label} style={{ padding:"10px 18px" }}>
                    <div style={{ fontSize:9, fontWeight:800, letterSpacing:1, textTransform:"uppercase", marginBottom:7, color }}>{label}</div>
                    {bars.map((w, i) => (
                      <div key={i} style={{ height:6, borderRadius:3, marginBottom:4, background: i === 0 ? "#DBEAFE" : "#E5E7EB", width:`${w}%` }} />
                    ))}
                  </div>
                ))}
                <div style={{ margin:"8px 18px 16px", padding:"8px 12px", borderRadius:10, background:"linear-gradient(135deg,#EFF6FF,#DBEAFE)", display:"flex", alignItems:"center", gap:6, fontSize:11, fontWeight:700, color:"#2563EB" }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg>
                  AI Analysis Complete
                  <svg style={{ marginLeft:"auto" }} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                </div>
              </div>

              {/* Floating tags */}
              {[
                { label:"Add Docker Skills", color:"#2563EB", bg:"#EFF6FF", top:"5%",    right:"2%",  delay:0,   border:"rgba(37,99,235,0.13)" },
                { label:"Gap: CI/CD",        color:"#f43f5e", bg:"#FFF1F2", top:"38%",   left:"-5%",  delay:0.7, border:"rgba(244,63,94,0.13)" },
                { label:"Boost Keywords ↑",  color:"#10b981", bg:"#ECFDF5", bottom:"22%",right:"-2%", delay:1.2, border:"rgba(16,185,129,0.13)" },
                { label:"+12 XP Earned!",    color:"#f59e0b", bg:"#FFFBEB", bottom:"5%", left:"5%",   delay:0.4, border:"rgba(245,158,11,0.13)" },
              ].map((tag, i) => (
                <div
                  key={i}
                  style={{
                    position:"absolute", display:"flex", alignItems:"center", gap:6,
                    padding:"8px 14px", borderRadius:99, background:"#fff",
                    boxShadow:"0 8px 32px rgba(0,0,0,0.12)", fontSize:12, fontWeight:700,
                    color:"#111827", whiteSpace:"nowrap", zIndex:10,
                    border:`1.5px solid ${tag.border}`,
                    animation:`tagFloat 3.5s ease-in-out ${tag.delay}s infinite alternate`,
                    top:tag.top, right:tag.right, bottom:tag.bottom, left:tag.left,
                  }}
                >
                  <div style={{ width:20, height:20, borderRadius:6, background:tag.bg, display:"flex", alignItems:"center", justifyContent:"center" }}>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={tag.color} strokeWidth="2.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
                  </div>
                  {tag.label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── WAVE ── */}
      <div style={{ lineHeight:0, overflow:"hidden" }}>
        <svg viewBox="0 0 1200 60" preserveAspectRatio="none" style={{ width:"100%", height:60 }}>
          <path d="M0,30 C200,0 400,60 600,30 C800,0 1000,60 1200,30 L1200,60 L0,60 Z" fill="#F8FAFC" />
        </svg>
      </div>

      {/* ── HOW IT WORKS ── */}
      <section style={{ padding:"90px 5vw", background:"#F8FAFC", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:0, right:0, width:350, height:350, borderRadius:"50%", background:"radial-gradient(circle,#DBEAFE,transparent 70%)", opacity:0.6 }} />
        <div style={{ textAlign:"center", marginBottom:8 }}>
          <span style={S.sectionBadge}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
            Simple Process
          </span>
        </div>
        <h2 style={{ fontSize:"clamp(28px,3.5vw,46px)", fontWeight:900, color:"#111827", letterSpacing:-1.5, fontFamily:"'Sora', sans-serif", lineHeight:1.12, marginBottom:16, textAlign:"center" }}>
          Analyze your resume in{" "}
          <span style={{ background:"linear-gradient(135deg,#1E3A8A,#2563EB)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>3 easy steps</span>{" "}
          with AI.
        </h2>
        <p style={{ fontSize:16, color:"#6B7280", maxWidth:520, margin:"0 auto 52px", lineHeight:1.7, textAlign:"center" }}>
          No account needed. Get your personalized roadmap in under 60 seconds.
        </p>
        <div style={{ display:"flex", gap:24, flexWrap:"wrap" }}>
          {[
            { n:"1", title:"Upload",  color:"#2563EB", desc:"Drop your PDF or paste your resume link. Aligner instantly parses experience, skills, and education with pinpoint precision." },
            { n:"2", title:"Analyze", color:"#1D4ED8", desc:"Our NLP engine computes cosine similarity against live job market data — surfacing your exact skill gaps in seconds." },
            { n:"3", title:"Evolve",  color:"#06B6D4", desc:"Receive a personalized career roadmap with curated courses, certifications, and micro-goals. Earn XP as you grow." },
          ].map((s) => (
            <div key={s.n} className="step-card">
              <div style={{ position:"absolute", top:-10, right:12, fontSize:80, fontWeight:900, lineHeight:1, fontFamily:"'Sora', sans-serif", color:"rgba(37,99,235,0.06)", userSelect:"none" }}>{s.n}</div>
              <div style={{ width:48, height:48, borderRadius:14, background:"rgba(37,99,235,0.08)", border:"1.5px solid rgba(37,99,235,0.15)", display:"flex", alignItems:"center", justifyContent:"center", marginBottom:18 }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={s.color} strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
              </div>
              <span style={{ display:"inline-flex", alignItems:"center", gap:6, padding:"3px 10px", borderRadius:99, fontSize:11, fontWeight:800, marginBottom:12, background:"rgba(37,99,235,0.08)", color:s.color, border:"1px solid rgba(37,99,235,0.18)" }}>Step {s.n}</span>
              <div style={{ fontSize:20, fontWeight:800, color:"#111827", marginBottom:10, letterSpacing:-0.5, fontFamily:"'Sora', sans-serif" }}>{s.title}</div>
              <p style={{ fontSize:14, color:"#6B7280", lineHeight:1.7 }}>{s.desc}</p>
            </div>
          ))}
        </div>
        <div style={{ textAlign:"center", marginTop:48 }}>
          <button className="btn-primary-hover" style={{ ...S.btnPrimary, fontSize:15, padding:"14px 32px" }} onClick={() => onNavigate("upload")}>
            <UploadIcon size={16} /> Start Free — Upload Now
          </button>
        </div>
      </section>

      {/* ── WAVE 2 ── */}
      <div style={{ lineHeight:0, overflow:"hidden" }}>
        <svg viewBox="0 0 1200 60" preserveAspectRatio="none" style={{ width:"100%", height:60 }}>
          <path d="M0,30 C300,60 600,0 900,30 C1050,45 1150,15 1200,30 L1200,0 L0,0 Z" fill="#F8FAFC" />
        </svg>
      </div>

      {/* ── FEATURES ── */}
      <section style={{ padding:"90px 5vw", background:"#fff" }}>
        <div style={{ textAlign:"center", marginBottom:8 }}>
          <span style={S.sectionBadge}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
            Why We're Different
          </span>
        </div>
        <h2 style={{ fontSize:"clamp(28px,3.5vw,46px)", fontWeight:900, color:"#111827", letterSpacing:-1.5, fontFamily:"'Sora', sans-serif", lineHeight:1.12, marginBottom:16, textAlign:"center" }}>
          Why{" "}
          <span style={{ background:"linear-gradient(135deg,#1D4ED8,#3B82F6)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>Aligner?</span>
        </h2>
        <p style={{ fontSize:16, color:"#6B7280", maxWidth:520, margin:"0 auto 52px", lineHeight:1.7, textAlign:"center" }}>
          Not just a resume checker — a full-stack career intelligence platform built for the modern job seeker.
        </p>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:20 }}>
          {[
            { color:"#2563EB", title:"Precision Matching",  desc:"We use Cosine Similarity & TF-IDF to compare your resume against thousands of job descriptions, delivering an exact compatibility score.", tags:["Cosine Similarity","NLP Engine","Real-time Scoring"], tagBg:"#EFF6FF", tagColor:"#2563EB", tagBorder:"#BFDBFE" },
            { color:"#1D4ED8", title:"Gamified Growth",     desc:"Turn your career journey into a quest. Earn XP for completing skill modules, unlock achievement badges, and climb leaderboards in your domain.", tags:["XP System","Badges & Streaks","Leaderboard"], tagBg:"#EFF6FF", tagColor:"#1D4ED8", tagBorder:"#BFDBFE" },
            { color:"#06B6D4", title:"Live Market Data",    desc:"Aligner pulls live job postings from LinkedIn and Naukri, ensuring your roadmap always reflects what employers are actively hiring for.", tags:["LinkedIn API","Naukri Feed","Daily Updates"], tagBg:"#ECFEFF", tagColor:"#06B6D4", tagBorder:"#A5F3FC" },
          ].map((f) => (
            <div key={f.title} className="feature-card">
              <div style={{ width:52, height:52, borderRadius:16, background:"rgba(37,99,235,0.1)", border:"1.5px solid rgba(37,99,235,0.18)", display:"flex", alignItems:"center", justifyContent:"center", marginBottom:20 }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={f.color} strokeWidth="2"><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="3" /></svg>
              </div>
              <div style={{ fontSize:20, fontWeight:800, color:"#111827", marginBottom:10, letterSpacing:-0.4, fontFamily:"'Sora', sans-serif" }}>{f.title}</div>
              <p style={{ fontSize:14, color:"#6B7280", lineHeight:1.75, marginBottom:20 }}>{f.desc}</p>
              <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
                {f.tags.map((t) => (
                  <span key={t} style={{ fontSize:12, padding:"5px 12px", borderRadius:99, fontWeight:700, background:f.tagBg, color:f.tagColor, border:`1px solid ${f.tagBorder}` }}>{t}</span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div style={{ display:"flex", flexWrap:"wrap", gap:20, justifyContent:"center", marginTop:60 }}>
          {[["12K+","#2563EB","Professionals"],["94%","#1D4ED8","Match Accuracy"],["3x","#06B6D4","Faster Hiring"],["500+","#3B82F6","Skills Tracked"]].map(([val, color, label]) => (
            <div key={label} style={{ flex:"1 1 140px", textAlign:"center", padding:"24px 20px", borderRadius:18, background:"#fff", border:"1.5px solid #E5E7EB", boxShadow:"0 4px 16px rgba(0,0,0,0.05)" }}>
              <div style={{ fontSize:32, fontWeight:900, fontFamily:"'Sora', sans-serif", letterSpacing:-1, color }}>{val}</div>
              <div style={{ fontSize:13, color:"#6B7280", fontWeight:700, marginTop:4 }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section style={{ padding:"90px 5vw", background:"#F8FAFC" }}>
        <div style={{ textAlign:"center", marginBottom:8 }}>
          <span style={S.sectionBadge}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="#2563EB"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
            Success Stories
          </span>
        </div>
        <h2 style={{ fontSize:"clamp(28px,3.5vw,46px)", fontWeight:900, letterSpacing:-1.5, fontFamily:"'Sora', sans-serif", textAlign:"center", marginBottom:16 }}>
          Loved by{" "}
          <span style={{ background:"linear-gradient(135deg,#1E3A8A,#2563EB)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>career builders</span>
        </h2>
        <p style={{ fontSize:16, color:"#6B7280", maxWidth:520, margin:"0 auto 52px", lineHeight:1.7, textAlign:"center" }}>Real professionals, real results.</p>
        <div style={{ display:"flex", flexWrap:"wrap", gap:20, justifyContent:"center" }}>
          {[
            { quote:"Aligner pinpointed exactly what I was missing. Got my dream offer in 6 weeks.",                  name:"Priya S.",   role:"SWE @ Google",          bg:"linear-gradient(135deg,#1D4ED8,#60A5FA)" },
            { quote:"The gamified roadmap kept me motivated. Best career tool I've ever used.",                       name:"Rahul M.",   role:"Product @ Flipkart",    bg:"linear-gradient(135deg,#2563EB,#60A5FA)" },
            { quote:"The live market data is a game-changer. My resume finally matches what companies want.",         name:"Ananya K.",  role:"Data Scientist @ Meta",  bg:"linear-gradient(135deg,#3B82F6,#60A5FA)" },
          ].map((t) => (
            <div key={t.name} className="testimonial-card">
              <div style={{ color:"#f59e0b", fontSize:14, marginBottom:14 }}>★★★★★</div>
              <p style={{ fontSize:14, color:"#6B7280", lineHeight:1.7, marginBottom:18 }}>&ldquo;{t.quote}&rdquo;</p>
              <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                <div style={{ width:38, height:38, borderRadius:"50%", background:t.bg, display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                </div>
                <div>
                  <div style={{ fontSize:14, fontWeight:800, color:"#111827" }}>{t.name}</div>
                  <div style={{ fontSize:12, color:"#6B7280" }}>{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding:"90px 5vw", background:"#fff" }}>
        <div style={{ maxWidth:760, margin:"0 auto", textAlign:"center", padding:"60px 40px", borderRadius:28, background:"linear-gradient(135deg,#1E3A8A 0%,#2563EB 60%,#3B82F6 100%)", boxShadow:"0 32px 80px rgba(37,99,235,0.3)", position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", top:-60, right:-60, width:240, height:240, borderRadius:"50%", background:"rgba(255,255,255,0.06)" }} />
          <div style={{ position:"relative", zIndex:1 }}>
            <div style={{ display:"inline-flex", alignItems:"center", gap:8, padding:"6px 14px", borderRadius:99, background:"rgba(255,255,255,0.15)", color:"#fff", fontSize:12, fontWeight:800, marginBottom:20, border:"1px solid rgba(255,255,255,0.25)" }}>
              🚀 Start your journey today
            </div>
            <h2 style={{ fontSize:"clamp(26px,3.5vw,40px)", fontWeight:900, color:"#fff", letterSpacing:-1.5, marginBottom:16, fontFamily:"'Sora', sans-serif", lineHeight:1.15 }}>Ready to close the gap?</h2>
            <p style={{ fontSize:16, color:"rgba(255,255,255,0.8)", marginBottom:36, lineHeight:1.7 }}>Upload your resume and get your personalized career roadmap — completely free.</p>
            <div style={{ display:"flex", gap:14, justifyContent:"center", flexWrap:"wrap" }}>
              <button style={{ display:"inline-flex", alignItems:"center", gap:8, padding:"14px 28px", borderRadius:14, border:"none", cursor:"pointer", background:"#fff", color:"#1E3A8A", fontWeight:800, fontSize:15, fontFamily:"'Sora', sans-serif", boxShadow:"0 6px 24px rgba(0,0,0,0.15)", transition:"all .25s" }} onClick={() => onNavigate("upload")}>
                <UploadIcon size={16} color="#1E3A8A" /> Upload Resume — Free
              </button>
              {/* <button style={{ display:"inline-flex", alignItems:"center", gap:8, padding:"14px 28px", borderRadius:14, cursor:"pointer", background:"transparent", color:"#fff", fontWeight:800, fontSize:15, fontFamily:"'Sora', sans-serif", border:"2px solid rgba(255,255,255,0.4)", transition:"all .25s" }}>
                ▶ Watch Demo
              </button> */}
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ padding:"48px 5vw 32px", background:"#1E3A8A" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:20, marginBottom:32 }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ width:32, height:32, borderRadius:10, background:"rgba(255,255,255,0.15)", display:"flex", alignItems:"center", justifyContent:"center" }}>
              <TargetIcon size={16} />
            </div>
            <span style={{ fontSize:20, fontWeight:900, letterSpacing:-0.8, fontFamily:"'Sora', sans-serif", color:"#fff" }}>Align<span style={{ color:"#60A5FA" }}>er</span></span>
          </div>
          {/* <div style={{ display:"flex", gap:28, flexWrap:"wrap" }}>
            {["Features","How It Works","Pricing","Blog","Privacy"].map((l) => (
              <span key={l} className="footer-link">{l}</span>
            ))}
          </div> */}
        
        </div>
        <div style={{ borderTop:"1px solid rgba(255,255,255,0.12)", paddingTop:24, display:"flex", justifyContent:"space-between", flexWrap:"wrap", gap:12 }}>
          <span style={{ fontSize:13, color:"rgba(255,255,255,0.45)" }}>© 2025 Aligner. All rights reserved.</span>
          <span style={{ fontSize:13, color:"rgba(255,255,255,0.45)" }}>Built with ❤️ for career builders</span>
        </div>
      </footer>
    </div>
  );
}