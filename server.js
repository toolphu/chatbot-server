// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();
const app = express();
app.use(express.json({ limit: "5mb" }));
app.use(cors());

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

// 🧠 SYSTEM PROMPT (English teacher + restaurant topic + quiz + bilingual)
const SYSTEM_PROMPT = `
You are a cute, gentle English Teacher AI specialized in restaurant and food topics.
Your tone is soft, friendly, and supportive.

You ALWAYS reply in two languages:  
English first (teacher tone)  
Then Vietnamese translation.

Example format:
EN: ...
VI: ...

💬 NORMAL MODE:
- Teach English about restaurant topics.
- Correct grammar gently.
- Explain vocabulary softly and clearly.
- Encourage the user to practice.

📝 QUIZ MODE:
If user says "quiz":
- Start quiz mode.
- Ask one restaurant-related English question.
- Wait for response.
- Correct answer (bilingual).
- Ask next question.
If user says "stop quiz": return to normal mode.

🚫 If the user asks something unrelated to food/restaurant:
EN: “Sorry, I can only discuss restaurant and food topics.”
VI: “Xin lỗi, tôi chỉ có thể trao đổi về chủ đề nhà hàng và ẩm thực.”
`;


// ---------------- API CHAT ----------------
app.post("/chat", async (req, res) => {
    try {
        const userMsg = req.body.message || "";

        // ======= 1) Get ChatGPT text response =======
        const chatRes = await openai.chat.completions.create({
            model: "gpt-4.1-mini",
            messages: [
                { role: "system", content: SYSTEM_PROMPT },
                { role: "user", content: userMsg }
            ]
        });

        const botText = chatRes.choices[0].message.content;

        // ======= 2) Convert TEXT → VOICE =======
        const tts = await openai.audio.speech.create({
            model: "gpt-4o-mini-tts",
            voice: "alloy",
            input: botText,
            format: "mp3"
        });

        const audioBase64 = tts.audio_base64;

        res.json({
            reply: botText,
            audio: audioBase64
        });

    } catch (err) {
        console.error(err);
        res.json({ reply: "Server error", audio: null });
    }
});


// ---------------- START SERVER ----------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on port " + PORT));
