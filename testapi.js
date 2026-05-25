import "dotenv/config"

import { createXai } from '@ai-sdk/xai'
import { generateText } from 'ai'

const modelName = process.env.XAI_MODEL ?? 'grok-4.20-reasoning';

console.log("KEY =", process.env.XAI_API_KEY);

const xai = createXai({ apiKey: process.env.XAI_API_KEY });

const { text } = await generateText({
    model: xai.responses(modelName),
    system: 'You are Grok, a highly intelligent, helpful AI assistant.',
    prompt: 'What is the meaning of life, the universe, and everything?',
});

console.log(text);
