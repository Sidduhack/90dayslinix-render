import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 10000;

app.use(express.json({ limit: "2mb" }));

const commandSuggestions = [
  "pwd", "ls", "cd", "mkdir", "touch", "cat", "cp", "mv", "rm",
  "chmod", "grep", "find", "ps", "top", "kill", "df", "du",
  "free", "uname", "curl", "wget", "tar", "zip", "bash"
];

function getModel() {
  return process.env.MODEL_ALL ||
    process.env.NIM_MODEL ||
    "meta/llama-3.3-70b-instruct";
}

function makeVoiceoverNatural(script) {
  const replacements = [
    [/సరళంగా/g, "simple గా"],
    [/సరళమైన/g, "simple"],
    [/సరళం/g, "simple"],

    [/ధృవీకరించండి/g, "check చేయండి"],
    [/ధృవీకరించి/g, "check చేసి"],
    [/ధృవీకరణ/g, "check"],

    [/సృష్టించండి/g, "create చేయండి"],
    [/సృష్టించి/g, "create చేసి"],
    [/సృష్టించిన/g, "create చేసిన"],
    [/సృష్టించడం/g, "create చేయడం"],
    [/సృష్టించాలి/g, "create చేయాలి"],

    [/రూపొందించండి/g, "create చేయండి"],
    [/రూపొందించి/g, "create చేసి"],

    [/అమలు చేయండి/g, "run చేయండి"],
    [/అమలు చేసి/g, "run చేసి"],
    [/అమలు చేయడం/g, "run చేయడం"],

    [/నిర్ధారించండి/g, "check చేయండి"],
    [/నిర్ధారించి/g, "check చేసి"],

    [/వినియోగించండి/g, "use చేయండి"],
    [/వినియోగించి/g, "use చేసి"],

    [/ఆదేశాన్ని/g, "command ని"],
    [/ఆదేశాలు/g, "commands"],
    [/ఆదేశం/g, "command"],

    [/దోషాన్ని/g, "error ని"],
    [/దోషాలు/g, "errors"],
    [/దోషం/g, "error"],

    [/ఫలితాన్ని/g, "output ని"],
    [/ఫలితం/g, "output"],

    [/మార్గాన్ని/g, "path ని"],
    [/మార్గం/g, "path"],

    [/నిర్దేశిక/g, "directory"],
    [/దస్త్రం/g, "file"],
    [/అనుమతి/g, "permission"],
    [/వ్యవస్థ/g, "system"],

    [/ప్రదర్శిస్తుంది/g, "చూపిస్తుంది"],
    [/ప్రదర్శించబడుతుంది/g, "కనిపిస్తుంది"],
    [/నమోదు చేయండి/g, "type చేయండి"],
    [/నొక్కండి/g, "press చేయండి"],

    [/కార్యనిర్వహణ/g, "run చేయడం"],
    [/కార్యాచరణ/g, "process"],

    [/అభినందనలు/g, "చాలా బాగుంది"],
    [/శుభాకాంక్షలు/g, "all the best"],
    [/విజయవంతంగా/g, "successfully"],

    [/పరిశీలించండి/g, "check చేయండి"],
    [/ప్రయత్నించండి/g, "try చేయండి"],
    [/గమనించండి/g, "observe చేయండి"],

    [/విధానాలు/g, "ways"],
    [/విధానం/g, "way"],
    [/ఉదాహరణలు/g, "examples"],
    [/ఉదాహరణ/g, "example"]
  ];

  let result = String(script || "");

  for (const [pattern, replacement] of replacements) {
    result = result.replace(pattern, replacement);
  }

  return result
    .replace(/[ \t]{2,}/g, " ")
    .replace(/ *\n */g, "\n")
    .trim();
}

