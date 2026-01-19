import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Test route (check server running)
app.get("/", (req, res) => {
  res.send("Career AI Backend is running 🚀");
});

// Career AI route
app.post("/career", async (req, res) => {
  try {
    const { career } = req.body;

    if (!career) {
      return res.status(400).json({ error: "Career field is required" });
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are a professional career guidance expert."
          },
          {
            role: "user",
            content: `Give step by step guidance to become a ${career}`
          }
        ]
      })
    });

    const data = await response.json();

    if (!data.choices) {
      return res.status(500).json({
        error: "OpenAI API failed",
        details: data
      });
    }

    res.json({
      career,
      guidance: data.choices[0].message.content
    });

  } catch (error) {
    res.status(500).json({
      error: "Server error",
      message: error.message
    });
  }
});

// IMPORTANT: Railway port
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
