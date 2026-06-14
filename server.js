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
<title>Linux Challenge - Telugu Voiceover Number Words</title>
<style>
*{box-sizing:border-box}
body{margin:0;font-family:Arial,"Noto Sans Telugu",sans-serif;background:#070b12;color:#f3f7ff}
.app{width:min(1050px,94%);margin:auto;padding:28px 0 50px}
.hero{text-align:center;margin-bottom:18px}
.badge{display:inline-block;background:#14243a;border:1px solid #2c4869;padding:8px 12px;border-radius:999px;color:#9ed0ff;font-weight:700}
h1{font-size:clamp(30px,7vw,54px);margin:14px 0 8px}
.sub{color:#aebbd0;line-height:1.6;max-width:820px;margin:auto}
.grid{display:grid;grid-template-columns:1fr;gap:18px}
@media(min-width:900px){.grid{grid-template-columns:390px 1fr;align-items:start}}
.card,.output{background:#101827;border:1px solid #263348;border-radius:18px;padding:18px;box-shadow:0 18px 50px rgba(0,0,0,.35)}
label{display:block;margin:14px 0 7px;color:#d4def0;font-weight:800}
input,select,textarea{width:100%;padding:13px 14px;border:1px solid #35455d;border-radius:12px;background:#0c1320;color:white;font-size:15px;font-family:Arial,"Noto Sans Telugu",sans-serif}
textarea{min-height:85px;resize:vertical}
button{border:0;padding:13px 16px;border-radius:12px;font-weight:900;font-size:15px;cursor:pointer}
.primary{width:100%;margin-top:16px;background:linear-gradient(135deg,#40a6ff,#7c5cff);color:#06111f}
.secondary{background:#1b2638;color:#dceaff;border:1px solid #33425a}
pre{white-space:pre-wrap;word-wrap:break-word;line-height:1.75;color:#e9f1ff;background:#050912;padding:16px;border-radius:14px;border:1px solid #202d40;min-height:500px;overflow-x:auto;font-size:15px;font-family:Arial,"Noto Sans Telugu",sans-serif}
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
<p class="badge">Linux Challenge • v7 Number Words Voiceover</p>
<h1>Telugu Voiceover Number Words</h1>
<p class="sub">Section 3 voiceover లో digits రాకుండా, numbers words లో వస్తాయి. Example: <b>90</b> కాదు, <b>తొంభై</b>. <b>Day 1</b> కాదు, <b>మొదటి రోజు</b>.</p>
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

<label>Voiceover style</label>
<select id="voiceMode">
<option>All-in-one Telugu script with expressions and number words</option>
<option>All-in-one Telugu script only</option>
<option>Only voiceover section</option>
</select>

<label>Video length</label>
<select id="videoLength">
<option>30 seconds</option>
<option>35 seconds</option>
<option>45 seconds</option>
<option>60 seconds</option>
</select>

<label>Voice emotion</label>
<select id="voiceEmotion">
<option>Friendly motivational teacher</option>
<option>Calm beginner tutor</option>
<option>Energetic Instagram tech creator</option>
<option>Professional tutorial narrator</option>
</select>

<label>Extra instruction</label>
<textarea id="extra" placeholder="Example: Make it more motivational. Keep sentences easy for AI voice."></textarea>

<button class="primary" id="generateBtn">Generate Final Voiceover Output</button>

<div class="note"><b>Final rule:</b> Voiceover section లో direct numbers రాయకూడదు. <code>1</code>, <code>2</code>, <code>90</code> లాంటివి Telugu words గా రావాలి. Commands మాత్రం exact గా ఉంటాయి: <code>pwd</code>, <code>ls</code>, <code>git</code>.</div>
<p class="small">Render Environment లో <b>NVIDIA_API_KEY</b> add చేయాలి. Optional: <b>NIM_MODEL</b>.</p>
</section>

<section class="output">
<div class="head">
<h2>Generated Output</h2>
<button class="secondary" id="copyBtn">Copy</button>
</div>
<pre id="output">మీ final all-in-one voiceover output ఇక్కడ కనిపిస్తుంది.</pre>
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
    voiceMode: $("voiceMode").value,
    videoLength: $("videoLength").value,
    voiceEmotion: $("voiceEmotion").value,
    extra: $("extra").value.trim()
  };
  $("output").textContent = "Generating final Telugu voiceover with number words... Please wait.";
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
  res.json({ ok: true, app: "Linux Challenge Telugu Voiceover Number Words Generator", version: "7.0.0" });
});

app.post("/api/generate", async (req, res) => {
  try {
    const { day, command, environment, voiceMode, videoLength, voiceEmotion, extra } = req.body;

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

The output must follow this exact 13-section structure:

1. VIDEO TITLE
2. 3 HOOK OPTIONS
3. VOICEOVER SCRIPT WITH EXPRESSIONS AND RHYTHM
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

CRITICAL VOICEOVER RULES FOR SECTION 3:
- Section 3 must be ONE continuous paste-ready voiceover script.
- Do NOT split it into many "Voiceover:" chunks.
- Do NOT write Roman Telugu.
- Spoken text must be in Telugu script.
- Linux commands, package names, file paths, flags, URLs, and error messages must remain in English/code format.
- Use expression and rhythm tags in square brackets.
- Keep sentences short and easy for AI voice/TTS.
- The voiceover must feel like one natural narration that can be pasted directly into ElevenLabs or CapCut.
- Avoid saying "Screen మీద మీరు..." unless truly needed.
- End with a short motivational follow-style CTA, but do not mention a specific next-day number.

MOST IMPORTANT NUMBER RULE:
- In section 3 voiceover, do NOT write direct digits such as 1, 2, 3, 10, 30, 45, 60, or 90.
- Write numbers in Telugu words so TTS will not read them in English.
- Examples:
  - Do not write: "Day 1"
  - Write: "మొదటి రోజు"
  - Do not write: "90 Days"
  - Write: "తొంభై రోజుల"
  - Do not write: "2 seconds"
  - Write: "కొంచెం విరామం" or use [short pause]
  - Do not write: "30 seconds"
  - Write: "చిన్న video"
- Pause tags must not contain digits. Use [short pause], [pause], [long pause], not [pause for 2 seconds].
- Section headings outside voiceover can keep numbers if needed.
- Timeline section can use digits because it is not spoken voiceover.
- Commands with numbers, versions, flags, or paths can remain exact when they are real commands. Example: python3 can remain python3.

GOOD SECTION 3 FORMAT EXAMPLE:
3. VOICEOVER SCRIPT WITH EXPRESSIONS AND RHYTHM

[soft background music] [warm tone]
"Linux basics challenge లోకి స్వాగతం. ఈ రోజు మనం \`pwd\` command గురించి నేర్చుకుందాం. [short pause]

\`pwd\` అంటే print working directory. Terminal లో మనం ప్రస్తుతం ఏ folder లో ఉన్నామో ఇది చూపిస్తుంది. [pause]

ఇప్పుడు Termux open చేసి, \`pwd\` అని type చేసి Enter press చేయండి. [short pause]

మీకు ఒక path కనిపిస్తే, command correct గా work అయింది. [confident]

చిన్న command అయినా, Linux journey లో ఇది strong first step. నేర్చుకుంటూ practice చేస్తే skill automatic గా build అవుతుంది. [motivational tone]

ఇలాంటి practical Linux commands కోసం follow అవ్వండి."

INPUTS:
Day: ${day}
Command/topic: ${command}
Environment: ${environment || "Termux on Android"}
Voiceover mode: ${voiceMode || "All-in-one Telugu script with expressions and number words"}
Video length: ${videoLength || "35 seconds"}
Voice emotion: ${voiceEmotion || "Friendly motivational teacher"}
Extra instruction: ${extra || "No extra instruction"}

SECTION DETAILS:

1. VIDEO TITLE
- One title in quotes, English style.

2. 3 HOOK OPTIONS
- 3 short hooks in English.

3. VOICEOVER SCRIPT WITH EXPRESSIONS AND RHYTHM
- One continuous script only.
- Telugu script spoken lines only.
- Commands stay English/code format.
- Include expression tags and pause tags inside the script.
- No direct digits in spoken voiceover. Use Telugu words or avoid the number.
- Make it suitable for ${videoLength || "35 seconds"}.
- Mention requirement/check/fix if useful.

4. SCREEN RECORDING PLAN WITH TIMELINE
- Bullet timeline with seconds. Digits are allowed here.

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
            content: "Generate fixed-format Linux video plans. Section 3 must be one continuous Telugu-script voiceover with expression/rhythm tags and no direct digits. Keep commands in English."
          },
          { role: "user", content: prompt }
        ],
        max_tokens: 1900,
        temperature: 0.38
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
  console.log(`Telugu number-words voiceover app running on port ${PORT}`);
});
