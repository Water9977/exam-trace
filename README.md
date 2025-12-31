# Exam Trace 🚀

**An AI-powered exam analysis and prediction engine.**

Exam Trace helps students reverse-engineer their exams by analyzing syllabus documents and past papers to predict high-probability topics for upcoming tests.

## ✨ Features

- **Premium 3D Interface**: Built with a "dark glassmorphism" aesthetic, featuring fluid animations and interactive 3D upload cards.
- **Intelligent Analysis**: Uses **Google Gemini 1.5 Pro** to parse complex PDF syllabus documents and past exam papers.
- **Prediction Engine**: Generates a probability matrix for topics, highlighting "High Yield" areas to focus on.
- **Strategy Dashboard**: Visualizes frequency trends and topic weightage.

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React, Tailwind CSS, Framer Motion
- **Backend**: Python, FastAPI
- **AI**: Google Generative AI (Gemini 1.5 Pro)
- **State Management**: Zustand

## 🚀 How to Run Locally

### Prerequisites
- Node.js (v18+)
- Python (v3.10+)
- A Google Gemini API Key

### 1. Clone the Repository
```bash
git clone https://github.com/Water9977/exam-trace.git
cd exam-trace
```

### 2. Setup Backend (Python)
```bash
cd backend
# Create virtual environment
python -m venv venv
# Activate it (Windows)
.\venv\Scripts\activate
# Install dependencies
pip install -r requirements.txt
# Run Server
python -m uvicorn main:app --reload
```
*Note: You need to create a `.env` file in the `backend/` folder with `GEMINI_API_KEY=your_key_here`*

### 3. Setup Frontend (Next.js)
Open a new terminal in the root folder:
```bash
npm install
npm run dev
```

### 4. Open Application
Visit `http://localhost:3000` in your browser.

## 📸 Screenshots
*(Add screenshots of your Dashboard and Upload pages here)*
