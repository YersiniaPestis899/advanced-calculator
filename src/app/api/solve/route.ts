import { NextRequest, NextResponse } from 'next/server'
import { solveMathProblem } from '@/lib/bedrock'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { prompt, imageBase64, maxTokens } = body

    // 🔍 **入力検証**
    if (!prompt && !imageBase64) {
      return NextResponse.json(
        { error: 'プロンプトまたは画像データが必要です' },
        { status: 400 }
      )
    }

    // 🤖 **Claude 4 Opusで数学問題解決**
    const result = await solveMathProblem({
      prompt,
      imageBase64,
      maxTokens: maxTokens || 4000
    })

    return NextResponse.json({
      success: true,
      result: result.text,
      usage: result.usage
    })

  } catch (error) {
    console.error('❌ Math solving API error:', error)
    
    return NextResponse.json(
      { 
        error: 'サーバーエラーが発生しました',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// 🔧 **OPTIONS対応（CORS）**
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}
