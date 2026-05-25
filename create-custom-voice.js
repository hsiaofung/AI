import "dotenv/config"
import fs from "fs"

// 1. Create the voice.
const form = new FormData();
form.append("file", new Blob([fs.readFileSync("reference.mp4")]), "reference.mp4");
form.append("name", "Friendly Narrator");
form.append("language", "en");
form.append("gender", "female");
form.append("tone", "warm");
form.append("use_case", "narration");

const createResp = await fetch("https://api.x.ai/v1/custom-voices", {
  method: "POST",
  headers: { Authorization: `Bearer ${process.env.XAI_API_KEY}` },
  body: form,
});
if (!createResp.ok) throw new Error(`Create error ${createResp.status}`);
const { voice_id } = await createResp.json();

// 2. Synthesize speech with it.
const speech = await fetch("https://api.x.ai/v1/tts", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${process.env.XAI_API_KEY}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    text: "Hello! This audio was synthesized using my custom voice.",
    voice_id,
    language: "en",
  }),
});
const buffer = Buffer.from(await speech.arrayBuffer());
fs.writeFileSync("hello.mp3", buffer);
