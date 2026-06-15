import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 10000;
app.use(express.json({ limit: "1mb" }));

const commands = ["pwd","ls","cd","mkdir","touch","cat","cp","mv","rm","chmod","chown","git","curl","wget","grep","find","ps","top","kill","df","du","free","uname","tar","zip/unzip","bash script"];

const DEFAULT_MODELS = {
  planner: "meta/llama-3.3-70b-instruct",
  deep: "nvidia/llama-3.3-nemotron-super-49b-v1.5",
  voice: "meta/llama-3.3-70b-instruct",
  psychology: "meta/llama-3.3-70b-instruct",
  fallback: "meta/llama-3.3-70b-instruct"
};

function getModel(role) {
  if (role === "planner") return process.env.MODEL_PLANNER || DEFAULT_MODELS.planner;
  if (role === "deep") return process.env.MODEL_DEEP || DEFAULT_MODELS.deep;
  if (role === "voice") return process.env.MODEL_VOICE || DEFAULT_MODELS.voice;
  if (role === "psychology") return process.env.MODEL_PSYCHOLOGY || DEFAULT_MODELS.psychology;
  return process.env.MODEL_FALLBACK || DEFAULT_MODELS.fallback;
}

function getTag(text, tag, fallback = "") {
  const re = new RegExp(`<${tag}>\\s*([\\s\\S]*?)\\s*</${tag}>`, "i");
  const match = text.match(re);
  return match ? match[1].trim() : fallback;
}

async function callNvidia(model, prompt, maxTokens = 1400, temperature = 0.25) {
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
          content: "Return tagged content only. No JSON. No markdown fences. Follow the requested tags exactly."
        },
        { role: "user", content: prompt }
      ],
      max_tokens: maxTokens,
      temperature
    })
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`${model} failed: ${text}`);
  }

  const data = await response.json();
  return data?.choices?.[0]?.message?.content || "";
}

async function callSpecialist(role, prompt, maxTokens, temperature) {
  const specialist = getModel(role);
  const fallback = getModel("fallback");
  try {
    return {
      text: await callNvidia(specialist, prompt, maxTokens, temperature),
      model: specialist,
      fallbackUsed: false
    };
  } catch (error) {
    if (specialist === fallback) throw error;
    return {
      text: await callNvidia(fallback, prompt, maxTokens, temperature),
      model: fallback,
      fallbackUsed: true
    };
  }
}

function formatOutput(reviewed, modelInfo) {
  const modelLine = `Planner: ${modelInfo.planner}${modelInfo.plannerFallback ? " (fallback used)" : ""}
Deep Linux: ${modelInfo.deep}${modelInfo.deepFallback ? " (fallback used)" : ""}
Native Telugu Voice: ${modelInfo.voice}${modelInfo.voiceFallback ? " (fallback used)" : ""}
Psychology Reviewer: ${modelInfo.psychology}${modelInfo.psychologyFallback ? " (fallback used)" : ""}`;

  const videoTitle = getTag(reviewed, "video_title", "\"Linux Command Tutorial\"");
  const hooks = getTag(reviewed, "hooks", "- Learn this Linux command clearly.\n- Fix beginner confusion.\n- Practice Linux visually.");
  const voiceover = getTag(reviewed, "voiceover", "[warm tone]\nఈ రోజు మనం Linux command ని simple గా నేర్చుకుందాం. [pause]");
  const visualStyle = getTag(reviewed, "visual_style", "- Dark black grid background\n- Neon green and white text\n- Terminal recording with zoom");
  const editTimeline = getTag(reviewed, "edit_timeline", "- 0s-3s: Show title\n- 3s-15s: Explain command\n- 15s-35s: Terminal demo and error fix");
  const requirements = getTag(reviewed, "requirements", "- No extra package required.");
  const termux = getTag(reviewed, "termux_commands", "- None required.");
  const ubuntu = getTag(reviewed, "ubuntu_commands", "- None required.");
  const examples = getTag(reviewed, "main_examples", "- command");
  const explanation = getTag(reviewed, "deep_explanation", "Command purpose, syntax, output meaning, use cases, mistakes, and safe examples.");
  const errors = getTag(reviewed, "errors_fixes", "- No common installation error for this command.");
  const task = getTag(reviewed, "practice_task", "- Try the command in Termux.\n- Observe the output carefully.");
  const caption = getTag(reviewed, "caption", "Linux basics challenge. Learn one command with real practice.");
  const hashtags = getTag(reviewed, "hashtags", "#Linux #Termux #LinuxForBeginners");
  const psychologyNotes = getTag(reviewed, "psychology_notes", "- Hook improved for curiosity.\n- Repetition removed.\n- CTA made motivating.");
  const safety = getTag(reviewed, "safety_note", "Always understand a command before running it.");

  return `0. MODELS USED
${modelLine}

1. VIDEO TITLE
${videoTitle}

2. 3 HOOK OPTIONS
${hooks}

3. NATIVE TELUGU VOICEOVER SCRIPT WITH EXPRESSIONS, RHYTHM, AND ERROR FIX MOMENT
${voiceover}

4. REFERENCE REEL VISUAL STYLE
${visualStyle}

5. REFERENCE STYLE EDIT TIMELINE
${editTimeline}

6. REQUIREMENTS
${requirements}

7. TERMUX INSTALL COMMANDS
${termux}

8. UBUNTU/DEBIAN INSTALL COMMANDS
${ubuntu}

9. MAIN COMMAND EXAMPLES
${examples}

10. DEEP COMMAND EXPLANATION
${explanation}

11. COMMON ERRORS AND FIXES
${errors}

12. PRACTICE TASK
${task}

13. INSTAGRAM CAPTION
${caption}

14. HASHTAGS
${hashtags}

15. PSYCHOLOGY REVIEW NOTES
${psychologyNotes}

16. SAFETY NOTE
${safety}`;
}

