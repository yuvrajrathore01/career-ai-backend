import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

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
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are a career guidance expert.",
          },
          {
            role: "user",
            content: `Give detailed career guidance for becoming a ${career}`,
          },
        ],
      }),
    });

    const data = await response.json();

    const guidance =
      data?.choices?.[0]?.message?.content || "No guidance generated";

    res.json({
      career,
      guidance,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "OpenAI API failed" });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
