import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 10000;

app.use(express.json({ limit: "1mb" }));

const commands = [
  "pwd", "ls", "cd", "mkdir", "touch", "cat", "cp", "mv", "rm",
  "chmod", "chown", "git", "curl", "wget", "grep", "find", "ps",
  "top", "kill", "df", "du", "free", "uname", "tar", "zip/unzip",
  "bash script"
];

function getModel() {
  return process.env.MODEL_ALL ||
    process.env.NIM_MODEL ||
    "meta/llama-3.3-70b-instruct";
}

function makeTeluguNatural(script) {
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
    [/కార్యాచరణ/g, "process"]
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

function extractVoiceover(text) {
  const content = String(text || "").trim();

  const tagged = content.match(
    /<voiceover>\s*([\s\S]*?)\s*<\/voiceover>/i
  );

  let script = tagged ? tagged[1].trim() : content;

  script = script
    .replace(/^```(?:text|markdown)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .replace(/^["']|["']$/g, "")
    .trim();

  return makeTeluguNatural(script);
}

function tokenLimitForLength(length) {
  switch (length) {
    case "35 seconds":
      return 700;
    case "45 seconds":
      return 900;
    case "90 seconds":
      return 1500;
    default:
      return 1200;
  }
}

async function generateVoiceover(prompt, maxTokens) {
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
              "You write accurate Linux voiceovers in everyday spoken Telugu mixed " +
              "with familiar English tech words. Never use formal Telugu words " +
              "such as సరళం, ధృవీకరించండి, సృష్టించి, అమలు చేయండి, " +
              "నిర్ధారించండి, ఆదేశం, దోషం, ఫలితం, or మార్గం. " +
              "Use simple, check చేయండి, create చేసి, run చేయండి, command, " +
              "error, output, path, and fix instead. Return only the requested " +
              "<voiceover> tag. No JSON, headings, analysis, notes, or Markdown fences."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.32,
        top_p: 0.8,
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
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>Linux Telugu Voiceover Generator</title>
<style>
:root{
  color-scheme:dark;
  --bg:#060a11;
  --panel:#0f1827;
  --panel2:#070c14;
  --border:#283950;
  --text:#f4f7ff;
  --muted:#9eacc2;
  --blue:#46adff;
  --violet:#8569ff;
  --green:#63ecad;
}
*{box-sizing:border-box}
body{
  margin:0;
  background:
    radial-gradient(circle at 15% 0%,rgba(70,173,255,.12),transparent 30%),
    radial-gradient(circle at 90% 10%,rgba(133,105,255,.10),transparent 28%),
    var(--bg);
  color:var(--text);
  font-family:Arial,"Noto Sans Telugu",sans-serif;
}
main{width:min(1120px,94%);margin:auto;padding:28px 0 55px}
.hero{text-align:center;margin-bottom:22px}
.badge{
  display:inline-block;padding:8px 13px;border-radius:999px;
  border:1px solid #315174;background:#10243b;color:#a9d8ff;
  font-weight:800;font-size:14px
}
h1{font-size:clamp(30px,7vw,52px);margin:14px 0 8px}
.sub{max-width:820px;margin:auto;color:var(--muted);line-height:1.65}
.grid{display:grid;grid-template-columns:1fr;gap:18px}
@media(min-width:900px){
  .grid{grid-template-columns:390px 1fr;align-items:start}
}
.card,.output{
  background:rgba(15,24,39,.96);
  border:1px solid var(--border);
  border-radius:20px;
  padding:19px;
  box-shadow:0 20px 55px rgba(0,0,0,.36)
}
label{display:block;margin:14px 0 7px;font-weight:800;color:#dbe6f8}
input,select,textarea{
  width:100%;padding:13px 14px;border-radius:12px;
  border:1px solid #354a65;background:#0a1220;color:#fff;
  font-size:15px;font-family:inherit;outline:none
}
input:focus,select:focus,textarea:focus{border-color:var(--blue)}
textarea{min-height:105px;resize:vertical}
.pills{display:flex;flex-wrap:wrap;gap:8px;margin-top:11px}
.pill{
  padding:8px 11px;border-radius:999px;border:1px solid #31455f;
  background:#101c2e;color:#dceaff;cursor:pointer;font-size:13px
}
.pill:hover{border-color:var(--blue)}
button{
  border:0;border-radius:12px;padding:13px 16px;
  font-size:15px;font-weight:900;cursor:pointer
}
.primary{
  width:100%;margin-top:17px;
  background:linear-gradient(135deg,var(--blue),var(--violet));
  color:#04101c
}
.secondary{background:#18253a;color:#e4efff;border:1px solid #354963}
.primary:disabled{opacity:.6;cursor:not-allowed}
.status{
  margin-top:13px;padding:12px;border:1px solid #33465f;
  border-radius:12px;background:#0a1220;color:#dce8fa;
  font-size:14px;line-height:1.5
}
.note{
  margin-top:13px;padding:12px;border-left:4px solid var(--green);
  border-radius:12px;background:rgba(99,236,173,.08);
  color:#d5ffeb;line-height:1.55;font-size:14px
}
.outputHead{
  display:flex;align-items:center;justify-content:space-between;
  gap:12px;margin-bottom:12px
}
.outputHead h2{margin:0}
pre{
  min-height:620px;margin:0;padding:18px;border-radius:15px;
  border:1px solid #213149;background:var(--panel2);
  white-space:pre-wrap;word-wrap:break-word;overflow-x:auto;
  color:#edf4ff;font-size:16px;line-height:1.85;
  font-family:Arial,"Noto Sans Telugu",sans-serif
}
.small{color:var(--muted);font-size:13px;line-height:1.5}
code{color:#a9d8ff}
</style>
</head>
<body>
<main>
  <section class="hero">
    <span class="badge">Linux Challenge • Voiceover Only</span>
    <h1>Telugu Linux Voiceover Generator</h1>
    <p class="sub">
      Generates only one continuous, paste-ready ElevenLabs voiceover:
      native Telugu script, natural English tech words, realistic command
      explanation, error fix, practice task, and motivational CTA.
    </p>
  </section>

  <section class="grid">
    <section class="card">
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

      <label for="length">Voiceover length</label>
      <select id="length">
        <option>35 seconds</option>
        <option>45 seconds</option>
        <option selected>60 seconds</option>
        <option>90 seconds</option>
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
        placeholder="Example: Explain the output more deeply, but keep the script simple."></textarea>

      <button class="primary" id="generateBtn" type="button">
        Generate Voiceover Script
      </button>

      <button class="secondary" id="testBtn" type="button"
        style="width:100%;margin-top:10px">
        Test API Connection
      </button>

      <div class="status" id="status">Status: Ready.</div>

      <div class="note">
        Output contains only the voiceover script—no captions, timeline,
        JSON, audio, or n8n workflow.
      </div>

      <p class="small">
        Render variable required: <code>NVIDIA_API_KEY</code>.
        Optional: <code>MODEL_ALL=meta/llama-3.3-70b-instruct</code>.
      </p>
    </section>

    <section class="output">
      <div class="outputHead">
        <h2>Paste-Ready Voiceover</h2>
        <button class="secondary" id="copyBtn" type="button">Copy</button>
      </div>
      <pre id="output">Select a command and click Generate Voiceover Script.</pre>
    </section>
  </section>
</main>

<script>
(() => {
  const commands = ${JSON.stringify(commands)};
  const byId = id => document.getElementById(id);
  const output = byId("output");
  const status = byId("status");
  const generateBtn = byId("generateBtn");

  function setStatus(text) {
    status.textContent = "Status: " + text;
  }

  commands.forEach(command => {
    const item = document.createElement("button");
    item.type = "button";
    item.className = "pill";
    item.textContent = command;
    item.addEventListener("click", () => {
      byId("command").value = command;
    });
    byId("pills").appendChild(item);
  });

  byId("testBtn").addEventListener("click", async () => {
    setStatus("Testing server and NVIDIA configuration...");
    try {
      const response = await fetch("/api/test");
      const data = await response.json();
      output.textContent = JSON.stringify(data, null, 2);
      setStatus(response.ok ? "Connection test completed." : "Connection test failed.");
    } catch (error) {
      output.textContent = "Connection test failed:\\n" + error.message;
      setStatus("Connection test failed.");
    }
  });

  generateBtn.addEventListener("click", async () => {
    const payload = {
      day: byId("day").value.trim(),
      command: byId("command").value.trim(),
      environment: byId("environment").value,
      length: byId("length").value,
      delivery: byId("delivery").value,
      extra: byId("extra").value.trim()
    };

    if (!payload.day || !payload.command) {
      output.textContent = "Enter the day number and Linux command.";
      setStatus("Required fields are missing.");
      return;
    }

    generateBtn.disabled = true;
    output.textContent =
      "Writing a natural Telugu voiceover...\\n\\n" +
      "Checking command requirements...\\n" +
      "Explaining the command and output...\\n" +
      "Adding a realistic confusion or error fix...\\n" +
      "Finishing with practice and CTA...";

    setStatus("Generating voiceover...");

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        output.textContent =
          "Error:\\n" + (data.error || "Generation failed.") +
          "\\n\\nDetails:\\n" + (data.details || "");
        setStatus("Generation failed.");
        return;
      }

      output.textContent = data.voiceover || "No voiceover returned.";
      setStatus("Voiceover generated successfully.");
    } catch (error) {
      output.textContent = "Browser request failed:\\n" + error.message;
      setStatus("Browser request failed.");
    } finally {
      generateBtn.disabled = false;
    }
  });

  byId("copyBtn").addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(output.textContent);
      byId("copyBtn").textContent = "Copied";
      setStatus("Voiceover copied.");
      setTimeout(() => {
        byId("copyBtn").textContent = "Copy";
      }, 1200);
    } catch (error) {
      setStatus("Copy failed: " + error.message);
    }
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
    app: "Linux Telugu Voiceover Generator",
    version: "25.0.0"
  });
});

app.get("/api/test", (req, res) => {
  res.json({
    ok: true,
    server: "working",
    hasNvidiaKey: Boolean(process.env.NVIDIA_API_KEY),
    model: getModel(),
    mode: "voiceover-only"
  });
});

app.post("/api/generate", async (req, res) => {
  try {
    const {
      day,
      command,
      environment,
      length,
      delivery,
      extra
    } = req.body || {};

    if (!day || !command) {
      return res.status(400).json({
        error: "Day number and Linux command/topic are required."
      });
    }

    const prompt = `
Write one complete Linux voiceover script.

INPUT
Day: ${day}
Command/topic: ${command}
Environment: ${environment || "Termux on Android"}
Target duration: ${length || "60 seconds"}
Delivery style: ${delivery || "Confident and friendly Telugu tech guide"}
Extra instruction: ${extra || "None"}

RETURN FORMAT
Return exactly this tag and nothing else:

<voiceover>
SCRIPT
</voiceover>

STRICT OUTPUT RULES
- Return only one continuous, paste-ready voiceover.
- Do not add a title, heading, section name, bullet list, caption, hashtags,
  timeline, explanation outside the script, JSON, or Markdown fence.
- Write in native Telugu script with natural English technical words.
- Do not use Roman Telugu.
- Do not use formal textbook Telugu.
- Never use words such as:
  సరళం, సరళంగా, ధృవీకరించండి, ధృవీకరణ,
  సృష్టించండి, సృష్టించి, రూపొందించండి,
  అమలు చేయండి, నిర్ధారించండి, వినియోగించండి,
  ఆదేశం, దోషం, ఫలితం, మార్గం, నిర్దేశిక,
  దస్త్రం, కార్యనిర్వహణ, కార్యాచరణ.
- Use natural spoken alternatives:
  simple, check చేయండి, check చేసి,
  create చేయండి, create చేసి,
  run చేయండి, use చేయండి,
  command, error, output, path, directory,
  file, permission, system, fix.
- Prefer natural lines like:
  “ముందుగా Termux open చేయండి.”
  “ఇప్పుడు ఇలా type చేయండి.”
  “Enter press చేయండి.”
  “Output లో path కనిపిస్తుంది.”
  “Spelling check చేసి మళ్లీ run చేయండి.”
- Keep Linux commands, flags, paths, package names, and error messages
  exactly in English.
- Put important commands on their own line inside backticks.
- Use natural expression tags in square brackets:
  [confident], [curious], [short pause], [pause],
  [satisfying tone], [motivational].
- Use only useful tags and do not place a tag on every sentence.
- Do not describe obvious visuals with lines such as
  “Screen మీద మీరు ...” unless essential.
- Do not repeat the same sentence or idea.
- Write spoken numbers as words, except digits inside real commands,
  versions, paths, or error messages.
- The target duration must control the amount of detail.
- Do not mention a specific next-day number in the CTA.

REQUIRED TEACHING FLOW
1. Start with an interesting, confident beginner-friendly hook.
2. Explain why the command is useful.
3. Ask the viewer to open ${environment || "Termux"} naturally.
4. State accurately whether the command requires a package.
5. Install something only when genuinely required.
6. Tell the viewer exactly what to type.
7. Explain the command's full form or meaning when one exists.
8. Explain the output in simple Telugu.
9. Include one genuine beginner mistake, realistic error, or confusion.
10. Explain the reason first, then provide the safe fix.
11. Ask the viewer to run/check again and verify the result.
12. Give one small immediate practice task.
13. Finish with a short motivational follow CTA.

TECHNICAL ACCURACY
- Never invent an installation package.
- Never invent an unrealistic error just to fill the script.
- For a command that normally works, explain a genuine confusion instead.
- Never recommend chmod 777 blindly.
- Never suggest root or sudo unless it is truly necessary.
- For destructive commands, use a clearly named safe demo directory.
- For shell built-ins and standard commands, do not falsely say that a
  package installation is required.

STYLE REFERENCE
The finished voiceover should feel like this pattern:

[confident] Linux నేర్చుకునేటప్పుడు... మనం ఇప్పుడు ఏ folder లో ఉన్నామో
తెలుసుకోవాలి. [short pause]

అందుకోసం ఉపయోగించే command — \`pwd\`. [pause]

ముందుగా Termux open చేయండి.
ఈ command కోసం ఎలాంటి package install చేయాల్సిన అవసరం లేదు.

Then continue naturally with the exact command, output explanation,
realistic confusion/error fix, verification, practice, and CTA.
`;

    const raw = await generateVoiceover(
      prompt,
      tokenLimitForLength(length)
    );

    const voiceover = extractVoiceover(raw);

    if (!voiceover) {
      throw new Error("The model returned an empty voiceover.");
    }

    res.json({
      ok: true,
      voiceover,
      model: getModel(),
      mode: "voiceover-only"
    });
  } catch (error) {
    res.status(500).json({
      error: "Voiceover generation failed.",
      details: error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`Natural-spoken-Telugu voiceover app running on port ${PORT}`);
});
