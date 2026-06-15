import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 10000;
app.use(express.json({ limit: "1mb" }));

const commands = ["pwd","ls","cd","mkdir","touch","cat","cp","mv","rm","chmod","chown","git","curl","wget","grep","find","ps","top","kill","df","du","free","uname","tar","zip/unzip","bash script"];

const html = `<!DOCTYPE html>
<html lang="te">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>Deep Linux Command Voiceover</title>
<style>
*{box-sizing:border-box}
body{margin:0;background:#070b12;color:#f3f7ff;font-family:Arial,"Noto Sans Telugu",sans-serif}
main{width:min(1080px,94%);margin:auto;padding:28px 0 50px}
.hero{text-align:center;margin-bottom:20px}
.badge{display:inline-block;background:#14243a;border:1px solid #2c4869;padding:8px 12px;border-radius:999px;color:#9ed0ff;font-weight:700}
h1{font-size:clamp(30px,7vw,54px);margin:14px 0 8px}
.sub{color:#aebbd0;line-height:1.6;max-width:850px;margin:auto}
.grid{display:grid;grid-template-columns:1fr;gap:18px}
@media(min-width:900px){.grid{grid-template-columns:400px 1fr;align-items:start}}
.card,.output{background:#101827;border:1px solid #263348;border-radius:18px;padding:18px;box-shadow:0 18px 50px rgba(0,0,0,.35)}
label{display:block;margin:14px 0 7px;color:#d4def0;font-weight:800}
input,select,textarea{width:100%;padding:13px 14px;border:1px solid #35455d;border-radius:12px;background:#0c1320;color:white;font-size:15px;font-family:Arial,"Noto Sans Telugu",sans-serif}
textarea{min-height:92px;resize:vertical}
button{border:0;padding:13px 16px;border-radius:12px;font-weight:900;font-size:15px;cursor:pointer}
.primary{width:100%;margin-top:16px;background:linear-gradient(135deg,#40a6ff,#7c5cff);color:#06111f}
.secondary{background:#1b2638;color:#dceaff;border:1px solid #33425a}
pre{white-space:pre-wrap;word-wrap:break-word;line-height:1.72;color:#e9f1ff;background:#050912;padding:16px;border-radius:14px;border:1px solid #202d40;min-height:560px;overflow-x:auto;font-size:15px;font-family:Arial,"Noto Sans Telugu",sans-serif}
.pills{display:flex;flex-wrap:wrap;gap:8px;margin-top:12px}
.pill{border:1px solid #30425d;background:#111c2e;color:#d7e7ff;border-radius:999px;padding:8px 10px;font-size:13px;cursor:pointer}
.note{border-left:4px solid #ffcf5a;background:rgba(255,207,90,.08);padding:12px;border-radius:12px;color:#ffe8a3;line-height:1.5;font-size:14px;margin-top:14px}
.head{display:flex;justify-content:space-between;gap:10px;align-items:center;margin-bottom:10px}
.small{color:#aebbd0;font-size:13px;line-height:1.45}
code{color:#9ed0ff}
</style>
</head>
<body>
<main>
<section class="hero">
<p class="badge">Linux Challenge • v8 Deep Command + Voiceover</p>
<h1>Deep Command Explanation + Telugu Voiceover</h1>
<p class="sub">Command ని deeply explain చేస్తుంది. Meaning, syntax, options, output, use cases, mistakes, errors, fixes, safe examples, and Telugu all-in-one voiceover ఇస్తుంది.</p>
</section>

<section class="grid">
<section class="card">
<label>Day number</label>
<input id="day" value="1"/>

<label>Linux command or topic</label>
<input id="command" value="pwd" placeholder="pwd, ls, cd, git, curl..."/>

<div class="pills" id="pills"></div>

<label>Environment</label>
<select id="environment">
<option>Termux on Android</option>
<option>Ubuntu/Debian Linux</option>
<option>Both Termux and Ubuntu/Debian</option>
</select>

<label>Explanation depth</label>
<select id="depth">
<option>Deep beginner explanation</option>
<option>Simple beginner explanation</option>
<option>Very deep practical explanation</option>
<option>Interview-style explanation</option>
</select>

<label>Voiceover length</label>
<select id="voiceLength">
<option>45 seconds</option>
<option>60 seconds</option>
<option>90 seconds</option>
<option>2 minutes</option>
</select>

<label>Voiceover style</label>
<select id="voiceEmotion">
<option>Friendly motivational teacher</option>
<option>Calm deep explainer</option>
<option>Energetic Instagram tech creator</option>
<option>Professional tutorial narrator</option>
</select>

<label>Output mode</label>
<select id="outputMode">
<option>Deep guide + Telugu voiceover</option>
<option>Only deep command guide</option>
<option>Only deep Telugu voiceover</option>
</select>

<label>Extra instruction</label>
<textarea id="extra" placeholder="Example: Explain flags also. Add Termux errors. Make voiceover slow and clear."></textarea>

<button class="primary" id="generateBtn">Generate Deep Output</button>
<div class="note"><b>Voiceover rule:</b> Section three voiceover Telugu script లో one continuous script గా ఉంటుంది. Direct digits avoid చేస్తుంది. Commands exact గా ఉంటాయి.</div>
<p class="small">Render Environment లో <b>NVIDIA_API_KEY</b> add చేయాలి. Optional: <b>NIM_MODEL</b>.</p>
</section>

<section class="output">
<div class="head"><h2>Generated Output</h2><button class="secondary" id="copyBtn">Copy</button></div>
<pre id="output">మీ deep command explanation + voiceover output ఇక్కడ కనిపిస్తుంది.</pre>
</section>
</section>
</main>

<script>
const commands = ${JSON.stringify(commands)};
const $ = id => document.getElementById(id);
commands.forEach(cmd=>{
  const span=document.createElement("span");
  span.className="pill"; span.textContent=cmd;
  span.onclick=()=>{$("command").value=cmd};
  $("pills").appendChild(span);
});
$("generateBtn").onclick = async ()=>{
  const payload = {
    day: $("day").value.trim(),
    command: $("command").value.trim(),
    environment: $("environment").value,
    depth: $("depth").value,
    voiceLength: $("voiceLength").value,
    voiceEmotion: $("voiceEmotion").value,
    outputMode: $("outputMode").value,
    extra: $("extra").value.trim()
  };
  $("output").textContent = "Generating deep command explanation and Telugu voiceover... Please wait.";
  try{
    const response = await fetch("/api/generate", {
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify(payload)
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
  $("copyBtn").textContent="Copied";
  setTimeout(()=>$("copyBtn").textContent="Copy",1200);
};
</script>
</body>
</html>`;

