import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 10000;

app.use(express.json({ limit: "1mb" }));

const commands = [
  "pwd", "ls", "cd", "clear", "whoami", "date", "history",
  "mkdir", "touch", "cat", "nano", "cp", "mv", "rm",
  "chmod", "chown", "sudo", "apt", "pkg", "git",
  "curl", "wget", "ping", "ifconfig/ip addr", "ssh",
  "ps", "top", "kill", "df", "du", "free", "uname",
  "grep", "find", "tar", "zip/unzip", "bash script"
];

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Linux 90 Days - Roman Telugu Voiceover Generator</title>
  <style>
    * { box-sizing: border-box; }
    :root {
      --bg: #070b12;
      --panel: #101827;
      --panel2: #0c1320;
      --text: #f3f7ff;
      --muted: #aebbd0;
      --line: #263348;
      --brand: #40a6ff;
      --brand2: #7c5cff;
      --warn: #ffcf5a;
      --ok: #5cff9d;
      --danger: #ff6b6b;
    }
    body {
      margin: 0;
      font-family: Arial, sans-serif;
      background:
        radial-gradient(circle at top left, rgba(64,166,255,.18), transparent 32%),
        radial-gradient(circle at top right, rgba(124,92,255,.14), transparent 30%),
        var(--bg);
      color: var(--text);
    }
    .app {
      width: min(1100px, 94%);
      margin: auto;
      padding: 24px 0 54px;
    }
    .hero {
      text-align: center;
      padding: 20px 0 10px;
    }
    .badge {
      display: inline-block;
      background: rgba(64,166,255,.14);
      border: 1px solid rgba(64,166,255,.38);
      padding: 8px 12px;
      border-radius: 999px;
      color: #a9d9ff;
      font-weight: 700;
      font-size: 14px;
    }
    h1 {
      margin: 14px 0 8px;
      font-size: clamp(30px, 7vw, 56px);
      letter-spacing: -1px;
    }
    .sub {
      color: var(--muted);
      max-width: 790px;
      margin: auto;
      line-height: 1.6;
      font-size: 16px;
    }
    .grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 18px;
      margin-top: 18px;
    }
    @media (min-width: 900px) {
      .grid {
        grid-template-columns: 410px 1fr;
        align-items: start;
      }
    }
    .card, .output-card, .mini-card {
      background: rgba(16,24,39,.94);
      border: 1px solid var(--line);
      border-radius: 20px;
      padding: 18px;
      box-shadow: 0 18px 55px rgba(0,0,0,.34);
    }
    .mini-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0,1fr));
      gap: 10px;
      margin: 14px 0 0;
    }
    .mini-card {
      box-shadow: none;
      padding: 13px;
      border-radius: 14px;
      background: rgba(12,19,32,.86);
    }
    .mini-card b {
      display: block;
      margin-bottom: 5px;
      color: #ffffff;
    }
    .mini-card span {
      color: var(--muted);
      font-size: 13px;
      line-height: 1.45;
    }
    label {
      display: block;
      margin: 14px 0 7px;
      color: #d4def0;
      font-weight: 800;
      font-size: 14px;
    }
    input, select, textarea {
      width: 100%;
      padding: 13px 14px;
      border: 1px solid #35455d;
      border-radius: 12px;
      background: var(--panel2);
      color: #ffffff;
      font-size: 15px;
      outline: none;
    }
    textarea {
      min-height: 78px;
      resize: vertical;
      line-height: 1.45;
    }
    input:focus, select:focus, textarea:focus {
      border-color: var(--brand);
      box-shadow: 0 0 0 3px rgba(64,166,255,.12);
    }
    button {
      border: 0;
      padding: 13px 16px;
      border-radius: 12px;
      font-weight: 900;
      font-size: 15px;
      cursor: pointer;
    }
    .primary {
      width: 100%;
      margin-top: 16px;
      background: linear-gradient(135deg, var(--brand), var(--brand2));
      color: #06111f;
    }
    .secondary {
      background: #1b2638;
      color: #dceaff;
      border: 1px solid #33425a;
    }
    .note {
      border-left: 4px solid var(--warn);
      background: rgba(255,207,90,.08);
      padding: 12px;
      border-radius: 12px;
      color: #ffe8a3;
      line-height: 1.5;
      font-size: 14px;
      margin-top: 14px;
    }
    .output-head {
      display: flex;
      justify-content: space-between;
      gap: 10px;
      align-items: center;
      margin-bottom: 10px;
    }
    .output-head h2 {
      margin: 0;
      font-size: 22px;
    }
    pre {
      white-space: pre-wrap;
      word-wrap: break-word;
      line-height: 1.55;
      color: #e9f1ff;
      background: #050912;
      padding: 16px;
      border-radius: 14px;
      border: 1px solid #202d40;
      min-height: 420px;
      overflow-x: auto;
      font-size: 14px;
    }
    .pill-row {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 12px;
    }
    .pill {
      border: 1px solid #30425d;
      background: #111c2e;
      color: #d7e7ff;
      border-radius: 999px;
      padding: 8px 10px;
      font-size: 13px;
      cursor: pointer;
      user-select: none;
    }
    .pill:hover {
      border-color: var(--brand);
    }
    .status {
      color: var(--muted);
      font-size: 13px;
      margin-top: 10px;
      line-height: 1.45;
    }
    code {
      color: #9ed0ff;
    }
  </style>
