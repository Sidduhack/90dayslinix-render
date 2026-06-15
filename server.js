import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 10000;
app.use(express.json({ limit: "1mb" }));

const commands = ["pwd","ls","cd","mkdir","touch","cat","cp","mv","rm","chmod","chown","git","curl","wget","grep","find","ps","top","kill","df","du","free","uname","tar","zip/unzip","bash script"];

function fallbackValue(obj, key, fallback) {
  if (!obj || typeof obj[key] !== "string" || !obj[key].trim()) return fallback;
  return obj[key].trim();
}

function fallbackArray(obj, key, fallback) {
  if (!obj || !Array.isArray(obj[key]) || obj[key].length === 0) return fallback;
  return obj[key].map(x => String(x)).filter(Boolean);
}

function formatBullets(items) {
  return items.map(item => `- ${item}`).join("\n");
}

function formatOutput(data) {
  const title = fallbackValue(data, "video_title", "\"Linux Command Tutorial\"");
  const hooks = fallbackArray(data, "hooks", ["Learn this Linux command visually.", "Understand Linux without confusion.", "Fix beginner mistakes easily."]);
  const voiceover = fallbackValue(data, "voiceover", "[warm tone]\n\"ఈ రోజు మనం Linux command ని simple గా నేర్చుకుందాం. [pause]\"");
  const visualStyle = fallbackArray(data, "visual_style_notes", [
    "Use dark black grid background.",
    "Use neon green and white text.",
    "Use dotted arrows for explanation.",
    "Use terminal screen recording on the side."
  ]);
  const editTimeline = fallbackArray(data, "reference_style_edit_timeline", [
    "0s-3s: Dark grid background with big command title.",
    "3s-8s: Show icon/visual analogy.",
    "8s-20s: Explain command concept.",
    "20s-35s: Show terminal demo.",
    "35s-45s: Show error/fix moment and CTA."
  ]);
  const requirements = fallbackArray(data, "requirements", ["No extra package required."]);
  const termux = fallbackArray(data, "termux_install_commands", ["None required."]);
  const ubuntu = fallbackArray(data, "ubuntu_debian_install_commands", ["None required."]);
  const examples = fallbackArray(data, "main_command_examples", [`${fallbackValue(data, "command_name", "command")}`]);
  const explanation = fallbackValue(data, "deep_command_explanation", "Command purpose, syntax, output meaning, use cases, mistakes, and safe examples.");
  const errors = fallbackArray(data, "common_errors_and_fixes", ["No common installation error for this command."]);
  const tasks = fallbackArray(data, "practice_task", ["Try the command in Termux.", "Observe the output carefully."]);
  const caption = fallbackValue(data, "instagram_caption", "Linux basics challenge. Learn one command with real practice.");
  const hashtags = fallbackArray(data, "hashtags", ["#Linux", "#Termux", "#LinuxForBeginners"]);
  const safety = fallbackValue(data, "safety_note", "Always understand a command before running it.");

  return `1. VIDEO TITLE
${title}

2. 3 HOOK OPTIONS
${formatBullets(hooks)}

3. NATIVE TELUGU VOICEOVER SCRIPT WITH EXPRESSIONS, RHYTHM, AND ERROR FIX MOMENT
${voiceover}

4. REFERENCE REEL VISUAL STYLE
${formatBullets(visualStyle)}

5. REFERENCE STYLE EDIT TIMELINE
${formatBullets(editTimeline)}

6. REQUIREMENTS
${formatBullets(requirements)}

7. TERMUX INSTALL COMMANDS
${formatBullets(termux)}

8. UBUNTU/DEBIAN INSTALL COMMANDS
${formatBullets(ubuntu)}

9. MAIN COMMAND EXAMPLES
${formatBullets(examples)}

10. DEEP COMMAND EXPLANATION
${explanation}

11. COMMON ERRORS AND FIXES
${formatBullets(errors)}

12. PRACTICE TASK
${formatBullets(tasks)}

13. INSTAGRAM CAPTION
${caption}

14. HASHTAGS
${formatBullets(hashtags)}

15. SAFETY NOTE
${safety}`;
}

function tryParseJson(text) {
  try {
    return JSON.parse(text);
  } catch {
    const match = text.match(/\{[\s\S]*\}/);
    if (match) {
      try {
        return JSON.parse(match[0]);
      } catch {
        return null;
      }
    }
    return null;
  }
}

