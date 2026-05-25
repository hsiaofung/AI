import { createXai } from '@ai-sdk/xai'
import { generateImage } from "ai"
import "dotenv/config"
import fs from "fs"; // 引入檔案系統模組

const xai = createXai({ apiKey: process.env.XAI_API_KEY });

const { image } = await generateImage({
    model: xai.image("grok-imagine-image-quality"),
    prompt: "一隻穿著西裝打領帶、正在使用 LinkedIn 找工作的柴犬。",
});

// 將 Base64 寫入檔案
const buffer = Buffer.from(image.base64, 'base64');
fs.writeFileSync('output-image.png', buffer);

console.log("圖片已儲存為 output-image.png");
