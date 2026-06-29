const express = require("express");
const cors = require("cors");
const { GoogleGenAI } = require("@google/genai");
require("dotenv").config();

const app = express();
const PORT = process.env.SERVER_PORT || 5000;

app.use(cors({
  origin: "http://localhost:3000",
}));

app.use(express.json());

// Initialize Gemini
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// Health Check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
  });
});

// Generate Quiz
app.post("/api/generate", async (req, res) => {
  try {
    const { topic, wikiContext } = req.body;

    if (!topic || topic.trim() === "") {
      return res.status(400).json({
        error: "Topic is required",
      });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        error: "GEMINI_API_KEY not found in .env",
      });
    }

    const contextSection = wikiContext
      ? `
Use this Wikipedia excerpt to improve factual accuracy.

${wikiContext}
`
      : "";

    const prompt = `
You are an expert quiz creator.

Generate exactly 5 multiple-choice questions about:

"${topic}"

${contextSection}

Return ONLY valid JSON.

Format:

{
  "topic":"${topic}",
  "questions":[
    {
      "id":1,
      "question":"Question?",
      "options":{
        "A":"Option A",
        "B":"Option B",
        "C":"Option C",
        "D":"Option D"
      },
      "answer":"A",
      "explanation":"Explanation"
    }
  ]
}

Rules:

- Exactly 5 questions
- IDs 1 to 5
- Four options per question
- Only one correct answer
- Educational explanations
- Return ONLY JSON
- No markdown
- No extra text
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    let text = response.text;

    text = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    let quiz;

    try {
      quiz = JSON.parse(text);
    } catch (err) {
      console.log("========== GEMINI RESPONSE ==========");
      console.log(text);
      console.log("=====================================");

      return res.status(500).json({
        error: "Gemini returned invalid JSON.",
      });
    }

    res.json(quiz);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: error.message || "Internal Server Error",
    });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log("=================================");
  console.log(`✅ Quiz API Server running`);
  console.log(`🌐 http://localhost:${PORT}`);
  console.log("=================================");
});