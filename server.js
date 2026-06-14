import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 10000;

app.use(express.json({ limit: "1mb" }));

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Linux 90 Days AI Script Generator</title>
  <style>
    * { box-sizing: border-box; }
    body {
      margin: 0;
      font-family: Arial, sans-serif;
      background: #080b12;
      color: #f4f7fb;
    }
    .app {
      width: min(960px, 94%);
      margin: auto;
      padding: 28px 0 50px;
    }
    .hero {
      text-align: center;
      margin-bottom: 22px;
    }
    .badge {
      display: inline-block;
      background: #18263d;
      border: 1px solid #294263;
      padding: 8px 12px;
      border-radius: 999px;
      font-size: 14px;
      color: #9ed0ff;
    }
    h1 {
      font-size: clamp(32px, 7vw, 58px);
      margin: 14px 0 8px;
    }
    .sub {
      color: #b8c5d8;
      max-width: 700px;
      margin: auto;
      line-height: 1.6;
    }
    .card, .output-card {
      background: #101724;
      border: 1px solid #263244;
      border-radius: 20px;
      padding: 20px;
      margin-top: 18px;
      box-shadow: 0 18px 50px rgba(0,0,0,0.35);
    }
    label {
      display: block;
      margin: 14px 0 7px;
      color: #c9d6e8;
      font-weight: 700;
    }
    input, select {
      width: 100%;
      padding: 13px 14px;
      border: 1px solid #35455d;
      border-radius: 12px;
      background: #0b111b;
      color: #ffffff;
      font-size: 16px;
    }
    button {
      border: 0;
      background: #41a6ff;
      color: #06111f;
      padding: 13px 17px;
      border-radius: 12px;
      font-weight: 800;
      font-size: 16px;
      cursor: pointer;
    }
    #generateBtn {
      width: 100%;
      margin-top: 20px;
    }
    .output-head {
      display: flex;
      justify-content: space-between;
      gap: 12px;
      align-items: center;
    }
    pre {
      white-space: pre-wrap;
      word-wrap: break-word;
      line-height: 1.55;
      color: #e9f1ff;
      background: #070b12;
      padding: 16px;
      border-radius: 14px;
      border: 1px solid #202d40;
      min-height: 220px;
      overflow-x: auto;
    }
    .small {
      color: #9fb1c8;
      font-size: 14px;
      line-height: 1.5;
    }
  </style>
</head>
<body>
  <main class="app">
    <section class="hero">
      <p class="badge">90 Days Linux Challenge</p>
      <h1>AI Video Script Generator</h1>
      <p class="sub">
        Make no-face Instagram Reel and YouTube Shorts scripts with command,
        requirements, install steps, errors, fixes, captions, hashtags, and practice tasks.
      </p>
    </section>

    <section class="card">
      <label>Day number</label>
      <input id="day" placeholder="Example: 1" value="1" />

      <label>Linux command or topic</label>
      <input id="command" placeholder="Example: pwd, ls, git, curl" value="pwd" />

      <label>Platform</label>
      <select id="platform">
        <option>Instagram Reels</option>
        <option>YouTube Shorts</option>
        <option>Facebook Reels</option>
      </select>

      <label>Language style</label>
      <select id="language">
        <option>Simple English</option>
        <option>English + Telugu friendly explanation</option>
        <option>Motivational English</option>
      </select>

      <label>Video length</label>
      <select id="videoLength">
        <option>30 seconds</option>
        <option>35 seconds</option>
        <option>45 seconds</option>
        <option>60 seconds</option>
      </select>

      <label>Audience</label>
      <input id="audience" value="Absolute beginners using Termux on Android" />

      <button id="generateBtn">Generate Video Plan</button>
      <p class="small">
        Your NVIDIA API key must be added in Render Environment as NVIDIA_API_KEY.
      </p>
    </section>

    <section class="output-card">
      <div class="output-head">
        <h2>Generated Script</h2>
        <button id="copyBtn">Copy</button>
      </div>
      <pre id="output">Your result will appear here.</pre>
    </section>
  </main>

  <script>
    const $ = (id) => document.getElementById(id);

    $("generateBtn").addEventListener("click", async () => {
      const payload = {
        day: $("day").value.trim(),
        command: $("command").value.trim(),
        platform: $("platform").value,
        language: $("language").value,
        videoLength: $("videoLength").value,
        audience: $("audience").value.trim()
      };

      $("output").textContent = "Generating... Please wait.";

      try {
        const response = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (!response.ok) {
          $("output").textContent = "Error:\\n" + (data.error || "Request failed") + "\\n\\n" + (data.details || "");
          return;
        }

        $("output").textContent = data.output;
      } catch (error) {
        $("output").textContent = "Error: " + error.message;
      }
    });

    $("copyBtn").addEventListener("click", async () => {
      const text = $("output").textContent;
      await navigator.clipboard.writeText(text);
      $("copyBtn").textContent = "Copied";
      setTimeout(() => $("copyBtn").textContent = "Copy", 1200);
    });
  </script>
</body>
</html>`;

app.get("/", (req, res) => {
  res.type("html").send(html);
});

app.get("/health", (req, res) => {
  res.json({ ok: true, app: "Linux 90 Days AI Script Generator" });
});

app.post("/api/generate", async (req, res) => {
  try {
    const { day, command, platform, language, videoLength, audience } = req.body;

    if (!process.env.NVIDIA_API_KEY) {
      return res.status(500).json({
        error: "NVIDIA_API_KEY is missing.",
        details: "Open Render > your Web Service > Environment > Add NVIDIA_API_KEY."
      });
    }

    if (!day || !command) {
      return res.status(400).json({
        error: "Day and Linux command/topic are required."
      });
    }

    const model = process.env.NIM_MODEL || "meta/llama-3.1-8b-instruct";

    const prompt = `
You are a Linux teacher and short-form content script writer.

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
            content: "You create beginner-friendly Linux learning content for no-face short videos."
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
    res.status(500).json({
      error: "Server error.",
      details: error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
});
      
