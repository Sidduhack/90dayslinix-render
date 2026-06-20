# Linux Website v22 — n8n + ElevenLabs Bridge

This version sends website requests to n8n.

n8n is responsible for:

- Linux script generation
- Deep explanation
- Native Telugu voiceover text
- ElevenLabs audio generation
- Returning script and MP3 to the website

## Files

- `server.js`
- `package.json`
- `n8n-workflow-setup.md`

## Render variables

```text
N8N_WEBHOOK_URL=https://YOUR-N8N-DOMAIN/webhook/linux-reel-generate
N8N_WEBHOOK_SECRET=YOUR_LONG_RANDOM_SECRET
```

## Expected n8n response

Return either:

```json
{
  "ok": true,
  "output": "complete generated script",
  "fullVoiceover": "voiceover text",
  "audioBase64": "BASE64_MP3",
  "audioMimeType": "audio/mpeg"
}
```

or:

```json
{
  "ok": true,
  "output": "complete generated script",
  "fullVoiceover": "voiceover text",
  "audioUrl": "https://storage.example/voiceover.mp3"
}
```

## Update

Replace the old `package.json` and `server.js`, then deploy the latest commit on Render.
