# Linux Render v27 — Thirteen Sections

This version restores the complete thirteen-section output while keeping the updated voiceover style.

## Thirteen sections

1. Video Title
2. Three Hook Options
3. Full Voiceover Script
4. Screen-Recording Timeline
5. Requirements
6. Termux Install Commands
7. Ubuntu/Debian Install Commands
8. Main Command Examples
9. Different Ways to Use the Command
10. Practice Task
11. Instagram Caption
12. Hashtags
13. Safety Note

## Updated voiceover rules

- Natural spoken Telugu mixed with familiar English tech words
- No Roman Telugu
- No formal words such as:
  - సరళం
  - ధృవీకరించండి
  - సృష్టించి
  - అభినందనలు
  - పరిశీలించండి
  - విధానం
- No separate error-handling or troubleshooting section
- Explains multiple practical ways to use the command
- Includes safe command examples
- Uses ElevenLabs expression tags
- Ends with a motivational follow CTA

## Required Render environment variable

```text
NVIDIA_API_KEY=YOUR_NVIDIA_API_KEY
```

Optional model variable:

```text
MODEL_ALL=meta/llama-3.3-70b-instruct
```

## Deploy

1. Extract this ZIP.
2. Replace the files in your GitHub repository.
3. Commit and push.
4. Open your Render Web Service.
5. Confirm `NVIDIA_API_KEY` is present.
6. Select **Manual Deploy → Deploy latest commit**.

Start command:

```text
npm start
```

n8n and ElevenLabs automation variables are not used.
