import { useState } from "react";
import LandingPage    from "./components/LandingPage";
import UploadPage     from "./components/UploadPage";
import CertsPage      from "./components/CertsPage";
import ProjectsPage   from "./components/ProjectsPage";
import AnalyticsPage  from "./components/Analyticspage";
import CareerPathPage from "./components/Careerpathpage";

// ── APP ROOT ───────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("landing");
  const [appState, setAppState] = useState({
    fileName:    "",
    fileUploaded: false,
    role:        "",
    analyzed:    false,
    file:        null,
    aiResult:    null,  // Full Gemini response: { score, summary, strengths, gaps, skill_scores, certs, projects }
  });

  const navigate = (p) => {
    setPage(p);
    window.scrollTo(0, 0);
  };

  if (page === "landing")   return <LandingPage    onNavigate={navigate} />;
  if (page === "upload")    return <UploadPage     onNavigate={navigate} state={appState} setState={setAppState} />;
  if (page === "certs")     return <CertsPage      onNavigate={navigate} state={appState} />;
  if (page === "projects")  return <ProjectsPage   onNavigate={navigate} state={appState} />;
  if (page === "analytics") return <AnalyticsPage  onNavigate={navigate} state={appState} />;
  if (page === "career")    return <CareerPathPage  onNavigate={navigate} state={appState} />;
  return null;
}