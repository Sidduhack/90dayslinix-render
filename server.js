import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 10000;

app.use(express.json({ limit: "1mb" }));

const commands = ["pwd","ls","cd","clear","whoami","date","history","mkdir","touch","cat","nano","cp","mv","rm","chmod","chown","sudo","apt","pkg","git","curl","wget","ping","ssh","ps","top","kill","df","du","free","uname","grep","find","tar","zip/unzip","bash script"];

const html = `<!DOCTYPE html>
<html lang="te">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Linux 90 Days - Telugu NLP Voiceover</title>
<style>
*{box-sizing:border-box}
body{margin:0;font-family:Arial,"Noto Sans Telugu",sans-serif;background:#070b12;color:#f3f7ff}
.app{width:min(1050px,94%);margin:auto;padding:28px 0 50px}
.hero{text-align:center;margin-bottom:18px}
.badge{display:inline-block;background:#14243a;border:1px solid #2c4869;padding:8px 12px;border-radius:999px;color:#9ed0ff;font-weight:700}
h1{font-size:clamp(30px,7vw,54px);margin:14px 0 8px}
.sub{color:#aebbd0;line-height:1.6;max-width:760px;margin:auto}
.grid{display:grid;grid-template-columns:1fr;gap:18px}
@media(min-width:900px){.grid{grid-template-columns:390px 1fr;align-items:start}}
.card,.output{background:#101827;border:1px solid #263348;border-radius:18px;padding:18px;box-shadow:0 18px 50px rgba(0,0,0,.35)}
label{display:block;margin:14px 0 7px;color:#d4def0;font-weight:800}
input,select,textarea{width:100%;padding:13px 14px;border:1px solid #35455d;border-radius:12px;background:#0c1320;color:white;font-size:15px;font-family:Arial,"Noto Sans Telugu",sans-serif}
textarea{min-height:80px;resize:vertical}
button{border:0;padding:13px 16px;border-radius:12px;font-weight:900;font-size:15px;cursor:pointer}
.primary{width:100%;margin-top:16px;background:linear-gradient(135deg,#40a6ff,#7c5cff);color:#06111f}
.secondary{background:#1b2638;color:#dceaff;border:1px solid #33425a}
pre{white-space:pre-wrap;word-wrap:break-word;line-height:1.75;color:#e9f1ff;background:#050912;padding:16px;border-radius:14px;border:1px solid #202d40;min-height:480px;overflow-x:auto;font-size:15px;font-family:Arial,"Noto Sans Telugu",sans-serif}
.pills{display:flex;flex-wrap:wrap;gap:8px;margin-top:12px}
.pill{border:1px solid #30425d;background:#111c2e;color:#d7e7ff;border-radius:999px;padding:8px 10px;font-size:13px;cursor:pointer}
.note{border-left:4px solid #ffcf5a;background:rgba(255,207,90,.08);padding:12px;border-radius:12px;color:#ffe8a3;line-height:1.5;font-size:14px;margin-top:14px}
.head{display:flex;justify-content:space-between;gap:10px;align-items:center;margin-bottom:10px}
.small{color:#aebbd0;font-size:13px;line-height:1.45}
code{color:#9ed0ff}
</style>
</head>
<body>
<main class="app">
<section class="hero">
<p class="badge">Linux 90 Days Challenge • Fixed 13-Section Format</p>
<h1>తెలుగు NLP Voiceover Generator</h1>
<p class="sub">Output మీ sample లాగానే 13 sections లో వస్తుంది. Section 3 voiceover మాత్రమే Telugu script లో, AI voice read చేయడానికి rhythm తో వస్తుంది.</p>
</section>

<section class="grid">
<section class="card">
<label>Day number</label>
<input id="day" value="1" />

<label>Linux command or topic</label>
<input id="command" value="pwd" placeholder="pwd, ls, cd, git, curl..." />

<div class="pills" id="pills"></div>

<label>Environment</label>
<select id="environment">
<option>Termux on Android</option>
<option>Ubuntu/Debian Linux</option>
<option>Both Termux and Ubuntu/Debian</option>
</select>

<label>Output format</label>
<select id="outputFormat">
<option>Exact 13 sections + Telugu voiceover</option>
<option>Only section 3 Telugu voiceover</option>
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
<textarea id="extra" placeholder="Example: Make the voiceover more emotional and beginner friendly."></textarea>

<button class="primary" id="generateBtn">Generate Output</button>

<div class="note"><b>Rule:</b> Headings English లో ఉంటాయి. Section 3 voiceover Telugu script లో ఉంటుంది. Commands exact గా ఉంటాయి: <code>pwd</code>, <code>ls</code>, <code>git</code>.</div>
<p class="small">Render Environment లో <b>NVIDIA_API_KEY</b> add చేయాలి. Optional: <b>NIM_MODEL</b>.</p>
</section>

<section class="output">
<div class="head">
<h2>Generated Output</h2>
<button class="secondary" id="copyBtn">Copy</button>
</div>
<pre id="output">మీ 13-section output ఇక్కడ కనిపిస్తుంది.</pre>
</section>
</section>
</main>

<script>
const commands = ${JSON.stringify(commands)};
const $ = (id)=>document.getElementById(id);
const pills = $("pills");
commands.slice(0,18).forEach(cmd=>{
  const span=document.createElement("span");
  span.className="pill";
  span.textContent=cmd;
  span.onclick=()=>{$("command").value=cmd};
  pills.appendChild(span);
});

$("generateBtn").onclick = async ()=>{
  const payload = {
    day: $("day").value.trim(),
    command: $("command").value.trim(),
    environment: $("environment").value,
    outputFormat: $("outputFormat").value,
    videoLength: $("videoLength").value,
    voiceStyle: $("voiceStyle").value,
    extra: $("extra").value.trim()
  };
  $("output").textContent = "Generating 13-section output with Telugu NLP voiceover... Please wait.";
  try{
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify(payload)
    });
    const data = await response.json();
    if(!response.ok){
      $("output").textContent = "Error:\\n" + (data.error || "Request failed") + "\\n\\n" + (data.details || "");
      return;
    }
    $("output").textContent = data.output;
  }catch(error){
    $("output").textContent = "Error: " + error.message;
  }
};

$("copyBtn").onclick = async ()=>{
  await navigator.clipboard.writeText($("output").textContent);
  $("copyBtn").textContent = "Copied";
  setTimeout(()=>$("copyBtn").textContent="Copy",1200);
};
</script>
</body>
</html>`;

