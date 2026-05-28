const dotenv = require('dotenv')
const path = require('path')

// === 強制清除舊 Key + 強制使用 .env ===
delete process.env.XAI_API_KEY
process.env.XAI_API_KEY = undefined

const result = dotenv.config({
  path: path.resolve(__dirname, '.env'),
  override: true, // 強制覆蓋
  debug: true, // 顯示載入過程
})

console.log('=== API Key 強制載入狀態 ===')
console.log('載入成功?', !result.error)
console.log('目前使用的 Key 前10碼:', process.env.XAI_API_KEY ? process.env.XAI_API_KEY.substring(0, 10) : '無')
console.log('目前完整 Key 長度:', process.env.XAI_API_KEY ? process.env.XAI_API_KEY.length : 0)
console.log('================================\n')

if (!process.env.XAI_API_KEY || !process.env.XAI_API_KEY.startsWith('xai-')) {
  console.error('錯誤：Key 載入失敗')
  process.exit(1)
}

// ==================== 後續程式碼 ====================
const { createXai } = require('@ai-sdk/xai')
const { generateText } = require('ai')
const { execSync } = require('child_process')

async function generateCommitMessage() {
  // ...（保持你原本的 git diff + generateText 部分）
  let gitSummary = ''

  try {
    gitSummary = execSync('git diff --cached', { encoding: 'utf8' }).trim()
  } catch (err) {
    console.error('無法取得 Git diff')
    process.exit(1)
  }

  if (!gitSummary) {
    console.log('沒有 staged 變更，請先 git add')
    process.exit(0)
  }

  const xai = createXai({ apiKey: process.env.XAI_API_KEY })

  const { text } = await generateText({
    model: xai('grok-3'),
    prompt: `你是一位專業工程師，請根據以下 git diff 產生 Conventional Commits 格式的 commit message。\n\nGit diff:\n${gitSummary}`,
    maxTokens: 800,
    temperature: 0.3,
  })

  console.log('\n=== 建議的 Commit Message ===\n')
  console.log(text)
}

generateCommitMessage().catch(console.error)
