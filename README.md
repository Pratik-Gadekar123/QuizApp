# AI Quiz Builder ⚡

An AI-powered multiple-choice quiz generator. Enter any topic, get 5 factual questions, answer them, and see your score with explanations.

---

## Architecture

```
Browser (React on :3000)
        │
        ├── GET  Wikipedia /api/rest_v1/page/summary/{topic}   ← direct (CORS-safe)
        │
        └── POST /api/generate  ──→  Express server (:5000)
                                          │
                                          └── POST api.anthropic.com/v1/messages
                                               (API key stays server-side only)
```

The key architectural decision: **React never calls Anthropic directly** (browsers get blocked by CORS). Instead, a thin Express proxy receives the request, injects the API key server-side, calls Anthropic, and returns the parsed quiz.

---

## Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Set your API key
```bash
cp .env.example .env
# Edit .env and paste your Anthropic key:
# ANTHROPIC_API_KEY=sk-ant-...
```
Get a key at [console.anthropic.com](https://console.anthropic.com)

### 3. Run both servers together
```bash
npm run dev
```
This starts:
- Express proxy server on **http://localhost:5000**
- React app on **http://localhost:3000**

Or run them separately:
```bash
npm run server   # terminal 1 — Express proxy
npm start        # terminal 2 — React app
```

---

## Project Structure

```
quiz-app/
├── server.js              ← Express proxy (calls Anthropic server-side)
├── .env.example           ← Copy to .env, add your API key
├── package.json           ← "proxy": "http://localhost:5000" wires CRA → Express
└── src/
    ├── pages/
    │   ├── Home.jsx       ← Topic input, suggested chips, quiz history
    │   └── Quiz.jsx       ← Loading → answering → result state machine
    ├── components/
    │   ├── QuestionCard.jsx   ← Single question card (used while answering + in review)
    │   └── ResultPanel.jsx    ← Score card + full answer review
    └── utils/
        ├── api.js         ← fetchWikiContext (Wikipedia) + generateQuiz (→ proxy)
        └── storage.js     ← localStorage: save/get/clear quiz history (last 20)
```

---

## Features

| Feature | Detail |
|---|---|
| Topic input + 12 suggested chips | Home page |
| Wikipedia context injection | Fetched before every quiz for factual grounding |
| 5 AI-generated MCQs | Via Claude Sonnet, structured JSON output |
| 4 options (A–D) per question | Plausible distractors, varied correct-answer position |
| Progress bar while answering | Shows X/5 answered |
| Score display | e.g. 4/5 · 80% · grade label |
| Answer review | Correct = green ✓, wrong = red ✗, skipped = neutral |
| Explanations per question | 2-sentence educational explanation |
| Retry same topic | Re-fetches Wikipedia + regenerates questions |
| Quiz history | Persisted in localStorage, last 20 results, color-coded badges |
| Responsive | Works on mobile |

---

## Technical Decisions

**Why Express proxy?** Browsers enforce CORS — `api.anthropic.com` blocks requests from `localhost:3000`. The proxy runs server-side where CORS doesn't apply. As a bonus, the API key never reaches the client.

**Why CRA proxy field?** `"proxy": "http://localhost:5000"` in `package.json` makes CRA forward any unrecognized request (like `/api/generate`) to Express in development — no hardcoded URLs in frontend code.

**Why Wikipedia?** Free, no API key needed, CORS-safe from the browser. The summary endpoint returns clean plain text. Injected into the Claude prompt as a grounding context block to reduce hallucinations.

**Why localStorage?** Zero backend dependency for the MVP. A production version would use a DB (e.g. Supabase) for cross-device sync.