app.get("/", (req, res) => res.type("html").send(html));

app.get("/health", (req, res) => {
  res.json({ ok: true, app: "Linux Deep Command Voiceover Generator", version: "8.0.0" });
});

app.post("/api/generate", async (req, res) => {
  try {
    const { day, command, environment, depth, voiceLength, voiceEmotion, outputMode, extra } = req.body;

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

The user wants deeper command explanation AND a voiceover for that explanation.

Follow this 13-section structure exactly:

1. VIDEO TITLE
2. 3 HOOK OPTIONS
3. DEEP VOICEOVER SCRIPT WITH EXPRESSIONS AND RHYTHM
4. SCREEN RECORDING PLAN WITH TIMELINE
5. REQUIREMENTS
6. TERMUX INSTALL COMMANDS
7. UBUNTU/DEBIAN INSTALL COMMANDS
8. DEEP COMMAND EXPLANATION
9. COMMON ERRORS AND FIXES
10. PRACTICE TASK
11. INSTAGRAM CAPTION
12. HASHTAGS
13. SAFETY NOTE

INPUTS:
Day: ${day}
Command/topic: ${command}
Environment: ${environment || "Termux on Android"}
Explanation depth: ${depth || "Deep beginner explanation"}
Voiceover length: ${voiceLength || "60 seconds"}
Voice emotion: ${voiceEmotion || "Friendly motivational teacher"}
Output mode: ${outputMode || "Deep guide + Telugu voiceover"}
Extra instruction: ${extra || "No extra instruction"}

SECTION 3 VOICEOVER RULES:
- Section 3 must be ONE continuous paste-ready voiceover script.
- Voiceover must explain the command more deeply, but still beginner-friendly.
- Do NOT split it into many "Voiceover:" chunks.
- Spoken text must be in Telugu script.
- Do NOT write Roman Telugu.
- Linux commands, package names, file paths, flags, URLs, and error messages must remain in English/code format.
- Use expression and rhythm tags in square brackets.
- Example tags: [soft background music], [warm tone], [curious tone], [short pause], [pause], [confident], [slowly], [motivational tone].
- Keep sentences short and easy for AI voice/TTS.
- No direct digits in section 3 voiceover. Write numbers in Telugu words or avoid the number.
- Pause tags must not contain digits. Use [short pause], [pause], [long pause].
- Commands with numbers, versions, flags, or paths can remain exact when they are real commands. Example: python3 can remain python3.
- Voiceover should include:
  a) What the command means
  b) Why beginners need it
  c) Syntax
  d) What output means
  e) One useful example
  f) One common mistake
  g) Motivation/follow CTA
- Avoid lines like "Screen మీద మీరు..." unless necessary.

SECTION 8 DEEP COMMAND EXPLANATION RULES:
Explain deeply in English with clear bullets:
- Command purpose
- Basic syntax
- How the command works conceptually
- Important options/flags if any
- What the output means
- When to use it
- When not to use it
- Beginner mistakes
- Safe examples
- Related commands
- Real project use
Keep it accurate. If a command has no flags or no install requirement, say so.

OTHER SECTIONS:
1. VIDEO TITLE - one clear title in quotes.
2. 3 HOOK OPTIONS - three short hooks.
4. SCREEN RECORDING PLAN WITH TIMELINE - bullet timeline with seconds.
5. REQUIREMENTS - mention if no extra package required.
6. TERMUX INSTALL COMMANDS - if none, say "None required."
7. UBUNTU/DEBIAN INSTALL COMMANDS - if none, say "None required."
9. COMMON ERRORS AND FIXES - realistic errors only.
10. PRACTICE TASK - two to three safe tasks.
11. INSTAGRAM CAPTION - short caption. Telugu script allowed.
12. HASHTAGS - eight to sixteen hashtags.
13. SAFETY NOTE - clear beginner warning.

For risky commands like rm, chmod, chown, sudo, kill, use safe demo folder only.

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
            content: "Generate deep Linux command guides with one continuous Telugu-script voiceover. Do not use Roman Telugu in voiceover. Keep commands in English."
          },
          { role: "user", content: prompt }
        ],
        max_tokens: 2600,
        temperature: 0.36
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

app.listen(PORT, () => console.log(`Deep command voiceover app running on port ${PORT}`));
