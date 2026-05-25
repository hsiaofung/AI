import { createXai } from "@ai-sdk/xai";
import { generateText } from "ai";
import "dotenv/config";
import { execSync } from "child_process";

const modelName = "grok-4.3";

// ==================== 取得 Git 週報資料 ====================
let gitSummary = "";

try {
  gitSummary = execSync(
    `git log --since="7 days ago" \
     --pretty=format:"%h %s (%an)" \
     --stat`,
    { encoding: "utf8" }
  ).trim();
} catch (err) {
  console.error("無法取得 Git log，請確認目前在 Git 專案目錄下");
  gitSummary = "（無法取得 Git 記錄）";
}

// ==================== 呼叫 Grok 生成週報 ====================
const xai = createXai({
  apiKey: process.env.XAI_API_KEY,
});

const { text } = await generateText({
  model: xai(modelName),           // 改成一般模式（非 responses）
  
  system: `你是一位專業的軟體工程師週報助手。
請用繁體中文、簡潔專業的語氣撰寫 weekly report。
重點突出主要修改、解決的問題與成果。
格式使用 bullet points，分類清楚，不要加入多餘寒暄。`,

  prompt: `以下是這一週的 Git commit 記錄與變更統計：

${gitSummary}

請根據以上內容，幫我產生一份簡短的 weekly report。`,

  maxTokens: 1200,      // 限制輸出長度，控制成本
  temperature: 0.7,
});

console.log(text);