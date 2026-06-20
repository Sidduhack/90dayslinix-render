import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 10000;
app.use(express.json({ limit: "1mb" }));

const commands = ["pwd","ls","cd","mkdir","touch","cat","cp","mv","rm","chmod","chown","git","curl","wget","grep","find","ps","top","kill","df","du","free","uname","tar","zip/unzip","bash script"];

function getN8nWebhookUrl() {
  return process.env.N8N_WEBHOOK_URL || "";
}

function getN8nSecret() {
  return process.env.N8N_WEBHOOK_SECRET || "";
}

async function callN8n(payload) {
  const url = getN8nWebhookUrl();

  if (!url) {
    throw new Error("N8N_WEBHOOK_URL is missing.");
  }

  const headers = {
    "Content-Type": "application/json"
  };

  if (getN8nSecret()) {
    headers["x-webhook-secret"] = getN8nSecret();
  }

  const response = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(payload)
  });

  const text = await response.text();
  let data;

  try {
    data = JSON.parse(text);
  } catch {
    throw new Error(`n8n returned non-JSON response (HTTP ${response.status}): ${text.slice(0, 1000)}`);
  }

  if (!response.ok) {
    throw new Error(data?.details || data?.error || `n8n webhook failed with HTTP ${response.status}`);
  }

  return data;
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
<h1>n8n Automated Script + ElevenLabs Voiceover</h1>
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
<p class="small">Render vars: N8N_WEBHOOK_URL and N8N_WEBHOOK_SECRET. Keep AI and ElevenLabs keys only inside n8n.</p>
</section>

<section class="output">
<div class="head"><h2>Generated Output</h2><button type="button" class="secondary" id="copyBtn">Copy</button></div>
<pre id="output">Click Generate. n8n will return the script and ElevenLabs audio here.</pre>
<div id="audioBox" style="display:none;margin-top:14px;">
  <h3>Generated ElevenLabs Voiceover</h3>
  <audio id="audioPlayer" controls style="width:100%;"></audio>
  <a id="audioDownload" href="#" download="linux-voiceover.mp3"
     style="display:inline-block;margin-top:10px;color:#9ed0ff;font-weight:700;">
     Download MP3
  </a>
</div>
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

    setStatus("Generate clicked. Sending request to n8n automation...");
    setOutput("Running n8n automation...\\n\\nGenerating script...\\nExtracting native Telugu voiceover...\\nCreating ElevenLabs MP3...\\nReturning the result to the website...\\n\\nPlease wait.");

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

      setOutput(data.output || data.script || "No script returned from n8n.");

      const audioBox = $("audioBox");
      const audioPlayer = $("audioPlayer");
      const audioDownload = $("audioDownload");

      let audioSource = "";

      if (data.audioUrl) {
        audioSource = data.audioUrl;
      } else if (data.audioBase64) {
        const mime = data.audioMimeType || "audio/mpeg";
        audioSource = `data:${mime};base64,${data.audioBase64}`;
      }

      if (audioSource) {
        audioPlayer.src = audioSource;
        audioDownload.href = audioSource;
        audioBox.style.display = "block";
      } else {
        audioPlayer.removeAttribute("src");
        audioDownload.href = "#";
        audioBox.style.display = "none";
      }

      setStatus("n8n automation completed.");
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

app.get("/api/test", async (req, res) => {
  try {
    const result = await callN8n({
      action: "test",
      source: "render-website"
    });

    res.json({
      ok: true,
      message: "Website successfully reached the n8n webhook.",
      n8n: result
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error: "n8n connection test failed.",
      details: error.message,
      configuredWebhook: Boolean(getN8nWebhookUrl()),
      configuredSecret: Boolean(getN8nSecret())
    });
  }
});

app.get("/health", (req, res) => {
  res.json({ ok: true, app: "Linux n8n ElevenLabs Bridge", version: "22.0.0" });
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

    if (!day || !command) {
      return res.status(400).json({
        error: "Day number and Linux command/topic are required."
      });
    }

    const result = await callN8n({
      action: "generate",
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
      extra,
      requestedOutputs: {
        script: true,
        voiceoverText: true,
        audio: true
      }
    });

    res.json(result);

  } catch (error) {
    res.status(500).json({
      error: "n8n automation failed.",
      details: error.message
    });
  }
});

app.listen(PORT, () => console.log(`Single-model all-in-one app running on port ${PORT}`));
