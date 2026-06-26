"""
views.py — Aligner Django backend (Gemini edition)

pip install google-genai PyPDF2 python-docx
Set GEMINI_API_KEY in settings.py or as env var.
"""

import json
import os
import re

from django.conf import settings
from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from google import genai


# ─────────────────────────────
# GEMINI CLIENT
# ─────────────────────────────
def get_gemini_client():
    api_key = getattr(settings, "GEMINI_API_KEY", None) or os.environ.get("GEMINI_API_KEY")
    if not api_key:
        raise RuntimeError("GEMINI_API_KEY not set")
    return genai.Client(api_key=api_key)


# ─────────────────────────────
# TEXT EXTRACTION
# ─────────────────────────────
def extract_text_from_pdf(file_obj):
    try:
        import PyPDF2
        reader = PyPDF2.PdfReader(file_obj)
        return "\n".join(page.extract_text() or "" for page in reader.pages)
    except Exception:
        return ""


def extract_text_from_docx(file_obj):
    try:
        import docx
        doc = docx.Document(file_obj)
        return "\n".join(p.text for p in doc.paragraphs)
    except Exception:
        return ""


def extract_resume_text(file):
    if not file:
        return ""
    name = file.name.lower()
    if name.endswith(".pdf"):
        return extract_text_from_pdf(file)
    if name.endswith(".docx"):
        return extract_text_from_docx(file)
    try:
        return file.read().decode("utf-8", errors="ignore")
    except Exception:
        return ""


# ─────────────────────────────
# SHARED GEMINI HELPER
# ─────────────────────────────
def call_gemini(prompt: str) -> str:
    client = get_gemini_client()

    response = client.models.generate_content(
        model="gemini-3-flash-preview",
        contents=prompt,
        config={"response_mime_type": "application/json"},
    )
    return response.text.strip()


def parse_json_safe(raw: str):
    """Strip markdown fences and extract the first JSON object."""
    raw = raw.replace("```json", "").replace("```", "").strip()
    match = re.search(r"\{.*\}", raw, re.DOTALL)
    if not match:
        raise ValueError("No JSON object found in response")
    return json.loads(match.group())


# ─────────────────────────────
# HEALTH CHECK
# ─────────────────────────────
def index(request, path=None):
    return HttpResponse("Backend is working 🚀")


# ─────────────────────────────
# ANALYZE RESUME
# ─────────────────────────────
ANALYZE_PROMPT = """
You are a senior technical recruiter and career coach with deep knowledge of the CURRENT
tech industry hiring landscape (2024-2025).

Analyze the resume for the target role and return ONLY a valid JSON object — no markdown,
no commentary, no text outside the JSON.

IMPORTANT for certs:
  - Every cert must have a REAL, working URL to the actual course/certification page.
  - Platform must be one of: Coursera, Udemy, AWS, Google Cloud, Microsoft, LinkedIn Learning,
    edX, Pluralsight, DataCamp, freeCodeCamp, HuggingFace, Redis University, HashiCorp,
    CNCF, Tableau, dbt Learn, Educative, YouTube.

IMPORTANT for projects:
  - Each project must directly address one or more of the identified gaps.
  - desc must be 2-3 sentences describing what to build, what technologies to use, and
    what specific gap it closes. Be concrete and technical.
  - skills must be the 4-6 specific technologies used in the project.
  - difficulty: easy = < 1 week, mid = 1-3 weeks, hard = 3-8 weeks.
  - gh must be a real GitHub topics URL: https://github.com/topics/<topic>
  - yt must be a real YouTube search URL for a tutorial on this exact project type.

JSON schema (return exactly this):
{
  "score": <integer 0-100>,
  "summary": "<2-3 sentence brutally honest career assessment for this specific role>",
  "strengths": ["<specific skill/tool/experience>"],
  "gaps": ["<specific missing skill>"],
  "skill_scores": {
    "<skill_name>": <integer 0-100>
  },
  "certs": [
    {
      "icon": "<single emoji>",
      "title": "<exact course/cert name>",
      "platform": "<platform>",
      "why": "<1-2 sentences: which gap this closes and why it matters for this role>",
      "desc": "<1-2 sentences: what the course covers>",
      "tags": ["<tag1>", "<tag2>", "<tag3>"],
      "link": "<real working URL>"
    }
  ],
  "projects": [
    {
      "icon": "<single emoji>",
      "title": "<specific project title>",
      "desc": "<2-3 sentences: what to build, exact stack, which gap it closes>",
      "skills": ["<skill1>", "<skill2>", "<skill3>", "<skill4>"],
      "gh": "https://github.com/topics/<relevant-topic>",
      "yt": "https://www.youtube.com/results?search_query=<relevant+tutorial>",
      "difficulty": "<easy|mid|hard>",
      "gap_addressed": "<which specific gap from the gaps list this closes>",
      "outcome": "<1 sentence: what the recruiter sees on your portfolio>"
    }
  ]
}

Rules:
- skill_scores: list 6-10 skills most relevant to the role, score each 0-100 based on evidence in resume.
  Include both present skills (scored by proficiency) and critical missing skills (scored 0-15).
- strengths: 3-5 items
- gaps: 4-7 specific items
- certs: exactly 6
- projects: exactly 6
"""


