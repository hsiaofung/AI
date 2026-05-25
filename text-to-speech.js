import "dotenv/config"
import fs from "fs"

// 1. 讀取文字檔內容（假設檔名為 input.txt）
// 'utf8' 參數確保讀出來的是字串而不是 Buffer
const textFromFile = fs.readFileSync("input.txt", "utf8");

const response = await fetch("https://api.x.ai/v1/tts", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${process.env.XAI_API_KEY}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    text: textFromFile, // 2. 將讀取的文字放入這裡
    voice_id: "leo",
    language: "en",
  }),
});

if (!response.ok) throw new Error(`TTS error ${response.status}`);

const buffer = Buffer.from(await response.arrayBuffer());
fs.writeFileSync("hello.mp3", buffer);
console.log(`Saved ${buffer.length.toLocaleString()} bytes to hello.mp3`);
