# AI Quiz Builder ⚡

An AI-powered multiple-choice quiz generator built with **React**, **Express**, and **Google Gemini**. Enter any topic, generate 5 AI-created multiple-choice questions, answer them, and receive your score with detailed explanations.

---

# Architecture

```text
Browser (React on :3000)
        │
        ├── GET Wikipedia /api/rest_v1/page/summary/{topic}
        │        (Direct request - CORS safe)
        │
        └── POST /api/generate
                    │
                    ▼
          Express Server (:5000)
                    │
                    ▼
           Google Gemini API
          (API key stays server-side)
```

The React application never communicates directly with the Gemini API. Instead, requests are sent to an Express backend, which securely stores the API key, generates quizzes using Gemini, and returns structured JSON to the frontend.

---

# Getting Started

## 1. Clone the repository

```bash
git clone <repository-url>
cd quiz-app
```

## 2. Install dependencies

```bash
npm install
```

## 3. Create the environment file

Copy the example file:

```bash
cp .env.example .env
```

Edit `.env` and add your Google Gemini API key.

```env
GEMINI_API_KEY=YOUR_GEMINI_API_KEY
SERVER_PORT=5000
```

You can get a free API key from:

https://aistudio.google.com/app/apikey

---

## 4. Run the application

```bash
npm run dev
```

This starts:

* React application → http://localhost:3000
* Express API server → http://localhost:5000

Or run them separately:

```bash
npm run server
```

```bash
npm start
```

---

# Project Structure

```text
quiz-app/
│
├── server.js
├── package.json
├── .env.example
├── public/
├── src/
│   ├── components/
│   │   ├── QuestionCard.jsx
│   │   └── ResultPanel.jsx
│   │
│   ├── pages/
│   │   ├── Home.jsx
│   │   └── Quiz.jsx
│   │
│   ├── utils/
│   │   ├── api.js
│   │   └── storage.js
│   │
│   ├── App.jsx
│   └── index.js
│
└── README.md
```

---

# Features

* AI-generated quizzes using Google Gemini
* Five multiple-choice questions per quiz
* Automatic Wikipedia context fetching for improved factual accuracy
* Four answer choices (A–D)
* Educational explanations for every answer
* Progress indicator while taking quizzes
* Final score with percentage and performance label
* Review mode showing correct and incorrect answers
* Retry the same topic instantly
* Quiz history stored in localStorage
* Responsive design for desktop and mobile
* Secure backend API (API key never exposed to the browser)

---

# Technologies Used

## Frontend

* React
* React Router
* CSS

## Backend

* Node.js
* Express.js
* Google Gemini API
* dotenv
* cors

## External APIs

* Google Gemini API
* Wikipedia REST API

---

# API Endpoints

## Health Check

```
GET /api/health
```

Response

```json
{
  "status": "ok"
}
```

---

## Generate Quiz

```
POST /api/generate
```

Request

```json
{
  "topic": "Photosynthesis",
  "wikiContext": "Wikipedia summary..."
}
```

Response

```json
{
  "topic": "Photosynthesis",
  "questions": [
    {
      "id": 1,
      "question": "...",
      "options": {
        "A": "...",
        "B": "...",
        "C": "...",
        "D": "..."
      },
      "answer": "B",
      "explanation": "..."
    }
  ]
}
```

---

# Environment Variables

Create a `.env` file.

```env
GEMINI_API_KEY=YOUR_GEMINI_API_KEY
SERVER_PORT=5000
```

---

# Technical Decisions

### Express Backend

The backend protects the Gemini API key by handling all AI requests server-side.

### Wikipedia Integration

The application fetches a summary from Wikipedia before generating questions. This context is provided to Gemini to improve factual accuracy and reduce hallucinations.

### Local Storage

Quiz history is stored in the browser using localStorage, allowing users to review recent quizzes without requiring a database.

### CRA Proxy

The `proxy` setting in `package.json` forwards `/api/*` requests from React to the Express backend during development, eliminating CORS issues.

---
#The AI tool(s) selected for reasoning
1)Chatgpt
2)Google Ai Studio
3)Claude

# Future Improvements

* User authentication
* Difficulty levels
* Timer mode
* Leaderboard
* PDF export
* Dark mode
* Voice-enabled quizzes
* Multi-language support
* Database integration (MongoDB/Firebase/Supabase)
* Analytics dashboard


HomePage:
<img width="1908" height="900" alt="Screenshot 2026-06-29 151734" src="https://github.com/user-attachments/assets/5ca80a17-72cd-44af-ba2f-fd79369b55d5" />

 5 MCQ'S
<img width="1907" height="905" alt="Screenshot 2026-06-29 151632" src="https://github.com/user-attachments/assets/b31c275b-18f3-48d3-aacc-a2f6d9c3bff3" />

Score with answers

<img width="1907" height="902" alt="Screenshot 2026-06-29 151651" src="https://github.com/user-attachments/assets/2547a5b6-b8a4-4895-8ab4-368c770eac66" />

Feedback for each correct and wrong answer

<img width="1912" height="907" alt="Screenshot 2026-06-29 151714" src="https://github.com/user-attachments/assets/287b8566-c049-40f2-9d0a-111edf96d61e" />

Past quizzes history

<img width="1911" height="887" alt="Screenshot 2026-06-29 151746" src="https://github.com/user-attachments/assets/1bf44bbb-8b14-4f87-9e42-2d7cc18cb15e" />

