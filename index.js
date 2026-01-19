import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/career", async (req, res) => {
  try {
    const { career } = req.body;

    if (!career) {
      return res.status(400).json({ error: "Career is required" });
    }

    const response = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "user",
              content: `
Explain career ${career} in Hindi:

1. Career good or not
2. How to prepare
3. Competition
4. Reality
              `
            }
          ]
        })
      }
    );

    const data = await response.json();

    console.log("OpenAI response:", data);

    if (!data.choices) {
      return res.status(500).json({ error: data });
    }

    res.json({
      answer: data.choices[0].message.content
    });

  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ error: error.message });
  }
});

// 🚨 IMPORTANT: Railway PORT
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
