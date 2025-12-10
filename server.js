import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();

app.use(express.json());
app.use(cors());

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

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
          { role: "system", content: "Bạn là chatbot hỗ trợ khách hàng." },
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
