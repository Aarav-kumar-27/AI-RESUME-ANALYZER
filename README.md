AI Resume Analyzer

An AI-powered resume analysis platform that evaluates a resume against a target job description and provides an overall match score, skill matching, improvement feedback, and actionable recommendations.

Built with React, FastAPI, Python, and Google Gemini, with a local heuristic fallback for reliable analysis when Gemini is unavailable.

🚀 Live Demo

Frontend: https://ai-resume-analyzer-frontend-zpqa.onrender.com

Backend API: https://ai-resume-analyzer-k3yc.onrender.com

✨ Features
📄 Upload resumes in PDF and DOCX formats
💼 Enter a target job description
🤖 AI-powered analysis using Google Gemini
🔄 Automatic heuristic fallback when Gemini is unavailable
🎯 Deterministic overall resume-job match score
📊 Visual score dashboard
🧩 Matching and missing skill detection
💡 Grounded improvement recommendations
📝 Resume strengths and weaknesses
🌙 Dark/Light theme support
📱 Responsive design for mobile, tablet, and desktop
🔐 API key securely isolated in the backend
🛡️ File validation and upload security
🚫 Uploaded resumes are processed in memory without permanent document storage
🧠 How It Works

The application follows this workflow:

Resume Upload
      ↓
PDF/DOCX Validation
      ↓
Resume Text Extraction
      ↓
Job Description Processing
      ↓
Google Gemini AI Analysis
      ↓
Structured JSON Validation
      ↓
Deterministic Score Calculation
      ↓
Interactive Results Dashboard


If Gemini is unavailable because the API key is missing, the API quota is exceeded, or an AI request fails, the system automatically falls back to the local heuristic analysis engine.

🎯 Scoring System

The overall match score is calculated by the backend using a deterministic weighted formula:

Overall Score =
    ATS Compatibility     × 20%
  + Skills Match          × 30%
  + Experience Relevance  × 25%
  + Achievement           × 15%
  + Clarity               × 10%


The final score is calculated independently by the backend rather than relying on Gemini to calculate the overall score.

Score Categories
Category	Weight
ATS Compatibility	20%
Skills Match	30%
Experience Relevance	25%
Achievement	15%
Clarity	10%
🤖 AI Analysis

The application uses Google's Gemini API for structured resume analysis.

Gemini provides:

ATS compatibility score
Skills match score
Experience relevance score
Achievement score
Clarity score
Matching skills
Missing skills
Resume strengths
Areas for improvement
Actionable recommendations
Overall analysis summary

The backend validates the AI response using Pydantic before returning it to the frontend.

🔄 Heuristic Fallback

The application includes a local analysis engine that automatically takes over when Gemini cannot be used.

The fallback engine:

Extracts relevant keywords
Compares resume skills with job requirements
Generates matching and missing skills
Produces a validated analysis response
Maintains the same response structure used by the Gemini path

This allows the application to remain functional even when the AI service is unavailable.

🛠️ Tech Stack
Frontend
React
Vite
Axios
Tailwind CSS
JavaScript
Responsive UI
SVG-based score visualization
Backend
Python
FastAPI
Pydantic
Uvicorn
PyMuPDF
python-docx
Google GenAI SDK
Testing
Pytest
API integration tests
Parser tests
Schema validation tests
Scoring tests
Heuristic fallback tests
End-to-end workflow testing
Deployment
GitHub
Render
Render Static Site for frontend
Render Web Service for backend
📁 Project Structure
AI-RESUME-ANALYZER/
│
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   └── routes.py
│   │   ├── schemas/
│   │   │   └── analysis.py
│   │   ├── services/
│   │   │   ├── ai_service.py
│   │   │   ├── heuristic_service.py
│   │   │   ├── parser_service.py
│   │   │   └── scoring_service.py
│   │   ├── config.py
│   │   └── main.py
│   │
│   ├── tests/
│   │   ├── test_api.py
│   │   ├── test_heuristic.py
│   │   ├── test_parser.py
│   │   ├── test_schemas.py
│   │   └── test_scoring.py
│   │
│   ├── requirements.txt
│   └── run.py
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
└── README.md

🔐 Security

Security was considered throughout the application.

API Key Protection

The Gemini API key is stored only in the backend environment configuration.

backend/.env


The .env file is excluded from Git using .gitignore.

The frontend never receives or stores the Gemini API key.

Resume Processing

Uploaded documents are processed in memory.

The application does not permanently store uploaded resumes or job descriptions.

File Validation

Uploaded files are checked using multiple validation layers:

Supported extension
MIME type
File signature / magic bytes
Maximum file size
Empty file detection
Minimum extracted text length
Corrupt document handling

The current maximum upload size is 5 MB.

🌐 API
Health Check
GET /api/health


Example response:

{
  "status": "ok",
  "version": "1.0.0",
  "service": "AI Resume Analyzer API"
}

Resume Analysis
POST /api/analyze


Multipart form data:

file
job_description


The API returns a validated structured analysis response containing the score breakdown, skills, feedback, recommendations, summary, and analysis source.

💻 Local Development
1. Clone the repository
git clone https://github.com/Aarav-kumar-27/AI-RESUME-ANALYZER.git
cd AI-RESUME-ANALYZER

2. Backend Setup
cd backend


Create a virtual environment:

python -m venv venv


Activate it on Windows:

venv\Scripts\activate


Install dependencies:

pip install -r requirements.txt


Create:

backend/.env


Add:

GEMINI_API_KEY=your_gemini_api_key


Start the backend:

python run.py


The backend will be available at:

http://127.0.0.1:8000


API documentation:

http://127.0.0.1:8000/docs

3. Frontend Setup

Open another terminal:

cd frontend


Install dependencies:

npm install


Create:

frontend/.env


Add:

VITE_API_BASE_URL=http://localhost:8000/api


Start the frontend:

npm run dev


The frontend will normally be available at:

http://localhost:5173

🧪 Running Tests

From the backend directory:

pytest -v


The project includes tests covering:

Resume parsing
PDF/DOCX handling
Invalid files
Pydantic schemas
Deterministic scoring
Heuristic analysis
API endpoints
📊 Verification

The application has been tested across the complete workflow:

✅ PDF resume upload
✅ DOCX resume upload
✅ Resume text extraction
✅ Job description validation
✅ Gemini structured analysis
✅ Pydantic validation
✅ Deterministic score calculation
✅ Heuristic fallback
✅ Frontend/backend integration
✅ CORS configuration
✅ Dark/light mode
✅ Responsive layouts
✅ File validation
✅ Production frontend build
✅ Render deployment
🎨 Dashboard

The results dashboard provides:

Overall match score
Animated score gauge
Category score breakdown
Matching skills
Missing skills
Resume strengths
Improvement areas
Actionable recommendations
AI/heuristic analysis source indicator
🚀 Deployment

The project is deployed using Render.

Frontend
Render Static Site

Backend
Render Web Service


The frontend communicates with the deployed FastAPI backend through the configured:

VITE_API_BASE_URL


The Gemini API key remains configured exclusively on the backend.

⚠️ Free Hosting

The application currently uses Render's free compute tier.

Free backend instances may spin down after inactivity, which can cause the first request after a period of inactivity to take longer.

👨‍💻 Author

Aarav Kumar

AI Resume Analyzer — an end-to-end AI-powered resume evaluation platform built with React, FastAPI, Python, and Google Gemini.

📄 License

This project is intended for educational, portfolio, and demonstration purposes.