@csrf_exempt
@require_http_methods(["POST"])
def analyze_resume(request):
    role = request.POST.get("role", "").strip()
    if not role:
        return JsonResponse({"error": "role is required"}, status=400)

    resume_text = extract_resume_text(request.FILES.get("resume"))

    if resume_text.strip():
        user_part = f"Target role: {role}\n\nResume:\n{resume_text[:8000]}"
    else:
        user_part = (
            f"Target role: {role}\n\n"
            "No resume provided. Perform a general industry gap analysis assuming a "
            "mid-level candidate transitioning into this role with general tech background."
        )

    prompt = f"{ANALYZE_PROMPT}\n\n{user_part}"

    try:
        raw = call_gemini(prompt)
    except Exception as e:
        return JsonResponse({"error": f"Gemini API error: {str(e)}"}, status=500)

    try:
        data = parse_json_safe(raw)
    except Exception:
        return JsonResponse({"error": "Invalid JSON from AI", "raw": raw}, status=500)

    required = {"score", "summary", "strengths", "gaps", "certs", "projects", "skill_scores"}
    if not required.issubset(data.keys()):
        missing = required - set(data.keys())
        # Add empty fallback for optional fields rather than erroring
        if "skill_scores" not in data:
            data["skill_scores"] = {}
        if not required.issubset(data.keys()):
            return JsonResponse({"error": f"Missing keys: {missing}", "raw": raw}, status=500)

    return JsonResponse(data)


# ─────────────────────────────
# CAREER PATH GENERATOR
# ─────────────────────────────
CAREER_PATH_PROMPT = """
You are an expert career strategist who builds hyper-realistic, actionable career roadmaps
based on actual hiring data and industry progression patterns.

Given a target role, current skill gaps, and match score, generate a detailed career path
with concrete monthly milestones.

Return ONLY a valid JSON object — no markdown, no text outside the JSON.

JSON schema:
{
  "title": "<e.g. 'Your Path to Senior Frontend Developer'>",
  "overview": "<2-3 sentence realistic timeline and what success looks like>",
  "estimated_months": <integer: realistic months to be job-ready given the gaps>,
  "current_level": "<e.g. 'Junior', 'Mid-level', 'Career-changer'>",
  "target_level": "<e.g. 'Mid-level Frontend Developer'>",
  "salary_range": {
    "current_est": "<e.g. '₹4-6 LPA' or '$60-80k'>",
    "target_est": "<e.g. '₹10-16 LPA' or '$90-120k'>"
  },
  "phases": [
    {
      "phase": <integer 1-4>,
      "title": "<phase name e.g. 'Foundation & Gap Closing'>",
      "duration": "<e.g. 'Month 1-2'>",
      "focus": "<1 sentence: what this phase achieves>",
      "milestones": [
        "<specific, actionable milestone with measurable outcome>"
      ],
      "skills_to_gain": ["<skill1>", "<skill2>"],
      "deliverable": "<tangible thing to show at end of phase: project/cert/portfolio item>"
    }
  ],
  "top_companies": [
    {
      "name": "<company name>",
      "tier": "<FAANG|Tier-1|Startup|Mid-size>",
      "reason": "<why this company is a realistic target>"
    }
  ],
  "interview_prep": [
    "<specific topic to study for interviews in this role>"
  ],
  "quick_wins": [
    "<something achievable in under 1 week that immediately improves employability>"
  ]
}

Rules:
- phases: exactly 4 phases covering the full journey
- milestones per phase: 3-5 specific, actionable items
- top_companies: 5 companies at different tiers
- interview_prep: 5-7 specific topics
- quick_wins: 3 items
- salary_range: use Indian rupees (LPA) since this is likely an Indian user
- Be realistic — if score is low, estimated_months should be higher (6-12+)
"""


@csrf_exempt
@require_http_methods(["POST"])
def generate_career_path(request):
    """
    POST /api/career-path/
    Body (JSON): { "role": "...", "gaps": [...], "score": 71 }
    """
    try:
        body = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON body"}, status=400)

    role  = body.get("role", "").strip()
    gaps  = body.get("gaps", [])
    score = body.get("score", 50)

    if not role:
        return JsonResponse({"error": "role is required"}, status=400)

    prompt = f"""
{CAREER_PATH_PROMPT}

Target role: {role}
Current match score: {score}/100
Key skill gaps: {', '.join(gaps) if gaps else 'unknown'}
"""

    try:
        raw = call_gemini(prompt)
    except Exception as e:
        return JsonResponse({"error": f"Gemini API error: {str(e)}"}, status=500)

    try:
        data = parse_json_safe(raw)
    except Exception:
        return JsonResponse({"error": "Invalid JSON from AI", "raw": raw}, status=500)

    required = {"title", "overview", "phases", "estimated_months"}
    if not required.issubset(data.keys()):
        return JsonResponse({"error": f"Missing keys in response", "raw": raw}, status=500)

    return JsonResponse(data)