app.get("/", (req, res) => {
  res.type("html").send(html);
});

app.get("/health", (req, res) => {
  res.json({ ok: true, app: "Linux 90 Days Telugu NLP Fixed Format Generator", version: "5.0.0" });
});

app.post("/api/generate", async (req, res) => {
  try {
    const { day, command, environment, outputFormat, videoLength, voiceStyle, extra } = req.body;

    if (!process.env.NVIDIA_API_KEY) {
      return res.status(500).json({
        error: "NVIDIA_API_KEY is missing.",
        details: "Open Render > your Web Service > Environment > Add NVIDIA_API_KEY. Then redeploy."
      });
    }

    if (!day || !command) {
      return res.status(400).json({ error: "Day number and Linux command/topic are required." });
    }

    const model = process.env.NIM_MODEL || "meta/llama-3.1-8b-instruct";

    const prompt = `
You are a Linux teacher, beginner mentor, and short-form content script writer.

Generate output for a "90 Days Linux Basics Challenge".

The user wants the same 13-section output format:

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

CRITICAL RULES:
- Keep section headings in English exactly.
- ONLY section 3 must be Telugu script voiceover.
- Do NOT write section 3 in Roman Telugu.
- Good Telugu script example: "ఈ రోజు మనం pwd command గురించి నేర్చుకుందాం."
- Bad Roman Telugu example: "Ee roju manam pwd command gurinchi nerchukundam."
- Section 3 must be NLP/TTS-friendly: short lines, natural rhythm, pause markers, and clear breathing space.
- Use this style in section 3:
  (Soft background music starts)

  Voiceover: "తెలుగు script sentence..."

  (Pause for 2 seconds)

  Voiceover: "తెలుగు script sentence..."
- Linux commands, package names, flags, file paths, URLs, and error messages must stay in English/code format.
- Do not translate command names.
- Avoid saying "Screen మీద మీరు..." in the voiceover. Focus on terminal actions and explanation.
- End the voiceover with a motivational follow-style CTA, but do not mention any specific next day number.

INPUTS:
Day: ${day}
Command/topic: ${command}
Environment: ${environment || "Termux on Android"}
Output format: ${outputFormat || "Exact 13 sections + Telugu voiceover"}
Video length: ${videoLength || "35 seconds"}
Voice style: ${voiceStyle || "Friendly teacher"}
Extra instruction: ${extra || "No extra instruction"}

SECTION DETAILS:

1. VIDEO TITLE
- One title in quotes.

2. 3 HOOK OPTIONS
- 3 short hooks in English.

3. VOICEOVER SCRIPT WITH PAUSES
- Spoken lines must be Telugu script.
- Use "Voiceover:" before each spoken block.
- Use pauses such as "(Pause for 2 seconds)".
- Keep it natural for ${videoLength || "35 seconds"}.
- Keep Linux commands in English inside quotes/backticks.
- Mention requirement/check/fix if useful.
- Make it AI voice friendly.

4. SCREEN RECORDING PLAN WITH TIMELINE
- Bullet timeline with seconds.

5. REQUIREMENTS
- Mention if no extra package required.

6. TERMUX INSTALL COMMANDS
- If none, say "None required."

7. UBUNTU/DEBIAN INSTALL COMMANDS
- If none, say "None required."

8. MAIN COMMAND EXAMPLES
- 3 to 6 safe examples.

9. COMMON ERRORS AND FIXES
- Use realistic errors for this command only.
- Do not invent impossible errors.
- Format: "Error" - reason - fix.

10. PRACTICE TASK
- 2 safe beginner tasks.

11. INSTAGRAM CAPTION
- Short caption. Telugu script is allowed.

12. HASHTAGS
- 8 to 16 hashtags.

13. SAFETY NOTE
- Clear beginner warning.
- For risky commands like rm, chmod, chown, sudo, kill, use safe demo folder only.

Return only the 13-section output. No extra introduction.
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
            content: "Generate fixed-format Linux video plans. Section 3 voiceover must be Telugu script, not Roman Telugu. Keep commands in English."
          },
          { role: "user", content: prompt }
        ],
        max_tokens: 1900,
        temperature: 0.4
      })
    });

    if (!response.ok) {
      const text = await response.text();
      return res.status(response.status).json({ error: "NVIDIA API request failed.", details: text });
    }

    const data = await response.json();
    const output = data?.choices?.[0]?.message?.content || "No response generated.";
    res.json({ output, model });
  } catch (error) {
    res.status(500).json({ error: "Server error.", details: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Telugu NLP fixed-format app running on port ${PORT}`);
});
