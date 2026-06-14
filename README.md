
# Linux 90 Days Video Script Generator

This is a Render-ready web app for generating no-face Instagram Reel / YouTube Shorts scripts for your Linux 90 Days Challenge.

## Features

- Generates daily Linux video scripts
- Adds requirements and install commands
- Adds Termux and Ubuntu/Debian support
- Adds common errors and fixes
- Adds captions and hashtags
- Uses NVIDIA NIM / NVIDIA API key safely from environment variables

## Local setup

```bash
npm install
cp .env.example .env
# Add your NVIDIA_API_KEY inside .env
npm start
```

Open:

```text
http://localhost:10000
```

## Render setup

1. Upload this folder to GitHub.
2. Open Render dashboard.
3. New > Web Service.
4. Connect your GitHub repo.
5. Use:
   - Build command: `npm install`
   - Start command: `npm start`
6. Add environment variables:
   - `NVIDIA_API_KEY`
   - `NIM_MODEL`
7. Deploy.

## Important

Do not upload your real NVIDIA API key to GitHub.
Always add the API key only in Render Environment Variables.
