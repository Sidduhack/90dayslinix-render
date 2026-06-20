# n8n + ElevenLabs Automation Setup

## Architecture

```text
Website on Render
    ↓ POST
n8n Webhook
    ↓
AI script generation
    ↓
Extract <full_voiceover>
    ↓
ElevenLabs Text-to-Speech
    ↓
Return script + audioBase64/audioUrl
    ↓
Website displays script and audio player
```

## A. n8n workflow nodes

Create these nodes in this order:

1. **Webhook**
2. **IF** — test request or generate request
3. **HTTP Request — Generate Linux Script**
4. **Code — Extract Script and Voiceover**
5. **HTTP Request — ElevenLabs TTS**
6. **Code — Build Website Response**
7. **Respond to Webhook**

---

## 1. Webhook node

- HTTP Method: `POST`
- Path: `linux-reel-generate`
- Authentication: `Header Auth`
- Header name: `x-webhook-secret`
- Header value: create a long random secret
- Respond: `Using Respond to Webhook Node`

During testing, use the Test URL and click **Listen for test event**.
For the website, activate/publish the workflow and use the Production URL.

Expected website request:

```json
{
  "action": "generate",
  "day": "1",
  "command": "pwd",
  "environment": "Termux on Android",
  "visualStyle": "Dark grid neon Linux explainer style",
  "depth": "Deep beginner learning",
  "voiceLength": "60 seconds",
  "voiceCoverage": "Full video voiceover + section-wise voiceover",
  "errorStyle": "Natural error reaction + calm fix",
  "voiceEmotion": "Native friendly Telugu tech creator",
  "psychologyFocus": "Retention + curiosity + clarity",
  "extra": ""
}
```

---

## 2. AI script HTTP Request node

Use the NVIDIA endpoint or another AI provider.

### NVIDIA example

- Method: `POST`
- URL: `https://integrate.api.nvidia.com/v1/chat/completions`
- Authentication: Header/Bearer credential
- Header:
  - `Authorization: Bearer YOUR_NVIDIA_KEY`
  - `Content-Type: application/json`

Body:

```json
{
  "model": "meta/llama-3.3-70b-instruct",
  "messages": [
    {
      "role": "system",
      "content": "Return tagged content only. No JSON. Include <full_voiceover>...</full_voiceover>."
    },
    {
      "role": "user",
      "content": "Create the complete Linux reel output using the incoming webhook fields."
    }
  ],
  "max_tokens": 5200,
  "temperature": 0.24
}
```

Use expressions from the Webhook node inside the full prompt, for example:

```text
Command: {{$node["Webhook"].json.body.command}}
Environment: {{$node["Webhook"].json.body.environment}}
```

---

## 3. Code node — Extract Script and Voiceover

Name the node: `Extract Script`

```javascript
const content =
  $json.choices?.[0]?.message?.content ??
  $json.output ??
  "";

const getTag = (name) => {
  const regex = new RegExp(
    `<${name}>\\s*([\\s\\S]*?)\\s*</${name}>`,
    "i"
  );
  const match = content.match(regex);
  return match ? match[1].trim() : "";
};

const fullVoiceover = getTag("full_voiceover");

if (!fullVoiceover) {
  throw new Error("The AI response did not contain <full_voiceover>.");
}

// Keep natural text, remove Markdown backticks.
// With Eleven v3, supported audio tags may be retained.
// These custom planning tags are converted to punctuation.
const voiceoverForTts = fullVoiceover
  .replace(/`([^`]+)`/g, "$1")
  .replace(/\[short pause\]/gi, " ... ")
  .replace(/\[pause\]/gi, " .... ")
  .replace(/\[(soft background music|warm tone|curious tone|surprised|calm tone|confident|motivational tone)\]/gi, "")
  .replace(/\s{2,}/g, " ")
  .trim();

return [{
  json: {
    output: content,
    fullVoiceover,
    voiceoverForTts
  }
}];
```

---

## 4. Connect ElevenLabs to n8n

In ElevenLabs:

1. Create an API key.
2. Select a voice.
3. Copy its `voice_id`.

In n8n:

1. Open **Credentials**.
2. Create **Header Auth** credentials.
3. Header name: `xi-api-key`
4. Header value: your ElevenLabs API key.

Then add an **HTTP Request** node:

- Name: `ElevenLabs TTS`
- Method: `POST`
- URL:

```text
https://api.elevenlabs.io/v1/text-to-speech/YOUR_VOICE_ID?output_format=mp3_44100_128
```

- Authentication: the ElevenLabs Header Auth credential
- Send Body: JSON
- Response Format: File
- Binary Property: `audio`

Body:

```json
{
  "text": "={{$node['Extract Script'].json.voiceoverForTts}}",
  "model_id": "eleven_v3",
  "language_code": "te",
  "voice_settings": {
    "stability": 0.45,
    "similarity_boost": 0.75,
    "style": 0.3,
    "use_speaker_boost": true
  }
}
```

The voice-setting numbers above are starting values, not mandatory values.

---

## 5. Code node — Build Website Response

Name it: `Build Response`

```javascript
const parsed = $node["Extract Script"].json;
const buffer = await this.helpers.getBinaryDataBuffer(0, "audio");

return [{
  json: {
    ok: true,
    output: parsed.output,
    fullVoiceover: parsed.fullVoiceover,
    audioBase64: buffer.toString("base64"),
    audioMimeType: "audio/mpeg"
  }
}];
```

For longer audio, upload the MP3 to S3, Cloudinary, Google Drive, or another storage service and return `audioUrl` instead of base64.

---

## 6. Respond to Webhook node

- Respond With: `First Incoming Item` or `JSON`
- Response Code: `200`
- Return the output of `Build Response`

For errors, use an n8n Error Workflow or route the failure branch to a Respond to Webhook node returning:

```json
{
  "ok": false,
  "error": "Voice generation failed",
  "details": "{{$json.message}}"
}
```

---

## B. Render website environment variables

Add these to the Render Web Service:

```text
N8N_WEBHOOK_URL=https://YOUR-N8N-DOMAIN/webhook/linux-reel-generate
N8N_WEBHOOK_SECRET=THE_SAME_SECRET_USED_IN_N8N
```

Remove NVIDIA and ElevenLabs keys from the website. Keep those keys only in n8n credentials.

---

## C. Testing order

1. In n8n, open the Webhook node.
2. Click **Listen for test event**.
3. Temporarily put the n8n Test URL in Render or use a local API client.
4. Click the website Test button.
5. Confirm the webhook receives the request.
6. Test the AI node.
7. Test the Extract Script node.
8. Test ElevenLabs TTS and confirm it outputs binary property `audio`.
9. Test Build Response.
10. Activate the workflow.
11. Replace the test URL with the Production URL in Render.
12. Redeploy the website.

## Security

- Do not put NVIDIA or ElevenLabs keys in frontend JavaScript.
- Protect the Webhook with Header Auth.
- Use the Render backend as the caller so the webhook secret is not visible in the browser.
