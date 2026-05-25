import { createXai } from "@ai-sdk/xai";
import { generateText } from "ai";
import "dotenv/config";
import fs from "fs";

const modelName = "grok-4.3"; // 建議改這個

const textFromFile = fs.readFileSync("weekly-report.txt", "utf8");

const xai = createXai({
  apiKey: process.env.XAI_API_KEY,
});

const { text } = await generateText({
  model: xai.responses(modelName),
  prompt: `以下是我這一週的程式碼修改內容：${textFromFile} 請根據這些內容，幫我產生一份簡短的 weekly report，摘要重點修改和成果。`,
});

console.log(text);
