import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 10000;

app.use(express.json({ limit: "1mb" }));

const commands = [
  "pwd","ls","cd","mkdir","touch","cat","cp","mv","rm","chmod",
  "chown","git","curl","wget","grep","find","ps","top","kill",
  "df","du","free","uname","tar","zip/unzip","bash script"
];

function getModel() {
  return process.env.MODEL_ALL ||
         process.env.NIM_MODEL ||
         "meta/llama-3.3-70b-instruct";
}

function getTag(text, tag, fallback = "") {
  const regex = new RegExp(`<${tag}>\\s*([\\s\\S]*?)\\s*</${tag}>`, "i");
  const match = text.match(regex);
  return match ? match[1].trim() : fallback;
}

async function callModel(prompt, maxTokens = 5200, temperature = 0.24) {
  const model = getModel();

  const response = await fetch(
    "https://integrate.api.nvidia.com/v1/chat/completions",
    {
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
            content:
              "Return tagged content only. Do not return JSON. Do not use markdown fences. " +
              "Follow every requested tag. Be accurate, natural, non-repetitive, and beginner-friendly."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: maxTokens,
        temperature
      })
    }
  );

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`${model} failed with HTTP ${response.status}: ${details}`);
  }

  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content;

  if (!content || !content.trim()) {
    throw new Error(`${model} returned an empty response.`);
  }

  return content;
}

function formatOutput(raw) {
  const model = getModel();

  return `0. MODEL USED FOR EVERYTHING
${model}

This one model performs:
- Reel planning
- Deep Linux teaching
- Full native Telugu voiceover writing
- Error and fix explanation
- Viewer psychology review
- Final correction

1. VIDEO TITLE
${getTag(raw, "video_title", "\"Linux Command Tutorial\"")}

2. 3 HOOK OPTIONS
${getTag(raw, "hooks", "- Learn this command clearly.\n- Avoid beginner confusion.\n- Practice Linux visually.")}

3. FULL VIDEO VOICEOVER SCRIPT
${getTag(raw, "full_voiceover", "[warm tone]\nఈ రోజు మనం Linux command ని clear గా నేర్చుకుందాం. [pause]")}

4. SECTION-WISE VOICEOVER BREAKDOWN
${getTag(raw, "section_wise_voiceover", "- Hook\n- Concept\n- Terminal demo\n- Error fix\n- Practice\n- CTA")}

5. REFERENCE REEL VISUAL STYLE
${getTag(raw, "visual_style", "- Dark grid background\n- Neon green and white text\n- Terminal recording with zoom")}

6. REFERENCE STYLE EDIT TIMELINE
${getTag(raw, "edit_timeline", "- 0s-3s: Hook\n- 3s-20s: Explanation\n- 20s-45s: Demo and fix\n- End: CTA")}

7. REQUIREMENTS
${getTag(raw, "requirements", "- No extra package required.")}

8. TERMUX INSTALL COMMANDS
${getTag(raw, "termux_commands", "- None required.")}

9. UBUNTU/DEBIAN INSTALL COMMANDS
${getTag(raw, "ubuntu_commands", "- None required.")}

10. MAIN COMMAND EXAMPLES
${getTag(raw, "main_examples", "- command")}

11. DEEP COMMAND EXPLANATION
${getTag(raw, "deep_explanation", "Purpose, syntax, output, use cases, mistakes, and safe examples.")}

12. DEEP LEARNING GUIDE
${getTag(raw, "deep_learning_guide", "- Mental model\n- Analogy\n- Memory trick\n- Practice method")}

13. COMMON ERRORS AND FIXES
${getTag(raw, "errors_fixes", "- No common installation error for this command.")}

14. PRACTICE TASK
${getTag(raw, "practice_task", "- Run the command.\n- Observe the output.\n- Explain what it means.")}

15. MINI QUIZ FOR VIEWERS
${getTag(raw, "mini_quiz", "- Question: What does this command do?\n  Answer: Review the explanation above.")}

16. INSTAGRAM CAPTION
${getTag(raw, "caption", "Linux basics challenge — learn one command through real practice.")}

17. HASHTAGS
${getTag(raw, "hashtags", "#Linux #Termux #LinuxForBeginners")}

18. PSYCHOLOGY REVIEW NOTES
${getTag(raw, "psychology_notes", "- Hook improved\n- Repetition removed\n- Beginner confidence supported\n- CTA made natural")}

19. SAFETY NOTE
${getTag(raw, "safety_note", "Understand every command before running it.")}`;
}