const html = `<!DOCTYPE html>
<html lang="te">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>Linux Reference Reel Style Generator</title>
<style>
*{box-sizing:border-box}
body{margin:0;background:#070b12;color:#f3f7ff;font-family:Arial,"Noto Sans Telugu",sans-serif}
main{width:min(1120px,94%);margin:auto;padding:28px 0 50px}
.hero{text-align:center;margin-bottom:20px}
.badge{display:inline-block;background:#14243a;border:1px solid #2c4869;padding:8px 12px;border-radius:999px;color:#9ed0ff;font-weight:700}
h1{font-size:clamp(30px,7vw,54px);margin:14px 0 8px}
.sub{color:#aebbd0;line-height:1.6;max-width:900px;margin:auto}
.grid{display:grid;grid-template-columns:1fr;gap:18px}
@media(min-width:900px){.grid{grid-template-columns:410px 1fr;align-items:start}}
.card,.output{background:#101827;border:1px solid #263348;border-radius:18px;padding:18px;box-shadow:0 18px 50px rgba(0,0,0,.35)}
label{display:block;margin:14px 0 7px;color:#d4def0;font-weight:800}
input,select,textarea{width:100%;padding:13px 14px;border:1px solid #35455d;border-radius:12px;background:#0c1320;color:white;font-size:15px;font-family:Arial,"Noto Sans Telugu",sans-serif}
textarea{min-height:98px;resize:vertical}
button{border:0;padding:13px 16px;border-radius:12px;font-weight:900;font-size:15px;cursor:pointer}
.primary{width:100%;margin-top:16px;background:linear-gradient(135deg,#40a6ff,#7c5cff);color:#06111f}
.secondary{background:#1b2638;color:#dceaff;border:1px solid #33425a}
pre{white-space:pre-wrap;word-wrap:break-word;line-height:1.72;color:#e9f1ff;background:#050912;padding:16px;border-radius:14px;border:1px solid #202d40;min-height:620px;overflow-x:auto;font-size:15px;font-family:Arial,"Noto Sans Telugu",sans-serif}
.pills{display:flex;flex-wrap:wrap;gap:8px;margin-top:12px}
.pill{border:1px solid #30425d;background:#111c2e;color:#d7e7ff;border-radius:999px;padding:8px 10px;font-size:13px;cursor:pointer}
.note{border-left:4px solid #55f0a6;background:rgba(85,240,166,.08);padding:12px;border-radius:12px;color:#c8ffe3;line-height:1.5;font-size:14px;margin-top:14px}
.head{display:flex;justify-content:space-between;gap:10px;align-items:center;margin-bottom:10px}
.small{color:#aebbd0;font-size:13px;line-height:1.45}
code{color:#9ed0ff}
</style>
</head>
<body>
<main>
<section class="hero">
<p class="badge">Linux Challenge • v12 Reference Reel Style</p>
<h1>Dark Grid Linux Reel Generator</h1>
<p class="sub">మీ uploaded reel లాంటి style కోసం: dark grid background, neon green text, dotted arrows, Linux icons, terminal recording, native Telugu voiceover, and error-fix moment.</p>
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

<label>Visual style</label>
<select id="visualStyle">
<option>Dark grid neon Linux explainer style</option>
<option>Dark grid terminal focused style</option>
<option>Icon + terminal split screen style</option>
<option>Fast Instagram dark tech style</option>
</select>

<label>Explanation depth</label>
<select id="depth">
<option>Deep beginner explanation</option>
<option>Simple beginner explanation</option>
<option>Very deep practical explanation</option>
<option>Interview-style explanation</option>
</select>

<label>Video length</label>
<select id="voiceLength">
<option>45 seconds</option>
<option>60 seconds</option>
<option>90 seconds</option>
<option>2 minutes</option>
</select>

<label>Error fix style</label>
<select id="errorStyle">
<option>Natural error reaction + calm fix</option>
<option>Funny small reaction + quick fix</option>
<option>Teacher style error explanation</option>
<option>Fast Reel style error fix</option>
</select>

<label>Native Telugu style</label>
<select id="voiceEmotion">
<option>Native friendly Telugu tech creator</option>
<option>Native motivational Telugu teacher</option>
<option>Calm native Telugu explainer</option>
<option>Fast Instagram Telugu tech style</option>
</select>

<label>Extra instruction</label>
<textarea id="extra" placeholder="Example: Make visual plan exactly like dark grid reel. Add Linux mascot/icon idea. Avoid repeated sentences."></textarea>

<button class="primary" id="generateBtn">Generate Reference Style Reel Plan</button>
<div class="note"><b>Style:</b> Dark grid background + neon text + dotted arrows + terminal demo + native Telugu voiceover + error fix moment.</div>
<p class="small">Render Environment లో <b>NVIDIA_API_KEY</b> add చేయాలి. Optional: <b>NIM_MODEL</b>.</p>
</section>

<section class="output">
<div class="head"><h2>Generated Output</h2><button class="secondary" id="copyBtn">Copy</button></div>
<pre id="output">Reference reel style output ఇక్కడ కనిపిస్తుంది.</pre>
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
    visualStyle: $("visualStyle").value,
    depth: $("depth").value,
    voiceLength: $("voiceLength").value,
    errorStyle: $("errorStyle").value,
    voiceEmotion: $("voiceEmotion").value,
    extra: $("extra").value.trim()
  };
  $("output").textContent = "Generating reference reel style output... Please wait.";
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
  res.json({ ok: true, app: "Linux Reference Reel Style Generator", version: "12.0.0" });
});

app.post("/api/generate", async (req, res) => {
  try {
    const { day, command, environment, visualStyle, depth, voiceLength, errorStyle, voiceEmotion, extra } = req.body;

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
Return ONLY valid JSON. No markdown. No explanation outside JSON.

Generate a Linux basics reel plan inspired by a dark-grid Linux explainer reference video.

Important:
- The app will add headings by itself.
- Do NOT create numbered headings.
- Do NOT translate headings.
- Only fill JSON values.

Inputs:
day: ${day}
command: ${command}
environment: ${environment || "Termux on Android"}
visualStyle: ${visualStyle || "Dark grid neon Linux explainer style"}
depth: ${depth || "Deep beginner explanation"}
videoLength: ${voiceLength || "60 seconds"}
errorStyle: ${errorStyle || "Natural error reaction + calm fix"}
voiceStyle: ${voiceEmotion || "Native friendly Telugu tech creator"}
extra: ${extra || "No extra instruction"}

Required JSON keys:
{
  "command_name": "",
  "video_title": "",
  "hooks": [],
  "voiceover": "",
  "visual_style_notes": [],
  "reference_style_edit_timeline": [],
  "requirements": [],
  "termux_install_commands": [],
  "ubuntu_debian_install_commands": [],
  "main_command_examples": [],
  "deep_command_explanation": "",
  "common_errors_and_fixes": [],
  "practice_task": [],
  "instagram_caption": "",
  "hashtags": [],
  "safety_note": ""
}

Visual reference style rules:
- Use vertical reel format.
- Dark black grid background.
- Neon green and white heading text.
- Use Linux penguin / command-related simple icon / terminal screenshot.
- Use dotted arrows and labels.
- Use terminal screen recording for demo.
- Use zoom-in on important terminal output.
- Use small signature/footer only if user wants branding; never copy another creator watermark.
- Do not tell user to reuse copyrighted music or the original video assets.

Rules for voiceover:
- Must be ONE continuous script.
- Telugu script plus natural English tech words.
- Native Telugu creator style, not textbook Telugu.
- Do NOT write Roman Telugu.
- Do NOT use full formal Telugu.
- Use natural words like command, terminal, folder, path, output, error, fix, install, package, type, Enter, work.
- Do NOT use formal words like ఆదేశం, సంచయం, దోషం, కార్యనిర్వహణ.
- Do NOT repeat the same sentence or idea.
- Maximum nine short spoken lines.
- Each idea must appear only once.
- Use square bracket tags: [soft background music], [warm tone], [curious tone], [short pause], [pause], [confident], [surprised], [calm tone], [motivational tone].
- No direct digits in voiceover. Use Telugu words or avoid the number.
- Commands stay exact, for example \`${command}\`.

Voiceover must include:
- quick intro,
- what the command does,
- how to run it,
- what output means,
- one error or confusion reaction,
- how to fix or understand it,
- motivation/follow CTA.

Include an error-fix moment:
- For real package/command errors: "ఓహ్, ఇక్కడ error వచ్చింది. tension పడొద్దు, fix చేద్దాం."
- If ${command} normally does not fail, use a confusion case:
  "ఓహ్, output లో path చూసి confuse అయ్యారా? tension వద్దు, అది మీ current folder location."

Rules for deep_command_explanation:
- Simple English.
- Explain deeply:
  purpose,
  syntax,
  how it works conceptually,
  output meaning,
  options/flags if any,
  when to use,
  when not to use,
  beginner mistakes,
  related commands,
  safe examples,
  real project use.

Rules for common_errors_and_fixes:
- Include realistic errors only.
- Include error/confusion case that also appears in voiceover.
- Format each item like: "Error/confusion" - reason - fix.

Rules for install commands:
- If no package needed, say "None required."

Return strict JSON only.
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
            content: "Return valid JSON only. Generate dark-grid Linux reel plans with native Telugu voiceover, error-fix moment, and deep command explanation. Do not translate app headings."
          },
          { role: "user", content: prompt }
        ],
        max_tokens: 2700,
        temperature: 0.28
      })
    });

    if (!response.ok) {
      const text = await response.text();
      return res.status(response.status).json({ error: "NVIDIA API request failed.", details: text });
    }

    const apiData = await response.json();
    const raw = apiData?.choices?.[0]?.message?.content || "";
    const parsed = tryParseJson(raw);

    if (!parsed) {
      return res.json({
        output: `AI returned invalid JSON. Try again, or use a stronger model.\n\nRaw output:\n${raw}`,
        model
      });
    }

    const output = formatOutput(parsed);
    res.json({ output, model });
  } catch (error) {
    res.status(500).json({ error: "Server error.", details: error.message });
  }
});

app.listen(PORT, () => console.log(`Reference reel style app running on port ${PORT}`));
