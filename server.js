import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();

app.use(express.json());
app.use(cors());

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

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

`;

app.post("/api/chat", async (req, res) => {
    try {
        const userMessage = req.body.message;

        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${OPENAI_API_KEY}`,
            },
            body: JSON.stringify({
                model: "gpt-4o-mini",
                messages: [
                    { role: "system", content: SYSTEM_PROMPT },
                    { role: "user", content: userMessage }
                ]
            }),
        });

        const data = await response.json();
        res.json({ reply: data.choices[0].message.content });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server lỗi" });
    }
});

app.get("/", (req, res) => {
    res.send("Chatbot API đang chạy!");
});

app.listen(3000, () => console.log("Server running on port 3000"));