const html = `<!DOCTYPE html>
<html lang="te">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>Linux Multi-Model Psychology Reviewer</title>
<style>
*{box-sizing:border-box}
body{margin:0;background:#070b12;color:#f3f7ff;font-family:Arial,"Noto Sans Telugu",sans-serif}
main{width:min(1120px,94%);margin:auto;padding:28px 0 50px}
.hero{text-align:center;margin-bottom:20px}
.badge{display:inline-block;background:#14243a;border:1px solid #2c4869;padding:8px 12px;border-radius:999px;color:#9ed0ff;font-weight:700}
h1{font-size:clamp(30px,7vw,54px);margin:14px 0 8px}
.sub{color:#aebbd0;line-height:1.6;max-width:920px;margin:auto}
.grid{display:grid;grid-template-columns:1fr;gap:18px}
@media(min-width:900px){.grid{grid-template-columns:420px 1fr;align-items:start}}
.card,.output{background:#101827;border:1px solid #263348;border-radius:18px;padding:18px;box-shadow:0 18px 50px rgba(0,0,0,.35)}
label{display:block;margin:14px 0 7px;color:#d4def0;font-weight:800}
input,select,textarea{width:100%;padding:13px 14px;border:1px solid #35455d;border-radius:12px;background:#0c1320;color:white;font-size:15px;font-family:Arial,"Noto Sans Telugu",sans-serif}
textarea{min-height:98px;resize:vertical}
button{border:0;padding:13px 16px;border-radius:12px;font-weight:900;font-size:15px;cursor:pointer}
.primary{width:100%;margin-top:16px;background:linear-gradient(135deg,#40a6ff,#7c5cff);color:#06111f}
.secondary{background:#1b2638;color:#dceaff;border:1px solid #33425a}
pre{white-space:pre-wrap;word-wrap:break-word;line-height:1.72;color:#e9f1ff;background:#050912;padding:16px;border-radius:14px;border:1px solid #202d40;min-height:720px;overflow-x:auto;font-size:15px;font-family:Arial,"Noto Sans Telugu",sans-serif}
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
<p class="badge">Linux Challenge • v15 Psychology Reviewer</p>
<h1>Multi-Model + Human Psychology Review</h1>
<p class="sub">Planner model creates reel structure, deep model explains Linux, voice model writes native Telugu voiceover, and psychology reviewer corrects attention, emotion, clarity, repetition, and CTA.</p>
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

<label>Psychology review focus</label>
<select id="psychologyFocus">
<option>Retention + curiosity + clarity</option>
<option>Beginner confidence + motivation</option>
<option>Fast hook + emotional payoff</option>
<option>Error anxiety reduction + trust building</option>
</select>

<label>Extra instruction</label>
<textarea id="extra" placeholder="Example: Make the first 3 seconds very strong. Reduce repetition. Make CTA natural."></textarea>

<button class="primary" id="generateBtn">Generate With Psychology Review</button>
<div class="note"><b>Reviewer:</b> It checks hook strength, beginner fear, trust, repetition, emotional rhythm, error-fix confidence, and follow CTA.</div>
<p class="small">Render Environment variables: <b>MODEL_PLANNER</b>, <b>MODEL_DEEP</b>, <b>MODEL_VOICE</b>, <b>MODEL_PSYCHOLOGY</b>, <b>MODEL_FALLBACK</b>.</p>
</section>

<section class="output">
<div class="head"><h2>Generated Output</h2><button class="secondary" id="copyBtn">Copy</button></div>
<pre id="output">Multi-model psychology reviewed output ఇక్కడ కనిపిస్తుంది.</pre>
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
    psychologyFocus: $("psychologyFocus").value,
    extra: $("extra").value.trim()
  };
  $("output").textContent = "Running planner, deep Linux, voiceover, and psychology reviewer models... Please wait.";
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
  res.json({ ok: true, app: "Linux Multi-Model Psychology Reviewer", version: "15.0.0" });
});

app.post("/api/generate", async (req, res) => {
  try {
    const { day, command, environment, visualStyle, depth, voiceLength, errorStyle, voiceEmotion, psychologyFocus, extra } = req.body;

    if (!process.env.NVIDIA_API_KEY) {
      return res.status(500).json({
        error: "NVIDIA_API_KEY is missing.",
        details: "Open Render > your Web Service > Environment > Add NVIDIA_API_KEY. Then redeploy."
      });
    }

    if (!day || !command) {
      return res.status(400).json({ error: "Day number and Linux command/topic are required." });
    }

    const plannerPrompt = `