</head>
<body>
  <main class="app">
    <section class="hero">
      <p class="badge">Linux 90 Days Challenge • Roman Telugu Voiceover</p>
      <h1>Scenario + Voiceover Generator</h1>
      <p class="sub">
        Generate Linux command guides with requirements, use/not-use scenarios, error fixes,
        and a ready-to-paste <b>Roman Telugu voiceover script</b> for ElevenLabs, CapCut, or any TTS tool.
      </p>
    </section>

    <div class="mini-grid">
      <div class="mini-card">
        <b>Roman Telugu voiceover</b>
        <span>Telugu speaking style written in English letters, like “Ee roju manam pwd command nerchukundam.”</span>
      </div>
      <div class="mini-card">
        <b>Commands stay English</b>
        <span>Linux commands like <code>pwd</code>, <code>ls</code>, <code>git</code> remain exact.</span>
      </div>
      <div class="mini-card">
        <b>Scenario guide</b>
        <span>When to use, when not to use, requirements, safe examples.</span>
      </div>
      <div class="mini-card">
        <b>Video-ready</b>
        <span>Hook, voiceover, timeline, caption, and hashtags.</span>
      </div>
    </div>

    <section class="grid">
      <section class="card">
        <label>Day number</label>
        <input id="day" placeholder="Example: 1" value="1" />

        <label>Linux command or topic</label>
        <input id="command" placeholder="Example: pwd, ls, curl, chmod, git" value="pwd" />

        <div class="pill-row" id="pillRow"></div>

        <label>Environment</label>
        <select id="environment">
          <option>Termux on Android</option>
          <option>Ubuntu/Debian Linux</option>
          <option>Both Termux and Ubuntu/Debian</option>
        </select>

        <label>Voiceover language</label>
        <select id="voiceLanguage">
          <option>Roman Telugu only</option>
          <option>Roman Telugu + simple English tech words</option>
          <option>Simple English only</option>
        </select>

        <label>Output type</label>
        <select id="outputType">
          <option>Full Guide + Roman Telugu Voiceover</option>
          <option>Only Roman Telugu Voiceover</option>
          <option>Only Scenario Guide</option>
          <option>Only Errors and Fixes</option>
        </select>

        <label>Video length</label>
        <select id="videoLength">
          <option>30 seconds</option>
          <option>35 seconds</option>
          <option>45 seconds</option>
          <option>60 seconds</option>
        </select>

        <label>Voice style</label>
        <select id="voiceStyle">
          <option>Friendly teacher</option>
          <option>Motivational tech creator</option>
          <option>Calm tutorial style</option>
          <option>Fast Instagram Reel style</option>
        </select>

        <label>Extra instruction</label>
        <textarea id="extra" placeholder="Example: Make it easy for beginners. Add common Termux error."></textarea>

        <button class="primary" id="generateBtn">Generate Roman Telugu Voiceover</button>

        <div class="note">
          <b>Important:</b> Voiceover will be in Roman Telugu, but commands will stay exact.
          Example: <code>pwd</code> will not be translated.
        </div>

        <p class="status">
          Add <b>NVIDIA_API_KEY</b> in Render Environment. Optional: <b>NIM_MODEL</b>.
        </p>
      </section>

      <section class="output-card">
        <div class="output-head">
          <h2>Generated Output</h2>
          <button class="secondary" id="copyBtn">Copy</button>
        </div>
        <pre id="output">Your Roman Telugu voiceover and Linux scenario guide will appear here.</pre>
      </section>
    </section>
  </main>

  <script>
    const commands = ${JSON.stringify(commands)};
    const $ = (id) => document.getElementById(id);

    const pillRow = $("pillRow");
    commands.slice(0, 18).forEach((cmd) => {
      const el = document.createElement("span");
      el.className = "pill";
      el.textContent = cmd;
      el.addEventListener("click", () => {
        $("command").value = cmd;
      });
      pillRow.appendChild(el);
    });

    $("generateBtn").addEventListener("click", async () => {
      const payload = {
        day: $("day").value.trim(),
        command: $("command").value.trim(),
        environment: $("environment").value,
        voiceLanguage: $("voiceLanguage").value,
        outputType: $("outputType").value,
        videoLength: $("videoLength").value,
        voiceStyle: $("voiceStyle").value,
        extra: $("extra").value.trim()
      };

      $("output").textContent = "Generating Roman Telugu voiceover... Please wait.";

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
      await navigator.clipboard.writeText($("output").textContent);
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
  res.json({
    ok: true,
    app: "Linux 90 Days Roman Telugu Voiceover Generator",
    version: "3.0.0"
  });
});