function stripFences(text) {
  return String(text || "")
    .replace(/^```(?:text|markdown|json)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
}

function getTag(content, name, fallback = "") {
  const match = String(content || "").match(
    new RegExp(`<${name}>\\s*([\\s\\S]*?)\\s*</${name}>`, "i")
  );
  return match ? stripFences(match[1]) : fallback;
}

function parseThirteenSections(raw) {
  const content = stripFences(raw);

  return {
    videoTitle: getTag(content, "video_title"),
    hooks: getTag(content, "hooks"),
    voiceover: makeVoiceoverNatural(getTag(content, "voiceover")),
    screenTimeline: getTag(content, "screen_timeline"),
    requirements: getTag(content, "requirements"),
    termuxInstall: getTag(content, "termux_install"),
    ubuntuInstall: getTag(content, "ubuntu_install"),
    mainExamples: getTag(content, "main_examples"),
    useCases: getTag(content, "use_cases"),
    practiceTask: getTag(content, "practice_task"),
    instagramCaption: getTag(content, "instagram_caption"),
    hashtags: getTag(content, "hashtags"),
    safetyNote: getTag(content, "safety_note")
  };
}

function validateSections(sections) {
  const missing = Object.entries(sections)
    .filter(([, value]) => !String(value || "").trim())
    .map(([key]) => key);

  if (missing.length) {
    throw new Error(
      "AI response missed required sections: " + missing.join(", ")
    );
  }
}

function maxTokensForDeepGuide() {
  return 5200;
}

async function callNvidia(prompt, maxTokens) {
  const apiKey = process.env.NVIDIA_API_KEY;

  if (!apiKey) {
    throw new Error(
      "NVIDIA_API_KEY is missing. Add it in Render Environment and redeploy."
    );
  }

  const response = await fetch(
    "https://integrate.api.nvidia.com/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({
        model: getModel(),
        messages: [
          {
            role: "system",
            content:
              "You create technically accurate, comprehensive thirteen-section Linux " +
              "command guides. The user may provide only one command name, such " +
              "as pwd. You must automatically identify the command type, default " +
              "behavior, built-in or package status, valid common options, logical " +
              "and physical behavior where relevant, related shell variables, " +
              "safe examples, and real use cases. Never invent flags or behavior. " +
              "The voiceover must use everyday spoken Telugu mixed with familiar " +
              "English tech words. Avoid formal Telugu words such as సరళం, " +
              "ధృవీకరించండి, సృష్టించి, అమలు చేయండి, నిర్ధారించండి, " +
              "ఆదేశం, దోషం, ఫలితం, మార్గం, అభినందనలు, శుభాకాంక్షలు, " +
              "పరిశీలించండి, or విధానం. Do not include a troubleshooting or " +
              "error-handling section. There is no time limit: explain all important " +
              "valid forms and practical uses fully. Return only the exact XML-style " +
              "tags requested by the user. No JSON, analysis, notes, or Markdown fences."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.28,
        top_p: 0.78,
        max_tokens: maxTokens,
        stream: false
      })
    }
  );

  const rawText = await response.text();

  if (!response.ok) {
    throw new Error(
      `NVIDIA API failed with HTTP ${response.status}: ${rawText.slice(0, 1200)}`
    );
  }

  let data;
  try {
    data = JSON.parse(rawText);
  } catch {
    throw new Error("NVIDIA returned an invalid JSON response.");
  }

  return data?.choices?.[0]?.message?.content || "";
}

const html = `<!DOCTYPE html>
<html lang="te">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>Linux Deep Command Guide Generator</title>
<style>
:root{
  color-scheme:dark;
  --bg:#060a11;
  --panel:#101827;
  --panel2:#080e18;
  --border:#2b3a52;
  --text:#f5f8ff;
  --muted:#9cabc1;
  --blue:#48b0ff;
  --violet:#866cff;
  --green:#61e9aa;
}
*{box-sizing:border-box}
body{
  margin:0;
  background:
    radial-gradient(circle at 10% 0%,rgba(72,176,255,.12),transparent 28%),
    radial-gradient(circle at 90% 8%,rgba(134,108,255,.10),transparent 28%),
    var(--bg);
  color:var(--text);
  font-family:Arial,"Noto Sans Telugu",sans-serif;
}
main{width:min(1220px,94%);margin:auto;padding:28px 0 60px}
.hero{text-align:center;margin-bottom:22px}
.badge{
  display:inline-block;padding:8px 14px;border-radius:999px;
  border:1px solid #31516f;background:#10243a;color:#b2dcff;
  font-weight:800;font-size:14px
}
h1{font-size:clamp(30px,7vw,52px);margin:14px 0 8px}
.sub{max-width:900px;margin:auto;color:var(--muted);line-height:1.65}
.layout{display:grid;grid-template-columns:1fr;gap:18px}
@media(min-width:960px){
  .layout{grid-template-columns:390px 1fr;align-items:start}
  .controls{position:sticky;top:16px}
}
.card,.section{
  background:rgba(16,24,39,.96);
  border:1px solid var(--border);
  border-radius:19px;
  box-shadow:0 18px 50px rgba(0,0,0,.30)
}
.controls{padding:19px}
label{display:block;margin:14px 0 7px;font-weight:800;color:#dce7f8}
input,select,textarea{
  width:100%;padding:13px 14px;border-radius:12px;
  border:1px solid #344b68;background:#0a1220;color:#fff;
  font:inherit;outline:none
}
textarea{min-height:105px;resize:vertical}
input:focus,select:focus,textarea:focus{border-color:var(--blue)}
.pills{display:flex;flex-wrap:wrap;gap:7px;margin-top:10px}
.pill{
  padding:7px 10px;border-radius:999px;border:1px solid #33475f;
  background:#111e30;color:#dceaff;cursor:pointer;font-size:13px
}
button{
  border:0;border-radius:12px;padding:13px 16px;
  font-weight:900;font-size:15px;cursor:pointer
}
.primary{
  width:100%;margin-top:17px;color:#04101b;
  background:linear-gradient(135deg,var(--blue),var(--violet))
}
.secondary{
  background:#18263b;color:#e7f0ff;border:1px solid #354b66
}
.primary:disabled{opacity:.6;cursor:not-allowed}
.status{
  margin-top:12px;padding:12px;border-radius:12px;
  background:#0a1220;border:1px solid #33465e;
  color:#dbe8fa;line-height:1.5;font-size:14px
}
.note{
  margin-top:12px;padding:12px;border-radius:12px;
  border-left:4px solid var(--green);
  background:rgba(97,233,170,.08);color:#d8ffed;
  line-height:1.55;font-size:14px
}
.outputToolbar{
  display:flex;justify-content:space-between;align-items:center;
  gap:10px;margin-bottom:12px
}
.outputToolbar h2{margin:0}
.outputList{display:grid;gap:14px}
.section{padding:17px}
.sectionHead{
  display:flex;justify-content:space-between;align-items:center;
  gap:12px;margin-bottom:10px
}
.section h3{margin:0;font-size:18px}
.num{
  display:inline-grid;place-items:center;width:29px;height:29px;
  margin-right:8px;border-radius:9px;
  background:#172c45;color:#9fd6ff;font-size:14px
}
.section pre{
  margin:0;padding:15px;border-radius:13px;
  border:1px solid #26364d;background:var(--panel2);
  white-space:pre-wrap;word-break:break-word;
  color:#edf5ff;font:15.5px/1.75 Arial,"Noto Sans Telugu",sans-serif;
  min-height:72px
}
.voice pre{font-size:16.5px;line-height:1.9}
.copySmall{padding:8px 11px;font-size:13px}
.small{color:var(--muted);font-size:13px;line-height:1.5}
code{color:#a9d9ff}
</style>
</head>
<body>
<main>
  <section class="hero">
    <span class="badge">90 Days Linux Basics Challenge</span>
    <h1>Deep Linux Command Guide</h1>
    <p class="sub">
      Enter only a command such as <code>pwd</code>. The model automatically
      finds its valid options, command forms, path behavior, related variables,
      practical uses, and explains them fully in all thirteen sections.
    </p>
  </section>

  <section class="layout">
    <aside class="card controls">
      <label for="day">Day number</label>
      <input id="day" value="1"/>

      <label for="command">Linux command or topic</label>
      <input id="command" value="pwd" placeholder="pwd, ls, cd, mkdir..."/>
      <div class="pills" id="pills"></div>

      <label for="environment">Environment</label>
      <select id="environment">
        <option>Termux on Android</option>
        <option>Ubuntu/Debian Linux</option>
        <option>Both Termux and Ubuntu/Debian</option>
      </select>


      <label for="delivery">Voice style</label>
      <select id="delivery">
        <option>Confident and friendly Telugu tech guide</option>
        <option>Calm beginner-friendly Telugu teacher</option>
        <option>Curious and satisfying Telugu explainer</option>
        <option>Fast Instagram Telugu tech creator</option>
      </select>

      <label for="extra">Extra instruction</label>
      <textarea id="extra"
        placeholder="Example: Explain more real-life uses, but keep the voiceover natural."></textarea>

      <button class="primary" id="generateBtn" type="button">
        Generate Full Command Guide
      </button>

      <button class="secondary" id="testBtn" type="button"
        style="width:100%;margin-top:10px">
        Test API Connection
      </button>

      <div class="status" id="status">Status: Ready.</div>

      <div class="note">
        No time limit is applied. The model should explain the complete command,
        including every important valid form and practical use.
      </div>

      <p class="small">
        Required Render variable: <code>NVIDIA_API_KEY</code>
      </p>
    </aside>

    <section>
      <div class="outputToolbar">
        <h2>Generated Content</h2>
        <button class="secondary" id="copyAllBtn" type="button">Copy All</button>
      </div>
      <div class="outputList" id="outputList"></div>
    </section>
  </section>
</main>

<script>
(() => {
  const suggestions = ${JSON.stringify(commandSuggestions)};
  const sectionConfig = [
    ["videoTitle", "Video Title"],
    ["hooks", "Three Hook Options"],
    ["voiceover", "Full Voiceover Script"],
    ["screenTimeline", "Screen-Recording Timeline"],
    ["requirements", "Requirements"],
    ["termuxInstall", "Termux Install Commands"],
    ["ubuntuInstall", "Ubuntu/Debian Install Commands"],
    ["mainExamples", "Main Command Examples"],
    ["useCases", "Different Ways to Use the Command"],
    ["practiceTask", "Practice Task"],
    ["instagramCaption", "Instagram Caption"],
    ["hashtags", "Hashtags"],
    ["safetyNote", "Safety Note"]
  ];

  const byId = id => document.getElementById(id);
  const outputList = byId("outputList");
  const generateBtn = byId("generateBtn");
  const status = byId("status");
  let latestData = {};

  function setStatus(message) {
    status.textContent = "Status: " + message;
  }

  function renderSections(data = {}) {
    outputList.innerHTML = "";

    sectionConfig.forEach(([key, title], index) => {
      const wrapper = document.createElement("article");
      wrapper.className = "section" + (key === "voiceover" ? " voice" : "");

      const head = document.createElement("div");
      head.className = "sectionHead";

      const heading = document.createElement("h3");
      heading.innerHTML =
        '<span class="num">' + (index + 1) + "</span>" + title;

      const copy = document.createElement("button");
      copy.type = "button";
      copy.className = "secondary copySmall";
      copy.textContent = "Copy";
      copy.addEventListener("click", async () => {
        await navigator.clipboard.writeText(data[key] || "");
        copy.textContent = "Copied";
        setTimeout(() => copy.textContent = "Copy", 1000);
      });

      const pre = document.createElement("pre");
      pre.textContent = data[key] || "Waiting for generation...";

      head.appendChild(heading);
      head.appendChild(copy);
      wrapper.appendChild(head);
      wrapper.appendChild(pre);
      outputList.appendChild(wrapper);
    });
  }

  suggestions.forEach(command => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "pill";
    button.textContent = command;
    button.addEventListener("click", () => {
      byId("command").value = command;
    });
    byId("pills").appendChild(button);
  });

  renderSections();

  byId("testBtn").addEventListener("click", async () => {
    setStatus("Testing API configuration...");
    try {
      const response = await fetch("/api/test");
      const data = await response.json();
      latestData = {
        videoTitle: JSON.stringify(data, null, 2)
      };
      renderSections(latestData);
      setStatus(response.ok ? "Connection test completed." : "Connection test failed.");
    } catch (error) {
      latestData = {videoTitle: "Test failed:\\n" + error.message};
      renderSections(latestData);
      setStatus("Connection test failed.");
    }
  });

  generateBtn.addEventListener("click", async () => {
    const payload = {
      day: byId("day").value.trim(),
      command: byId("command").value.trim(),
      environment: byId("environment").value,
      delivery: byId("delivery").value,
      extra: byId("extra").value.trim()
    };

    if (!payload.day || !payload.command) {
      setStatus("Enter day number and command.");
      return;
    }

    generateBtn.disabled = true;
    setStatus("Building the full command guide...");
    renderSections({
      videoTitle: "Generating...",
      hooks: "Writing three hooks...",
      voiceover: "Writing the natural Telugu voiceover...",
      screenTimeline: "Planning the recording...",
      requirements: "Checking requirements...",
      termuxInstall: "Checking Termux installation...",
      ubuntuInstall: "Checking Ubuntu/Debian installation...",
      mainExamples: "Building safe examples...",
      useCases: "Adding multiple practical ways...",
      practiceTask: "Creating a practice task...",
      instagramCaption: "Writing the caption...",
      hashtags: "Selecting hashtags...",
      safetyNote: "Adding a safety note..."
    });

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        renderSections({
          videoTitle:
            "Generation failed:\\n" +
            (data.error || "") +
            "\\n\\n" +
            (data.details || "")
        });
        setStatus("Generation failed.");
        return;
      }

      latestData = data.sections;
      renderSections(latestData);
      setStatus("Full command guide generated.");
    } catch (error) {
      renderSections({
        videoTitle: "Browser request failed:\\n" + error.message
      });
      setStatus("Browser request failed.");
    } finally {
      generateBtn.disabled = false;
    }
  });

  byId("copyAllBtn").addEventListener("click", async () => {
    const text = sectionConfig.map(([key, title], index) => {
      return (index + 1) + ". " + title.toUpperCase() +
        "\\n" + (latestData[key] || "");
    }).join("\\n\\n");

    await navigator.clipboard.writeText(text);
    byId("copyAllBtn").textContent = "Copied";
    setStatus("All thirteen sections copied.");
    setTimeout(() => {
      byId("copyAllBtn").textContent = "Copy All";
    }, 1200);
  });
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
    app: "Linux Auto Deep Command Guide",
    version: "28.0.0"
  });
});

