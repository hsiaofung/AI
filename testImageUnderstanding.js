import { createXai } from '@ai-sdk/xai'
import { generateText } from 'ai'
import "dotenv/config"
import fs from 'fs'; // 1. 引入檔案系統模組

const xai = createXai({ apiKey: process.env.XAI_API_KEY });

// 2. 讀取本地圖片檔案並轉為 Uint8Array
const imageBuffer = fs.readFileSync('input-image.png');
const imageUint8Array = new Uint8Array(imageBuffer);

const { text, response } = await generateText({
    model: xai.responses('grok-4.3'),
    messages: [
        {
            role: 'user',
            content: [
                {
                    type: 'image',
                    image: imageUint8Array,
                    mimeType: 'image/png',
                },
                {
                    type: 'text',
                    text: "請描述這張圖片的內容。",
                },
            ],
        },
    ]
});

console.log(text);

// The response ID can be used to continue the conversation
console.log(response.id);