Return tagged content only. No JSON. No markdown fences.

You are a viral short-form tech reel planner.

Fill only these tags:
<video_title>...</video_title>
<hooks>...</hooks>
<visual_style>...</visual_style>
<edit_timeline>...</edit_timeline>
<caption>...</caption>
<hashtags>...</hashtags>
<safety_note>...</safety_note>

Inputs:
day: ${day}
command: ${command}
environment: ${environment}
visual style: ${visualStyle}
video length: ${voiceLength}
extra: ${extra || "No extra instruction"}

Rules:
- video_title: English only.
- hooks: exactly three English bullet lines.
- visual_style: dark-grid Linux explainer style: neon green/white text, dotted arrows, simple Linux icon, terminal screen recording, zoom on output.
- edit_timeline: English only, with timing and visual actions.
- caption: native Telugu + English tech words allowed.
- hashtags: eight to sixteen hashtags.
- safety_note: English only.
- Do not copy watermark, music, or exact assets from any creator.
`;

    const deepPrompt = `
Return tagged content only. No JSON. No markdown fences.

You are a Linux expert teacher.

Fill only these tags:
<requirements>...</requirements>
<termux_commands>...</termux_commands>
<ubuntu_commands>...</ubuntu_commands>
<main_examples>...</main_examples>
<deep_explanation>...</deep_explanation>
<errors_fixes>...</errors_fixes>
<practice_task>...</practice_task>

Inputs:
command: ${command}
environment: ${environment}
depth: ${depth}

Rules:
- English only.
- Explain accurately.
- If no package needed, say "- No extra package required."
- If no install command needed, say "- None required."
- deep_explanation must include purpose, syntax, how it works, output meaning, flags/options if any, use cases, not-use cases, beginner mistakes, related commands, safe examples, real project use.
- errors_fixes must use realistic errors/confusions only.
- For risky commands use safe demo folder only.
`;

    const voicePrompt = `
Return tagged content only. No JSON. No markdown fences.

