import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Career AI Backend is running 🚀");
});

app.post("/career", async (req, res) => {
  const { career } = req.body;

  if (!career) {
    return res.status(400).json({ error: "Career is required" });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: `Give step by step guidance to become ${career}`
          }
        ]
      })
    });

    const data = await response.json();

    res.json({
      career,
      guidance: data.choices?.[0]?.message?.content || "No response"
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "API error" });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