app.get("/api/test", (req, res) => {
  res.json({
    ok: true,
    server: "working",
    hasNvidiaKey: Boolean(process.env.NVIDIA_API_KEY),
    model: getModel(),
    format: "13-sections-deep-auto"
  });
});

app.post("/api/generate", async (req, res) => {
  try {
    const {
      day,
      command,
      environment,
      delivery,
      extra
    } = req.body || {};

    if (!day || !command) {
      return res.status(400).json({
        error: "Day number and Linux command/topic are required."
      });
    }

    const prompt = `
Create a complete thirteen-section Linux learning and Instagram Reel plan.

INPUT
Day: ${day}
Command/topic: ${command}
Environment: ${environment || "Termux on Android"}
Voice delivery: ${delivery || "Confident and friendly Telugu tech guide"}
Depth: Full command guide with no time limit
Extra instruction: ${extra || "None"}

AUTOMATIC COMMAND DISCOVERY
The user may give only the command name. Do not ask for its flags or variants.
Automatically research the command from your Linux knowledge and explain:

- What kind of command it is: shell built-in, core utility, or package command.
- Its default form and exact default behavior.
- Every important, valid, commonly useful option or form.
- Differences between similar forms.
- Related shell variables or standard alternatives when directly relevant.
- Logical versus physical path behavior when the command works with paths.
- What each output value means.
- Practical use in Termux, Ubuntu/Debian, and shell scripts when applicable.
- Safe copyable examples for every important form.
- Which forms are common and which are advanced.
- Important limitations or platform differences.
- Do not invent unsupported flags merely to increase the number of examples.

SPECIAL PATH RULE
For path-related commands, explain path concepts completely:
- absolute path
- relative path
- current working directory
- home directory
- logical path
- physical path
- symbolic links
- environment variables such as $PWD and $OLDPWD when relevant
- how the command behaves after cd or through a symbolic link

For pwd specifically, the guide must automatically explain at least:
- pwd
- pwd -L
- pwd -P
- the difference between logical and physical paths
- how symbolic links affect the result
- $PWD and echo "$PWD"
- using current_path=$(pwd)
- safe practical demonstrations with a symbolic link
- no extra package required in normal Termux and Ubuntu/Debian shells

RETURN EXACTLY THESE TAGS AND NOTHING ELSE

<video_title>
...
</video_title>

<hooks>
...
</hooks>

<voiceover>
...
</voiceover>

<screen_timeline>
...
</screen_timeline>

<requirements>
...
</requirements>

<termux_install>
...
</termux_install>

<ubuntu_install>
...
</ubuntu_install>

<main_examples>
...
</main_examples>

<use_cases>
...
</use_cases>

<practice_task>
...
</practice_task>

<instagram_caption>
...
</instagram_caption>

<hashtags>
...
</hashtags>

<safety_note>
...
</safety_note>

SECTION RULES

1. VIDEO TITLE
- Give one clear, clickable English title.
- Mention the command and beginner value.
- Do not use exaggerated clickbait.

2. THREE HOOK OPTIONS
- Give exactly three short English hook options.
- Each hook must work in the first three seconds.
- Keep each hook on a separate line.

3. FULL VOICEOVER SCRIPT
- Write one continuous, paste-ready ElevenLabs voiceover.
- Use native Telugu script mixed with familiar English tech words.
- Do not use Roman Telugu.
- Do not use formal textbook Telugu.
- Never use words such as:
  సరళం, సరళంగా, ధృవీకరించండి, ధృవీకరణ,
  సృష్టించండి, సృష్టించి, రూపొందించండి,
  అమలు చేయండి, నిర్ధారించండి, వినియోగించండి,
  ఆదేశం, దోషం, ఫలితం, మార్గం, నిర్దేశిక,
  దస్త్రం, కార్యనిర్వహణ, కార్యాచరణ,
  అభినందనలు, శుభాకాంక్షలు, విజయవంతంగా,
  పరిశీలించండి, ప్రయత్నించండి, గమనించండి,
  విధానం, విధానాలు, ఉదాహరణ, ఉదాహరణలు.
- Prefer natural expressions such as:
  simple, check చేయండి, create చేసి, run చేయండి,
  type చేయండి, Enter press చేయండి, command,
  output, path, directory, file, permission,
  way, ways, example, examples, observe చేయండి,
  try చేయండి.
- Keep commands, package names, flags, paths, and output exactly in English.
- Put important commands on their own line in backticks.
- Use useful expression tags:
  [confident], [curious], [short pause], [pause],
  [satisfying tone], [motivational].
- Do not place a tag on every sentence.
- Do not say “Screen మీద మీరు...” unless it is essential.
- Write spoken numbers as words except digits inside commands,
  paths, flags, versions, or real output.
- Do not mention a specific next-day number in the CTA.
- Do not add an error, mistake, troubleshooting, or fix section.

VOICEOVER FLOW
- Start with a confident beginner-friendly hook.
- Explain why the command is useful.
- Ask the viewer to open ${environment || "Termux"} naturally.
- State accurately whether any package is needed.
- Install something only when it is genuinely required.
- Begin with the basic command and explain its output fully.
- Automatically continue through every important valid option or form.
- Explain the difference between similar forms in natural spoken Telugu.
- For path-related commands, fully explain logical path, physical path,
  absolute path, relative path, symbolic links, and relevant shell variables.
- Give a safe command demonstration for each important form.
- Explain when each form is useful in normal terminal work and shell scripts.
- Do not limit the number of examples because there is no duration limit.
- Do not repeat the same explanation.
- Give a complete practice task covering the important forms.
- Finish with a short motivational follow CTA.
- Do not add an error-handling or troubleshooting section.

4. SCREEN-RECORDING TIMELINE
Create a complete recording plan with no fixed duration:
- title and hook
- open Termux
- package/built-in check
- basic command
- output explanation
- each important option or form in its own recording segment
- path or symbolic-link demonstration when relevant
- shell-variable or scripting example when relevant
- practice task
- CTA
Estimate realistic timing for every segment based on the generated content.
Do not force the guide into a short Reel when the command needs more explanation.
State exactly what should be recorded in each segment.

5. REQUIREMENTS
- List only genuine requirements.
- State clearly when no extra package is needed.
- Include device/app requirements when relevant.

6. TERMUX INSTALL COMMANDS
- Give exact Termux commands only when installation is required.
- If nothing is required, write:
  No extra package required.
- Never invent a package.

7. UBUNTU/DEBIAN INSTALL COMMANDS
- Give exact Ubuntu/Debian commands only when required.
- If nothing is required, write:
  No extra package required.
- Do not use sudo unnecessarily.

8. MAIN COMMAND EXAMPLES
- Give safe, copyable commands.
- Include the basic command first.
- Include every important valid common form automatically.
- Add related variables or shell-script forms when directly relevant.
- For path commands, include demonstrations of logical and physical paths.
- Explain the expected output under every command.
- Keep each command on a separate line.
- Do not use destructive real paths.
- Never invent a flag or syntax.

9. DIFFERENT WAYS TO USE THE COMMAND
- Replace the old errors/fixes section with this section.
- Explain all important valid ways to use the command, not only three.
- Separate default behavior, common options, advanced forms, variables,
  scripting usage, and path behavior when relevant.
- Explain exactly what changes in each form and when it is useful.
- Clearly compare similar forms, such as logical versus physical path output.
- When the command has only one common form, explain different real-life
  situations instead of inventing fake flags.
- Keep every explanation beginner-friendly but technically complete.

10. PRACTICE TASK
- Give one small task the viewer can complete immediately.
- Use safe folders and files.
- The task must use the command learned today.

11. INSTAGRAM CAPTION
- Write a natural Instagram caption.
- Mention the command and learning benefit.
- Add a short follow CTA.
- Do not repeat the entire voiceover.

12. HASHTAGS
- Give twelve to eighteen relevant hashtags.
- Mix broad and niche Linux, Termux, coding, and learning hashtags.
- Do not add unrelated trending hashtags.

13. SAFETY NOTE
- Give a short, command-specific safety note.
- For harmless commands, explain that they are read-only or safe.
- For commands that modify/delete data, warn clearly and use a demo folder.
- Never recommend chmod 777 blindly.
- Never suggest root or sudo unless truly necessary.

TECHNICAL ACCURACY
- Never invent flags, package names, output, or command behavior.
- For shell built-ins and standard commands, do not falsely claim
  installation is needed.
- For risky commands, use a clearly named safe demo directory.
- Keep all commands syntactically valid for the selected environment.
`;

    const raw = await callNvidia(
      prompt,
      maxTokensForDeepGuide()
    );

    const sections = parseThirteenSections(raw);
    validateSections(sections);

    res.json({
      ok: true,
      sections,
      model: getModel(),
      format: "13-sections-deep-auto"
    });
  } catch (error) {
    res.status(500).json({
      error: "Content generation failed.",
      details: error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`Linux deep command guide app running on port ${PORT}`);
});