app.post("/api/generate", async (req, res) => {
  try {
    const { day, command, environment, voiceLanguage, outputType, videoLength, voiceStyle, extra } = req.body;

    if (!process.env.NVIDIA_API_KEY) {
      return res.status(500).json({
        error: "NVIDIA_API_KEY is missing.",
        details: "Open Render > your Web Service > Environment > Add NVIDIA_API_KEY. Then redeploy."
      });
    }

    if (!day || !command) {
      return res.status(400).json({
        error: "Day number and Linux command/topic are required."
      });
    }

    const model = process.env.NIM_MODEL || "meta/llama-3.1-8b-instruct";

    const prompt = `
You are a Linux teacher, safety-aware beginner mentor, and short-form content script writer.

Create content for a "90 Days Linux Basics Challenge".

VERY IMPORTANT LANGUAGE RULE:
- The VOICEOVER SCRIPT must be in Roman Telugu.
- Roman Telugu means Telugu words written using English letters.
- Do NOT use Telugu script.
- Linux commands, package names, flags, file paths, and error messages must remain in English exactly.
- Example voice style:
  "Day ${day} of 90 Days Linux Challenge. Ee roju manam ${command} command gurinchi nerchukundam. Idi beginner ki chala important command."
- Use natural spoken Telugu, simple and clear.
- Use common tech words in English when natural: command, terminal, folder, file, install, error, fix, output.

Inputs:
Day: ${day}
Linux command/topic: ${command}
Environment: ${environment || "Termux on Android"}
Voiceover language: ${voiceLanguage || "Roman Telugu only"}
Output type: ${outputType || "Full Guide + Roman Telugu Voiceover"}
Video length: ${videoLength || "35 seconds"}
Voice style: ${voiceStyle || "Friendly teacher"}
Extra instruction: ${extra || "No extra instruction"}

Output structure:

1. TITLE
- Short title in English.

2. COMMAND MEANING
- Explain in simple English.
- Mention whether package installation is needed.

3. REQUIREMENTS BEFORE RUNNING
- Show requirement check commands.
- Include Termux commands when relevant.
- Include Ubuntu/Debian commands when relevant.
- If no installation is needed, say "No extra package required."

4. WHEN TO USE THIS COMMAND
- Give 3 to 5 real beginner scenarios.

5. WHEN NOT TO USE THIS COMMAND
- Give 3 to 5 warnings.
- Include beginner mistakes and safety.

6. SAFE COMMAND EXAMPLES
- Give safe commands only.
- For risky commands like rm, chmod, chown, sudo, kill, mv overwrite, use a demo folder only.

7. COMMON ERRORS AND FIXES
- Include error message.
- Reason.
- Fix command.

8. ROMAN TELUGU VOICEOVER SCRIPT
- This section must be Roman Telugu only, except Linux commands.
- Make it natural for ${videoLength || "35 seconds"}.
- Add pause marks like [pause], [short pause].
- Use motivational ending.
- Do not use Telugu script.
- Do not make it too formal.
- Make it sound like a normal tech creator speaking.

9. SCREEN RECORDING TIMELINE
- Give second-by-second timeline in English.
- Include terminal actions and caption text.

10. INSTAGRAM CAPTION
- Caption can be Roman Telugu + English hashtags.
- Keep it short.

11. HASHTAGS
- Give 10 to 18 relevant hashtags.

12. SAFETY NOTE
- One clear beginner safety note in simple English.

Rules:
- Beginner-friendly.
- No dangerous commands without safe demo folder.
- Keep commands exact.
- Roman Telugu voiceover must be easy to paste into ElevenLabs/CapCut TTS.
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
            content: "You create safe beginner Linux learning guides and Roman Telugu no-face video voiceover scripts."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 1900,
        temperature: 0.55
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
  console.log(`Roman Telugu voiceover app running on port ${PORT}`);
});