const html = `<!DOCTYPE html>
<html lang="te">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
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
.secondary{width:100%;margin-top:10px;background:#1b2638;color:#dceaff;border:1px solid #33425a}
.copy{width:auto;margin:0}
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
<h1>One Stable Model for Everything</h1>
<p class="sub">Uses only <b>meta/llama-3.3-70b-instruct</b> for the reel plan, deep Linux explanation, full native Telugu voiceover, psychology review, and final correction.</p>
</section>

<section class="grid">
<section class="card">
<label>Day number</label>
<input id="day" value="1">

<label>Linux command or topic</label>
<input id="command" value="pwd" placeholder="pwd, ls, cd, git, curl...">

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

<label>Psychology focus</label>
<select id="psychologyFocus">
<option>Retention + curiosity + clarity</option>
<option>Beginner confidence + motivation</option>
<option>Fast hook + emotional payoff</option>
<option>Error anxiety reduction + trust building</option>
</select>

<label>Extra instruction</label>
<textarea id="extra" placeholder="Example: Teach deeply, cover every visual step, and avoid repeated lines."></textarea>

<button type="button" class="primary" id="generateBtn">Generate With One Model</button>
<button type="button" class="secondary" id="testBtn">Test Single Model Setup</button>

<div class="status" id="statusBox">Status: Page loaded. Click Test or Generate.</div>
<div class="note"><b>No fallback chain:</b> This app calls only one model.</div>
<p class="small">Render: NVIDIA_API_KEY and MODEL_ALL=meta/llama-3.3-70b-instruct</p>
</section>

<section class="output">
<div class="head">
<h2>Generated Output</h2>
<button type="button" class="secondary copy" id="copyBtn">Copy</button>
</div>
<pre id="output">Click Generate. Your full single-model output will appear here.</pre>
</section>
</section>
</main>

<script>
(function(){
  const commands = ${JSON.stringify(commands)};
  const $ = id => document.getElementById(id);
  const output = $("output");
  const status = $("statusBox");

  function setStatus(message){
    status.textContent = "Status: " + message;
  }

  function setOutput(message){
    output.textContent = message;
  }

  commands.forEach(command => {
    const button = document.createElement("span");
    button.className = "pill";
    button.textContent = command;
    button.addEventListener("click", () => {
      $("command").value = command;
    });
    $("pills").appendChild(button);
  });

  $("testBtn").addEventListener("click", async () => {
    setStatus("Testing server and single model configuration...");
    setOutput("Testing /api/test ...");

    try {
      const response = await fetch("/api/test");
      const data = await response.json();
      setOutput(JSON.stringify(data, null, 2));
      setStatus(response.ok ? "Single model setup is connected." : "Test returned an error.");
    } catch (error) {
      setOutput("Test failed:\\n" + error.stack);
      setStatus("Test failed: " + error.message);
    }
  });

  $("generateBtn").addEventListener("click", async () => {
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

    setStatus("Sending one request to the selected model...");
    setOutput(
      "Generating with one model...\\n\\n" +
      "Creating reel plan...\\n" +
      "Writing deep explanation...\\n" +
      "Writing full native Telugu voiceover...\\n" +
      "Checking viewer psychology and repetition...\\n\\n" +
      "Please wait."
    );

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        setOutput(
          "Error:\\n" + (data.error || "Request failed") +
          "\\n\\nDetails:\\n" + (data.details || "")
        );
        setStatus("Generation failed.");
        return;
      }

      setOutput(data.output || "No output returned.");
      setStatus("Generation completed.");
    } catch (error) {
      setOutput("Browser request failed:\\n" + error.stack);
      setStatus("Browser request failed: " + error.message);
    }
  });

  $("copyBtn").addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(output.textContent);
      $("copyBtn").textContent = "Copied";
      setStatus("Output copied.");
      setTimeout(() => $("copyBtn").textContent = "Copy", 1200);
    } catch (error) {
      setStatus("Copy failed: " + error.message);
    }
  });

  setStatus("JavaScript loaded. Single-model buttons are ready.");
})();
</script>
</body>
</html>`;

app.get("/", (req, res) => {
  res.type("html").send(html);
});

app.get("/health", (req, res) => {
  res.json({
    ok: true,
    app: "Linux Single Llama Model Generator",
    version: "20.0.0"
  });
});

app.get("/api/test", (req, res) => {
  res.json({
    ok: true,
    message: "Server and frontend connection working.",
    hasNvidiaKey: Boolean(process.env.NVIDIA_API_KEY),
    singleModel: getModel(),
    fallbackEnabled: false
  });
});

app.post("/api/generate", async (req, res) => {
  try {
    const {
      day,
      command,
      environment,
      visualStyle,
      depth,
      voiceLength,
      voiceCoverage,
      errorStyle,
      voiceEmotion,
      psychologyFocus,
      extra
    } = req.body;

    if (!process.env.NVIDIA_API_KEY) {
      return res.status(500).json({
        error: "NVIDIA_API_KEY is missing.",
        details:
          "Open Render > your Web Service > Environment. Add NVIDIA_API_KEY, save, and redeploy."
      });
    }

    if (!day || !command) {
      return res.status(400).json({
        error: "Day number and Linux command/topic are required."
      });
    }
