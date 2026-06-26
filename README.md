🚀 SkillSense – AI Career Gap Analyzer
SkillSense is an AI-powered career guidance platform that helps students and freshers evaluate their skills against industry job roles. Users can upload their resume, compare it with their desired career path, identify skill gaps, and receive personalized recommendations for certifications, projects, and learning resources.

📌 Problem Statement
Many students struggle to understand whether their current skills match industry expectations. SkillSense bridges this gap by analyzing user profiles and providing actionable insights to improve employability.

✨ Features

- 📄 Resume Upload
- 🎯 Job Role Selection
- 📊 Skill Gap Analysis
- 📈 Career Progress Dashboard
- 📚 Personalized Certification Recommendations
- 💼 Project Recommendations
- 📋 Analytics & Progress Tracking
- 📱 Responsive User Interface

🛠 Tech Stack

Frontend
- React.js
- Vite
- JavaScript
- HTML5
- CSS3

Backend
- Python
- Django

Database
- SQLite

Tools
- Git
- GitHub
- VS Code



 📂 Project Structure


SkillSense/
│
├── backend/
│   ├── aligner/
│   ├── backend/
│   ├── templates/
│   ├── manage.py
│   └── db.sqlite3
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
└── README.md


 🚀 Getting Started

Clone Repository

```bash
git clone https://github.com/apurva22-chavan/SkillSense.git
cd SkillSense
```

---

 Backend Setup

```bash
cd backend

python -m venv venv

# Windows
venv\Scripts\activate

pip install -r requirements.txt

python manage.py migrate

python manage.py runserver
```

Backend runs on:

```
http://127.0.0.1:8000/
```

---

 Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

Frontend runs on:

```
http://localhost:5173/
```

---

 🎯 Future Enhancements

- AI-powered Resume Parsing
- Resume ATS Score
- NLP-based Skill Extraction
- Learning Roadmap Generation
- Course Recommendation Engine
- Resume Improvement Suggestions
- Authentication & User Profiles
- Cloud Database Integration
- Deployment on AWS/Vercel



