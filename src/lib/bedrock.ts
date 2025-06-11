import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime'

// AWS Bedrock クライアント設定（us-west-2リージョン）
const bedrockClient = new BedrockRuntimeClient({
  region: process.env.AWS_REGION || 'us-west-2',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
})

// Claude 4 Opusモデル設定（us.プレフィックス必須）
const MODEL_ID = process.env.BEDROCK_MODEL_ID || 'us.claude-3-opus-20240229-v1:0'

export interface BedrockRequest {
  prompt: string
  imageBase64?: string
  maxTokens?: number
}

export interface BedrockResponse {
  text: string
  usage?: {
    input_tokens: number
    output_tokens: number
  }
}

// 🧮 **数学問題解析・計算機能**
export async function solveMathProblem(request: BedrockRequest): Promise<BedrockResponse> {
  try {
    const messages = []
    
    if (request.imageBase64) {
      // 📸 画像から数学問題を解析
      messages.push({
        role: 'user',
        content: [
          {
            type: 'image',
            source: {
              type: 'base64',
              media_type: 'image/jpeg',
              data: request.imageBase64
            }
          },
          {
            type: 'text',
            text: `画像から数学問題を読み取り、詳細な計算過程とともに解いてください。

要求：
1. 📋 問題文の正確な読み取り
2. 🔢 計算過程を段階的に表示
3. ✅ 最終答えを明確に提示
4. 📊 グラフが必要な場合は座標データも提供

回答形式：
{
  "problem": "問題文",
  "steps": ["計算ステップ1", "計算ステップ2", ...],
  "result": "最終答え",
  "graph_data": "グラフデータ（必要時）"
}`
          }
        ]
      })
    } else {
      // 📝 テキスト数学問題の解析
      messages.push({
        role: 'user',
        content: `数学問題を解いてください：

問題：${request.prompt}

要求：
1. 🔢 計算過程を段階的に表示
2. ✅ 最終答えを明確に提示  
3. 📊 グラフが必要な場合は座標データも提供

回答形式：
{
  "problem": "問題文",
  "steps": ["計算ステップ1", "計算ステップ2", ...],
  "result": "最終答え",
  "graph_data": "グラフデータ（必要時）"
}`
      })
    }

    const requestBody = {
      anthropic_version: 'bedrock-2023-05-31',
      max_tokens: request.maxTokens || 4000,
      messages: messages,
      temperature: 0.1, // 数学計算のため低温度設定
      system: `あなたは高性能数学計算機です。正確な計算と詳細な解説を提供してください。
      
特長：
- 📚 基本演算から高等数学まで対応
- 🔍 計算過程の詳細な説明
- 📊 グラフィカルな表現が可能
- 🎯 正確性を最優先`
    }

    const command = new InvokeModelCommand({
      modelId: MODEL_ID,
      contentType: 'application/json',
      accept: 'application/json',
      body: JSON.stringify(requestBody),
    })

    const response = await bedrockClient.send(command)
    const responseData = JSON.parse(new TextDecoder().decode(response.body))

    return {
      text: responseData.content[0].text,
      usage: responseData.usage
    }
  } catch (error) {
    console.error('❌ Bedrock API Error:', error)
    throw new Error(`Bedrock API呼び出しエラー: ${error}`)
  }
}

// 🖼️ **画像から数式を抽出**
export async function extractMathFromImage(imageBase64: string): Promise<string> {
  try {
    const response = await solveMathProblem({
      prompt: '',
      imageBase64,
      maxTokens: 2000
    })
    
    return response.text
  } catch (error) {
    console.error('❌ Image analysis error:', error)
    throw error
  }
}
