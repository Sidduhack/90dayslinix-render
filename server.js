import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 10000;
app.use(express.json({ limit: "1mb" }));

const commands = ["pwd","ls","cd","mkdir","touch","cat","cp","mv","rm","chmod","chown","git","curl","wget","grep","find","ps","top","kill","df","du","free","uname","tar","zip/unzip","bash script"];

function getSingleModel() {
  return process.env.MODEL_ALL || process.env.NIM_MODEL || "meta/llama-3.3-70b-instruct";
}

function getTag(text, tag, fallback = "") {
  const re = new RegExp(`<${tag}>\\s*([\\s\\S]*?)\\s*</${tag}>`, "i");
  const match = text.match(re);
  return match ? match[1].trim() : fallback;
}

async function callNvidia(prompt, maxTokens = 1800, temperature = 0.25) {
  const model = getSingleModel();

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
          content: "Return tagged content only. No JSON. No markdown fences. Follow tags exactly. Be accurate, concise, and avoid repetition."
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

function formatOutput(reviewed) {
  const model = getSingleModel();

  const videoTitle = getTag(reviewed, "video_title", "\"Linux Command Tutorial\"");
  const hooks = getTag(reviewed, "hooks", "- Learn this Linux command clearly.\n- Fix beginner confusion.\n- Practice Linux visually.");
  const fullVoiceover = getTag(reviewed, "full_voiceover", "[warm tone]\nఈ రోజు మనం Linux command ని deep గా నేర్చుకుందాం. [pause]");
  const sectionVoiceover = getTag(reviewed, "section_wise_voiceover", "- Hook voiceover\n- Concept voiceover\n- Demo voiceover\n- Error fix voiceover\n- CTA voiceover");
  const visualStyle = getTag(reviewed, "visual_style", "- Dark black grid background\n- Neon green and white text\n- Terminal recording with zoom");
  const editTimeline = getTag(reviewed, "edit_timeline", "- 0s-3s: Show title\n- 3s-15s: Explain command\n- 15s-35s: Terminal demo and error fix");
  const requirements = getTag(reviewed, "requirements", "- No extra package required.");
  const termux = getTag(reviewed, "termux_commands", "- None required.");
  const ubuntu = getTag(reviewed, "ubuntu_commands", "- None required.");
  const examples = getTag(reviewed, "main_examples", "- command");
  const explanation = getTag(reviewed, "deep_explanation", "Command purpose, syntax, output meaning, use cases, mistakes, and safe examples.");
  const deepLearningGuide = getTag(reviewed, "deep_learning_guide", "- Meaning\n- Mental model\n- Real examples\n- Mistakes\n- Practice");
  const errors = getTag(reviewed, "errors_fixes", "- No common installation error for this command.");
  const practice = getTag(reviewed, "practice_task", "- Try the command in Termux.\n- Observe the output carefully.");
  const quiz = getTag(reviewed, "mini_quiz", "- What does this command show?\n- When should you use it?");
  const caption = getTag(reviewed, "caption", "Linux basics challenge. Learn one command with real practice.");
  const hashtags = getTag(reviewed, "hashtags", "#Linux #Termux #LinuxForBeginners");
  const psychologyNotes = getTag(reviewed, "psychology_notes", "- Hook improved for curiosity.\n- Repetition removed.\n- CTA made motivating.");
  const safety = getTag(reviewed, "safety_note", "Always understand a command before running it.");

  return `0. MODEL USED FOR ALL ROLES
${model}

Roles powered by this one model:
- Reel planner
- Deep Linux teacher
- Native Telugu voiceover writer
- Viewer psychology reviewer
- Final correction pass

1. VIDEO TITLE
${videoTitle}

2. 3 HOOK OPTIONS
${hooks}

3. FULL VIDEO VOICEOVER SCRIPT
${fullVoiceover}

4. SECTION-WISE VOICEOVER BREAKDOWN
${sectionVoiceover}

5. REFERENCE REEL VISUAL STYLE
${visualStyle}

6. REFERENCE STYLE EDIT TIMELINE
${editTimeline}

7. REQUIREMENTS
${requirements}

8. TERMUX INSTALL COMMANDS
${termux}

9. UBUNTU/DEBIAN INSTALL COMMANDS
${ubuntu}

10. MAIN COMMAND EXAMPLES
${examples}

11. DEEP COMMAND EXPLANATION
${explanation}

12. DEEP LEARNING GUIDE
${deepLearningGuide}

13. COMMON ERRORS AND FIXES
${errors}

14. PRACTICE TASK
${practice}

15. MINI QUIZ FOR VIEWERS
${quiz}

16. INSTAGRAM CAPTION
${caption}

17. HASHTAGS
${hashtags}

18. PSYCHOLOGY REVIEW NOTES
${psychologyNotes}

19. SAFETY NOTE
${safety}`;
}

const html = `<!DOCTYPE html>
<html lang="te">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>Linux Single Model Generator</title>
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
pre{white-space:pre-wrap;word-wrap:break-word;line-height:1.72;color:#e9f1ff;background:#050912;padding:16px;border-radius:14px;border:1px solid #202d40;min-height:740px;overflow-x:auto;font-size:15px;font-family:Arial,"Noto Sans Telugu",sans-serif}
.pills{display:flex;flex-wrap:wrap;gap:8px;margin-top:12px}
.pill{border:1px solid #30425d;background:#111c2e;color:#d7e7ff;border-radius:999px;padding:8px 10px;font-size:13px;cursor:pointer}
.note{border-left:4px solid #55f0a6;background:rgba(85,240,166,.08);padding:12px;border-radius:12px;color:#c8ffe3;line-height:1.5;font-size:14px;margin-top:14px}
.status{border:1px solid #35455d;background:#0c1320;padding:12px;border-radius:12px;color:#dceaff;line-height:1.5;font-size:14px;margin-top:14px}
.head{display:flex;justify-content:space-between;gap:10px;align-items:center;margin-bottom:10px}
.small{color:#aebbd0;font-size:13px;line-height:1.45}
code{color:#9ed0ff}
</style>
</head>
<body>
<main>
<section class="hero">
<p class="badge">Linux Challenge • v20 Single Model</p>
<h1>One Model For Everything</h1>
<p class="sub">This version uses <b>meta/llama-3.3-70b-instruct</b> for planner, deep learning, voiceover, psychology reviewer, and final correction.</p>
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

<label>Learning depth</label>
<select id="depth">
<option>Deep beginner learning</option>
<option>Simple beginner learning</option>
<option>Very deep practical learning</option>
<option>Interview-style deep learning</option>
</select>

<label>Video length</label>
<select id="voiceLength">
<option>60 seconds</option>
<option>90 seconds</option>
<option>2 minutes</option>
<option>3 minutes</option>
</select>

<label>Voiceover coverage</label>
<select id="voiceCoverage">
<option>Full video voiceover + section-wise voiceover</option>
<option>Only full video voiceover</option>
<option>Detailed teaching voiceover</option>
<option>Short reel voiceover</option>
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
<textarea id="extra" placeholder="Example: Make the voiceover cover every visual step. Teach deeply but keep it beginner friendly."></textarea>

<button type="button" class="primary" id="generateBtn">Generate With One Model</button>
<button type="button" class="secondary" id="testBtn" style="width:100%;margin-top:10px;">Test API Connection</button>

<div class="status" id="statusBox">Status: Page loaded. Click Generate.</div>
<div class="note"><b>Model:</b> Uses MODEL_ALL or NIM_MODEL. Default is <code>meta/llama-3.3-70b-instruct</code>.</div>
<p class="small">Render vars: NVIDIA_API_KEY and MODEL_ALL=meta/llama-3.3-70b-instruct.</p>
</section>

<section class="output">
<div class="head"><h2>Generated Output</h2><button type="button" class="secondary" id="copyBtn">Copy</button></div>
<pre id="output">Click Generate. Single-model output will appear here.</pre>
</section>
</section>
</main>

<script>
(function(){
  const commands = ${JSON.stringify(commands)};
  const $ = id => document.getElementById(id);
  const statusBox = $("statusBox");
  const output = $("output");

  function setStatus(msg){ statusBox.textContent = "Status: " + msg; }
  function setOutput(msg){ output.textContent = msg; }

  commands.forEach(cmd=>{
    const span=document.createElement("span");
    span.className="pill";
    span.textContent=cmd;
    span.onclick=()=>{$("command").value=cmd};
    $("pills").appendChild(span);
  });

  $("testBtn").addEventListener("click", async ()=>{
    setStatus("Testing API connection...");
    setOutput("Testing /api/test ...");
    try{
      const response = await fetch("/api/test");
      const data = await response.json();
      setOutput(JSON.stringify(data, null, 2));
      setStatus(response.ok ? "API test completed." : "API test returned error.");
    }catch(error){
      setStatus("API test failed: " + error.message);
      setOutput("API test failed:\\n" + error.stack);
    }
  });

  $("generateBtn").addEventListener("click", async ()=>{
    const payload = {
      day: $("day").value.trim(),
      command: $("command").value.trim(),
      environment: $("environment").value,
      visualStyle: $("visualStyle").value,
      depth: $("depth").value,
      voiceLength: $("voiceLength").value,
      voiceCoverage: $("voiceCoverage").value,
      errorStyle: $("errorStyle").value,
      voiceEmotion: $("voiceEmotion").value,
      psychologyFocus: $("psychologyFocus").value,
      extra: $("extra").value.trim()
    };

    setStatus("Generate clicked. Sending request to the single model...");
    setOutput("Running the single-model all-in-one pipeline...\\n\\nPlanning reel style...\\nWriting deep learning guide...\\nWriting full native Telugu voiceover...\\nReviewing retention and psychology...\\n\\nPlease wait.");

    try{
      const response = await fetch("/api/generate", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify(payload)
      });
      setStatus("Server responded. Reading output...");
      const data = await response.json();

      if(!response.ok){
        setStatus("Generation failed.");
        setOutput("Error:\\n" + (data.error || "Request failed") + "\\n\\nDetails:\\n" + (data.details || ""));
        return;
      }

      setOutput(data.output || "No output returned from server.");
      setStatus("Generation completed.");
    }catch(error){
      setStatus("Browser request failed: " + error.message);
      setOutput("Browser request failed:\\n" + error.stack);
    }
  });

  $("copyBtn").addEventListener("click", async ()=>{
    try{
      await navigator.clipboard.writeText(output.textContent);
      setStatus("Copied output.");
      $("copyBtn").textContent="Copied";
      setTimeout(()=>$("copyBtn").textContent="Copy",1200);
    }catch(error){
      setStatus("Copy failed: " + error.message);
    }
  });

  setStatus("JavaScript loaded successfully. Buttons are ready.");
})();
</script>
</body>
</html>`;

app.get("/", (req, res) => res.type("html").send(html));

app.get("/api/test", (req, res) => {
  res.json({
    ok: true,
    message: "Server and frontend connection working.",
    hasNvidiaKey: Boolean(process.env.NVIDIA_API_KEY),
    singleModel: getSingleModel()
  });
});

app.get("/health", (req, res) => {
  res.json({ ok: true, app: "Linux Single Model All In One", version: "18.0.0" });
});

app.post("/api/generate", async (req, res) => {
  try {
    const { day, command, environment, visualStyle, depth, voiceLength, voiceCoverage, errorStyle, voiceEmotion, psychologyFocus, extra } = req.body;

    if (!process.env.NVIDIA_API_KEY) {
      return res.status(500).json({
        error: "NVIDIA_API_KEY is missing.",
        details: "Open Render > your Web Service > Environment > Add NVIDIA_API_KEY. Then redeploy."
      });
    }

    if (!day || !command) {
      return res.status(400).json({ error: "Day number and Linux command/topic are required." });
    }

    const prompt = `
Return tagged content only. No JSON. No markdown fences.

You are acting as all specialists together:
1. Viral short-form tech reel planner
2. Deep Linux teacher
3. Native Telugu voiceover writer
4. Viewer psychology and retention reviewer
5. Final correction editor

Return ALL tags:
<video_title>...</video_title>
<hooks>...</hooks>
<full_voiceover>...</full_voiceover>
<section_wise_voiceover>...</section_wise_voiceover>
<visual_style>...</visual_style>
<edit_timeline>...</edit_timeline>
<requirements>...</requirements>
<termux_commands>...</termux_commands>
<ubuntu_commands>...</ubuntu_commands>
<main_examples>...</main_examples>
<deep_explanation>...</deep_explanation>
<deep_learning_guide>...</deep_learning_guide>
<errors_fixes>...</errors_fixes>
<practice_task>...</practice_task>
<mini_quiz>...</mini_quiz>
<caption>...</caption>
<hashtags>...</hashtags>
<psychology_notes>...</psychology_notes>
<safety_note>...</safety_note>

Inputs:
day: ${day}
command: ${command}
environment: ${environment}
visual style: ${visualStyle}
learning depth: ${depth}
video length: ${voiceLength}
voiceover coverage: ${voiceCoverage}
error style: ${errorStyle}
native Telugu style: ${voiceEmotion}
psychology review focus: ${psychologyFocus}
extra: ${extra || "No extra instruction"}

Global rules:
- No JSON.
- No markdown fences.
- Use exact tags.
- Do not add extra text outside tags.
- Avoid repetition.
- Be accurate.
- Make content beginner-friendly.

Video planning rules:
- video_title: English only.
- hooks: exactly three English bullet lines.
- visual_style: dark grid, neon green/white text, dotted arrows, Linux icon, terminal screen recording, zoom on output.
- edit_timeline: English only, timed visual actions from hook to CTA.
- Do not copy watermark, exact music, or original assets.

Voiceover rules:
- full_voiceover must cover the full video: hook, command meaning, deep concept, terminal demo, output meaning, error/confusion fix, practice task, mini quiz style question, CTA.
- Telugu script + natural English tech words.
- Native Telugu creator style, not textbook Telugu.
- Do not use Roman Telugu.
- Do not use full formal Telugu.
- Use command, terminal, folder, path, output, error, fix, install, package, type, Enter, work.
- Avoid formal words like ఆదేశం, సంచయం, దోషం, కార్యనిర్వహణ.
- No repeated sentence or idea.
- Use [soft background music], [warm tone], [short pause], [pause], [surprised], [calm tone], [confident], [motivational tone].
- No direct digits in spoken lines.
- Commands stay exact, for example \`${command}\`.
- Include an error/confusion fix moment.
- End with a short motivational follow CTA.

Section-wise voiceover:
- Make separate bullet lines for Hook, Concept, Terminal demo, Output, Error fix, Practice, CTA.
- Telugu script + English tech words.

Deep learning rules:
- English only for deep_explanation and deep_learning_guide.
- deep_explanation must include purpose, syntax, how it works, output meaning, flags/options if any, use cases, not-use cases, beginner mistakes, related commands, safe examples, real project use.
- deep_learning_guide must include mental model, analogy, step-by-step understanding, memory trick, common misconception, how to practice.
- mini_quiz must include three quick questions with answers.
- errors_fixes must use realistic errors/confusions only.
- If no package needed, say "- No extra package required."
- If no install command needed, say "- None required."
- For risky commands use safe demo folder only.

Psychology review rules:
- Improve first three seconds.
- Improve curiosity and retention.
- Reduce beginner fear.
- Make error fix feel calm and simple.
- Make CTA natural.
- Remove weak/repeated lines.
`;

    const reviewed = await callNvidia(prompt, 5200, 0.25);
    const output = formatOutput(reviewed);
    res.json({ output });
  } catch (error) {
    res.status(500).json({ error: "Server error.", details: error.message });
  }
});

app.listen(PORT, () => console.log(`Single-model all-in-one app running on port ${PORT}`));
