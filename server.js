
import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 10000;

app.use(express.json({ limit: "1mb" }));
app.use(express.static("public"));

app.get("/health", (req, res) => {
  res.json({ ok: true, app: "Linux 90 Days Video Script Generator" });
});

app.post("/api/generate", async (req, res) => {
  try {
    const { day, command, platform, language, videoLength, audience } = req.body;

    if (!process.env.NVIDIA_API_KEY) {
      return res.status(500).json({
        error: "NVIDIA_API_KEY is missing. Add it in Render Environment Variables."
      });
    }

    if (!command || !day) {
      return res.status(400).json({ error: "Day and command/topic are required." });
    }

    const model = process.env.NIM_MODEL || "meta/llama-3.1-8b-instruct";

    const prompt = `
You are a Linux teacher and Instagram Reel script writer.

Create a no-face short video plan for a 90 Days Linux Basics Challenge.

Inputs:
Day: ${day}
Topic or command: ${command}
Platform: ${platform || "Instagram Reels"}
Language style: ${language || "Simple English"}
Video length: ${videoLength || "35 seconds"}
Audience: ${audience || "Absolute beginners using Termux or Ubuntu"}

Output exactly in this structure:

1. VIDEO TITLE
2. 3 HOOK OPTIONS
3. VOICEOVER SCRIPT WITH PAUSES
4. SCREEN RECORDING PLAN WITH TIMELINE
5. REQUIREMENTS
6. TERMUX INSTALL COMMANDS
7. UBUNTU/DEBIAN INSTALL COMMANDS
8. MAIN COMMAND EXAMPLES
9. COMMON ERRORS AND FIXES
10. PRACTICE TASK
11. INSTAGRAM CAPTION
12. HASHTAGS
13. SAFETY NOTE

Rules:
- Explain like a beginner.
- Include requirement check commands such as command -v when useful.
- Warn about risky commands when needed.
- Keep the voiceover natural and motivational.
- Do not ask the viewer to run dangerous delete commands.
- If the topic has no package requirement, say "No extra package required."
`;

    const response = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.NVIDIA_API_KEY}`,
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: "system",
            content: "You create beginner-friendly Linux learning content for no-face tech videos."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 1400,
        temperature: 0.6
      })
    });

    if (!response.ok) {
      const text = await response.text();
      return res.status(response.status).json({
        error: "NVIDIA API request failed.",
        details: text
      });
    }

    const data = await response.json();
    const output = data?.choices?.[0]?.message?.content || "No response generated.";
    res.json({ output, model });
  } catch (error) {
    res.status(500).json({ error: "Server error.", details: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
});
