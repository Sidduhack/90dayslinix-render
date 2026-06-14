
const $ = (id) => document.getElementById(id);

$("generateBtn").addEventListener("click", async () => {
  const payload = {
    day: $("day").value.trim(),
    command: $("command").value.trim(),
    platform: $("platform").value,
    language: $("language").value,
    videoLength: $("videoLength").value,
    audience: $("audience").value.trim()
  };

  $("output").textContent = "Generating...";

  try {
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) {
      $("output").textContent = `Error:\n${data.error || "Request failed"}\n\n${data.details || ""}`;
      return;
    }

    $("output").textContent = data.output;
  } catch (error) {
    $("output").textContent = `Error: ${error.message}`;
  }
});

$("copyBtn").addEventListener("click", async () => {
  const text = $("output").textContent;
  await navigator.clipboard.writeText(text);
  $("copyBtn").textContent = "Copied";
  setTimeout(() => $("copyBtn").textContent = "Copy", 1200);
});