You are a native Telugu tech creator writing one paste-ready AI voiceover.

Fill only this tag:
<voiceover>...</voiceover>

Inputs:
day: ${day}
command: ${command}
environment: ${environment}
voice length: ${voiceLength}
error style: ${errorStyle}
voice style: ${voiceEmotion}

Rules:
- One continuous voiceover only.
- Telugu script + natural English tech words.
- Native Telugu creator style, not textbook Telugu.
- Do not use Roman Telugu.
- Do not use full formal Telugu.
- Use words like command, terminal, folder, path, output, error, fix, install, package, type, Enter, work.
- Avoid formal words like ఆదేశం, సంచయం, దోషం, కార్యనిర్వహణ.
- No repeated sentence or idea.
- Maximum nine short lines.
- Use tags like [soft background music], [warm tone], [short pause], [pause], [surprised], [calm tone], [confident], [motivational tone].
- No direct digits in voiceover.
- Commands stay exact, for example \`${command}\`.
- Include error/confusion moment:
  If real error likely: "ఓహ్, ఇక్కడ error వచ్చింది. tension పడొద్దు, fix చేద్దాం."
  If command usually does not fail: "ఓహ్, output లో path చూసి confuse అయ్యారా? tension వద్దు, అది మీ current folder location."
- End with a short motivational follow CTA.
`;

    const plan = await callSpecialist("planner", plannerPrompt, 1200, 0.25);
    const deep = await callSpecialist("deep", deepPrompt, 1900, 0.18);
    const voice = await callSpecialist("voice", voicePrompt, 1100, 0.32);

    const reviewerPrompt = `
Return tagged content only. No JSON. No markdown fences.

You are a viewer psychology, attention, retention, beginner-learning, and trust reviewer for short-form tech videos.

You are NOT giving mental health advice. You are reviewing audience attention, clarity, motivation, trust, and beginner confidence.

Your job:
- Verify the full draft.
- Correct weak hooks.
- Remove repetition.
- Make voiceover more native Telugu + English tech words.
- Make the error-fix moment reduce beginner fear.
- Improve curiosity in first seconds.
- Improve emotional rhythm.
- Make CTA natural.
- Ensure no misleading claims.
- Ensure no formal Telugu in voiceover.
- Keep commands exact.

Return ALL final tags:
<video_title>...</video_title>
<hooks>...</hooks>
<voiceover>...</voiceover>
<visual_style>...</visual_style>
<edit_timeline>...</edit_timeline>
<requirements>...</requirements>
<termux_commands>...</termux_commands>
<ubuntu_commands>...</ubuntu_commands>
<main_examples>...</main_examples>
<deep_explanation>...</deep_explanation>
<errors_fixes>...</errors_fixes>
<practice_task>...</practice_task>
<caption>...</caption>
<hashtags>...</hashtags>
<psychology_notes>...</psychology_notes>
<safety_note>...</safety_note>

INPUT DETAILS:
command: ${command}
environment: ${environment}
psychology focus: ${psychologyFocus}
extra: ${extra || "No extra instruction"}

DRAFT PLAN:
${plan.text}

DRAFT DEEP EXPLANATION:
${deep.text}

DRAFT VOICEOVER:
${voice.text}

Strict voiceover rules:
- voiceover must be native spoken Telugu style, not formal Telugu.
- Use Telugu script + English tech words.
- Do not use Roman Telugu.
- No repeated sentences.
- Maximum nine short lines.
- Include an error/confusion fix moment.
- No direct digits.
- Keep expression tags.
`;

    const review = await callSpecialist("psychology", reviewerPrompt, 3300, 0.22);

    const output = formatOutput(review.text, {
      planner: plan.model,
      plannerFallback: plan.fallbackUsed,
      deep: deep.model,
      deepFallback: deep.fallbackUsed,
      voice: voice.model,
      voiceFallback: voice.fallbackUsed,
      psychology: review.model,
      psychologyFallback: review.fallbackUsed
    });

    res.json({ output });
  } catch (error) {
    res.status(500).json({ error: "Server error.", details: error.message });
  }
});

app.listen(PORT, () => console.log(`Multi-model psychology reviewer app running on port ${PORT}`));
