import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/career", async (req, res) => {
  const career = req.body.career;

  if (!career) {
    return res.status(400).json({ error: "Career is required" });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: `Give detailed career guidance for ${career}`,
          },
        ],
      }),
    });

    const data = await response.json();

    const guidance =
      data.choices?.[0]?.message?.content || "No guidance generated";

    res.json({ career, guidance });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "API error" });
  }
});

app.listen(8080, () => console.log("Server running"));
