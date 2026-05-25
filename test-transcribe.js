import "dotenv/config"
import fs from "fs"

const formData = new FormData();
formData.append("format", "true");
formData.append("language", "en");
formData.append("keyterm", "Understand The Universe");
formData.append("file", new Blob([fs.readFileSync("audio.mp4")]), "audio.mp4");

const response = await fetch("https://api.x.ai/v1/stt", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${process.env.XAI_API_KEY}`,
  },
  body: formData,
});

if (!response.ok) throw new Error(`STT error ${response.status}`);

const result = await response.json();
console.log(result.text);
console.log(`Duration: ${result.duration}s`);
for (const word of result.words ?? []) {
  console.log(`  ${word.start.toFixed(2)}s - ${word.end.toFixed(2)}s: ${word.text}`);
}
