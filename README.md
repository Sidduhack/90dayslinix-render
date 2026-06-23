# Linux Render v24 — Voiceover Only

This version removes:

- n8n
- ElevenLabs automation
- Base64 MP3 responses
- captions, timelines, quizzes, and long multi-section output

It generates only one continuous, paste-ready Telugu Linux voiceover script.

## Required Render environment variable

```text
NVIDIA_API_KEY=YOUR_NVIDIA_API_KEY
```

Optional:

```text
MODEL_ALL=meta/llama-3.3-70b-instruct
```

Remove or ignore these old variables:

```text
N8N_WEBHOOK_URL
N8N_WEBHOOK_SECRET
```

They are not used by v24.

## Deploy on Render

1. Extract this ZIP.
2. Upload the files to your GitHub repository.
3. Commit and push.
4. Open Render.
5. Open your existing Web Service.
6. Confirm `NVIDIA_API_KEY` exists under Environment.
7. Trigger **Manual Deploy → Deploy latest commit**.

Start command:

```text
npm start
```

## Website output

The API response is:

```json
{
  "ok": true,
  "voiceover": "[confident] ...",
  "model": "meta/llama-3.3-70b-instruct",
  "mode": "voiceover-only"
}
```

The browser displays only `voiceover`.
