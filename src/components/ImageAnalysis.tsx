'use client'

import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Button } from '@/components/ui/button'
import { useCalculatorStore } from '@/lib/store'
import { solveMathProblem } from '@/lib/bedrock'
import { fileToBase64, isValidImageFile } from '@/lib/utils'
import { Upload, Image, Loader2, Trash2, Download, Eye, Camera } from 'lucide-react'

interface ImagePreviewProps {
  imageUrl: string
  onRemove: () => void
}

const ImagePreview: React.FC<ImagePreviewProps> = ({ imageUrl, onRemove }) => (
  <div className="relative inline-block">
    <img
      src={imageUrl}
      alt="アップロードされた画像"
      className="max-w-full max-h-64 rounded-lg border-2 border-gray-200 dark:border-gray-600"
    />
    <Button
      onClick={onRemove}
      variant="destructive"
      size="icon"
      className="absolute top-2 right-2 h-8 w-8"
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  </div>
)

interface AnalysisResultProps {
  result: string
  onUseExpression: (expression: string) => void
}

const AnalysisResult: React.FC<AnalysisResultProps> = ({ result, onUseExpression }) => {
  const [parsedResult, setParsedResult] = useState<any>(null)

  React.useEffect(() => {
    try {
      // JSONとして解析を試行
      const parsed = JSON.parse(result)
      setParsedResult(parsed)
    } catch {
      // JSON解析に失敗した場合はそのまま表示
      setParsedResult(null)
    }
  }, [result])

  return (
    <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-3">
        <Eye className="h-5 w-5 text-green-600 dark:text-green-400" />
        <h3 className="font-semibold text-green-800 dark:text-green-200">
          解析結果
        </h3>
      </div>

      {parsedResult ? (
        <div className="space-y-3">
          {/* 問題文 */}
          {parsedResult.problem && (
            <div>
              <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-1">
                📋 問題文
              </h4>
              <p className="text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-800 p-3 rounded border">
                {parsedResult.problem}
              </p>
            </div>
          )}

          {/* 計算過程 */}
          {parsedResult.steps && Array.isArray(parsedResult.steps) && (
            <div>
              <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">
                🔢 計算過程
              </h4>
              <div className="bg-white dark:bg-gray-800 p-3 rounded border space-y-1">
                {parsedResult.steps.map((step: string, index: number) => (
                  <div key={index} className="text-sm text-gray-700 dark:text-gray-300">
                    {index + 1}. {step}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 最終答え */}
          {parsedResult.result && (
            <div>
              <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-1">
                ✅ 答え
              </h4>
              <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded border">
                <div className="text-xl font-bold text-green-800 dark:text-green-200 font-mono">
                  {parsedResult.result}
                </div>
              </div>
            </div>
          )}

          {/* グラフデータ */}
          {parsedResult.graph_data && (
            <div>
              <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-1">
                📊 グラフ情報
              </h4>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {parsedResult.graph_data}
              </p>
            </div>
          )}

          {/* アクションボタン */}
          {parsedResult.problem && (
            <Button
              onClick={() => onUseExpression(parsedResult.problem)}
              variant="outline"
              size="sm"
              className="mt-3"
            >
              <Calculator className="h-4 w-4 mr-2" />
              式を計算機に送る
            </Button>
          )}
        </div>
      ) : (
        <div className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
          {result}
        </div>
      )}
    </div>
  )
}

export default function ImageAnalysis() {
  const {
    uploadedImage,
    imageAnalysisResult,
    setUploadedImage,
    setImageAnalysisResult,
    setExpression,
    setError
  } = useCalculatorStore()

  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)

  // 📸 **ファイルドロップ処理**
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    
    if (!file) return

    if (!isValidImageFile(file)) {
      setError('JPG、PNG、WebP形式の画像ファイル（10MB以下）を選択してください')
      return
    }

    setUploadedFile(file)
    
    // 画像プレビュー用のURLを生成
    const imageUrl = URL.createObjectURL(file)
    setUploadedImage(imageUrl)
    setImageAnalysisResult(null)
  }, [setError, setUploadedImage, setImageAnalysisResult])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    multiple: false,
    maxSize: 10 * 1024 * 1024 // 10MB
  })

  // 🤖 **画像解析実行**
  const analyzeImage = async () => {
    if (!uploadedFile) {
      setError('画像をアップロードしてください')
      return
    }

    setIsAnalyzing(true)
    setError(null)

    try {
      const base64Image = await fileToBase64(uploadedFile)
      const result = await solveMathProblem({
        prompt: '',
        imageBase64: base64Image,
        maxTokens: 4000
      })

      setImageAnalysisResult(result.text)
    } catch (error) {
      setError(`画像解析エラー: ${error}`)
    } finally {
      setIsAnalyzing(false)
    }
  }

  // 🗑️ **画像削除**
  const removeImage = () => {
    if (uploadedImage) {
      URL.revokeObjectURL(uploadedImage)
    }
    setUploadedImage(null)
    setUploadedFile(null)
    setImageAnalysisResult(null)
  }

  // 🔄 **式を計算機に送る**
  const useExpression = (expression: string) => {
    setExpression(expression)
  }

  return (
    <div className="w-full max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6">
      {/* 📸 ヘッダー */}
      <div className="flex items-center gap-2 mb-6">
        <Camera className="h-6 w-6 text-blue-500" />
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
          画像から数学問題を解く
        </h2>
      </div>

      {/* 🔧 機能説明 */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <Image className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
              サポートされる機能
            </h3>
            <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
              <li>• 📝 手書きの数式・問題文の認識</li>
              <li>• 🧮 基本的な四則演算から高度な数学まで</li>
              <li>• 📊 グラフや図表の解析</li>
              <li>• 🔢 文章問題の自動解答</li>
              <li>• ✅ 詳細な計算過程の説明</li>
            </ul>
          </div>
        </div>
      </div>

      {/* 📤 ファイルアップロード */}
      {!uploadedImage && (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragActive
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
              : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
          }`}
        >
          <input {...getInputProps()} />
          
          <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          
          {isDragActive ? (
            <p className="text-blue-600 dark:text-blue-400 font-medium">
              ここにファイルをドロップしてください
            </p>
          ) : (
            <div>
              <p className="text-gray-600 dark:text-gray-400 font-medium mb-2">
                画像をドラッグ&ドロップ または クリックして選択
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500">
                JPG、PNG、WebP（最大10MB）
              </p>
            </div>
          )}
        </div>
      )}

      {/* 🖼️ 画像プレビュー */}
      {uploadedImage && (
        <div className="mb-6">
          <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-3">
            アップロード画像
          </h3>
          <div className="text-center">
            <ImagePreview imageUrl={uploadedImage} onRemove={removeImage} />
          </div>
        </div>
      )}

      {/* 🚀 解析ボタン */}
      {uploadedImage && !imageAnalysisResult && (
        <div className="text-center mb-6">
          <Button
            onClick={analyzeImage}
            disabled={isAnalyzing}
            size="lg"
            className="px-8"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Claude 4 Opusで解析中...
              </>
            ) : (
              <>
                <Eye className="h-5 w-5 mr-2" />
                画像を解析する
              </>
            )}
          </Button>
        </div>
      )}

      {/* 📋 解析結果 */}
      {imageAnalysisResult && (
        <div className="mb-6">
          <AnalysisResult
            result={imageAnalysisResult}
            onUseExpression={useExpression}
          />
        </div>
      )}

      {/* 🎯 使用例 */}
      {!uploadedImage && (
        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
          <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-3">
            📖 使用例
          </h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400">
            <div>
              <h4 className="font-medium mb-2">✅ 解析可能な画像</h4>
              <ul className="space-y-1">
                <li>• 数式や方程式の写真</li>
                <li>• 文章問題のテキスト</li>
                <li>• グラフや図表</li>
                <li>• 幾何学問題の図形</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">💡 コツ</h4>
              <ul className="space-y-1">
                <li>• 明るい場所で撮影</li>
                <li>• 文字がはっきり見える角度</li>
                <li>• 余分な背景を避ける</li>
                <li>• 高解像度の画像を使用</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
