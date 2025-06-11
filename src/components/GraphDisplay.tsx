'use client'

import React, { Suspense, useState } from 'react'
import dynamic from 'next/dynamic'
import { Button } from '@/components/ui/button'
import { useCalculatorStore } from '@/lib/store'
import { AdvancedCalculator } from '@/lib/calculator'  
import { evaluate } from 'mathjs'
import { TrendingUp, ZoomIn, ZoomOut, RotateCw, Settings } from 'lucide-react'

// 🔧 **Plotly.jsを動的にインポート（SSR対応）**
const Plot = dynamic(() => import('react-plotly.js'), { 
  ssr: false,
  loading: () => <div className="w-full h-96 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
  </div>
})

interface GraphControlsProps {
  onGenerateGraph: () => void
  onZoomIn: () => void
  onZoomOut: () => void
  onReset: () => void
  isGenerating: boolean
}

const GraphControls: React.FC<GraphControlsProps> = ({
  onGenerateGraph,
  onZoomIn,
  onZoomOut,
  onReset,
  isGenerating
}) => (
  <div className="flex gap-2 mb-4 flex-wrap">
    <Button 
      onClick={onGenerateGraph}
      disabled={isGenerating}
      variant="default"
      size="sm"
      className="flex items-center gap-2"
    >
      <TrendingUp className="h-4 w-4" />
      {isGenerating ? 'グラフ生成中...' : 'グラフ生成'}
    </Button>
    
    <Button onClick={onZoomIn} variant="outline" size="sm">
      <ZoomIn className="h-4 w-4" />
    </Button>
    
    <Button onClick={onZoomOut} variant="outline" size="sm">
      <ZoomOut className="h-4 w-4" />
    </Button>
    
    <Button onClick={onReset} variant="outline" size="sm">
      <RotateCw className="h-4 w-4" />
    </Button>
  </div>
)

export default function GraphDisplay() {
  const {
    currentExpression,
    graphData,
    graphRange,
    setGraphData,
    setGraphRange,
    setError
  } = useCalculatorStore()

  const [isGenerating, setIsGenerating] = useState(false)
  const [graphType, setGraphType] = useState<'2d' | '3d'>('2d')

  // 📈 **2Dグラフ生成**
  const generate2DGraph = async () => {
    if (!currentExpression.trim()) {
      setError('グラフ化する式を入力してください')
      return
    }

    setIsGenerating(true)
    try {
      const result = AdvancedCalculator.generateGraph(currentExpression, graphRange)
      
      if (result.error) {
        setError(result.error)
      } else if (result.graphData) {
        setGraphData([result.graphData])
      }
    } catch (error) {
      setError(`グラフ生成エラー: ${error}`)
    } finally {
      setIsGenerating(false)
    }
  }

  // 🌐 **3Dグラフ生成**
  const generate3DGraph = async () => {
    if (!currentExpression.trim()) {
      setError('3Dグラフ化する式を入力してください（例: x^2 + y^2）')
      return
    }

    setIsGenerating(true)
    try {
      // 3Dグラフのためのメッシュデータ生成
      const xValues: number[] = []
      const yValues: number[] = []  
      const zValues: number[][] = []
      
      const [xMin, xMax] = graphRange
      const [yMin, yMax] = graphRange
      const step = (xMax - xMin) / 30

      for (let x = xMin; x <= xMax; x += step) {
        xValues.push(x)
      }
      
      for (let y = yMin; y <= yMax; y += step) {
        yValues.push(y)
      }

      // Z値の計算（数式評価）
      for (let i = 0; i < xValues.length; i++) {
        zValues[i] = []
        for (let j = 0; j < yValues.length; j++) {
          try {
            // x, yを変数とした式の評価（mathjs使用）
            const z = evaluate(currentExpression, { x: xValues[i], y: yValues[j] })
            zValues[i][j] = typeof z === 'number' && !isNaN(z) ? z : 0
          } catch {
            zValues[i][j] = 0
          }
        }
      }

      const graph3DData = {
        x: xValues,
        y: yValues,
        z: zValues,
        type: 'surface',
        colorscale: [
          [0, '#0d47a1'],
          [0.2, '#1976d2'],
          [0.4, '#42a5f5'],
          [0.6, '#81c784'],
          [0.8, '#ffeb3b'],
          [1, '#f44336']
        ],
        showscale: true,
        hovertemplate: 'x: %{x}<br>y: %{y}<br>z: %{z}<extra></extra>'
      }

      setGraphData([graph3DData])
    } catch (error) {
      setError(`3Dグラフ生成エラー: ${error}`)
    } finally {
      setIsGenerating(false)
    }
  }

  // 🔍 **ズーム制御**
  const handleZoomIn = () => {
    const [min, max] = graphRange
    const center = (min + max) / 2
    const newRange = (max - min) * 0.7 / 2
    setGraphRange([center - newRange, center + newRange])
  }

  const handleZoomOut = () => {
    const [min, max] = graphRange
    const center = (min + max) / 2
    const newRange = (max - min) * 1.3 / 2
    setGraphRange([center - newRange, center + newRange])
  }

  const handleReset = () => {
    setGraphRange([-10, 10])
    setGraphData([])
  }

  // 📱 **レスポンシブレイアウト設定**
  const plotConfig = {
    displayModeBar: true,
    displaylogo: false,
    modeBarButtonsToRemove: ['pan2d', 'lasso2d', 'select2d'] as any,
    responsive: true
  }

  const plotLayout = {
    title: {
      text: `f(x) = ${currentExpression || 'y = x'}`,
      font: { size: 16, color: '#374151' }
    },
    xaxis: {
      title: 'x',
      range: graphRange,
      gridcolor: '#e5e7eb',
      zerolinecolor: '#9ca3af'
    },
    yaxis: {
      title: graphType === '2d' ? 'y' : 'y',
      gridcolor: '#e5e7eb', 
      zerolinecolor: '#9ca3af'
    },
    ...(graphType === '3d' && {
      scene: {
        xaxis: { title: 'X' },
        yaxis: { title: 'Y' },
        zaxis: { title: 'Z' },
        camera: {
          eye: { x: 1.25, y: 1.25, z: 1.25 }
        },
        bgcolor: '#f9fafb'
      }
    }),
    plot_bgcolor: '#f9fafb',
    paper_bgcolor: '#ffffff',
    margin: { t: 50, r: 10, b: 50, l: 50 },
    height: 400
  }

  return (
    <div className="w-full max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6">
      {/* 📊 ヘッダー */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-6 w-6 text-blue-500" />
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
            グラフ表示
          </h2>
        </div>
        
        {/* グラフタイプ切り替え */}
        <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
          <Button
            variant={graphType === '2d' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setGraphType('2d')}
          >
            2D
          </Button>
          <Button
            variant={graphType === '3d' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setGraphType('3d')}
          >
            3D
          </Button>
        </div>
      </div>

      {/* 🎛️ コントロール */}
      <GraphControls
        onGenerateGraph={graphType === '2d' ? generate2DGraph : generate3DGraph}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onReset={handleReset}
        isGenerating={isGenerating}
      />

      {/* 📈 グラフ表示エリア */}
      <div className="graph-container">
        {graphData.length > 0 ? (
          <Suspense fallback={<div className="animate-pulse bg-gray-200 h-96 rounded-lg" />}>
            <Plot
              data={graphData}
              layout={plotLayout}
              config={plotConfig}
              className="w-full h-full"
            />
          </Suspense>
        ) : (
          <div className="flex items-center justify-center h-96 bg-gray-50 dark:bg-gray-900 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
            <div className="text-center">
              <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-600 dark:text-gray-400 mb-2">
                グラフを生成
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-500 mb-4">
                数式を入力して「グラフ生成」ボタンを押してください
              </p>
              <div className="text-xs text-gray-400 dark:text-gray-600">
                <p>📝 2D例: x^2, sin(x), log(x)</p>
                <p>🌐 3D例: x^2 + y^2, sin(x) * cos(y)</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 📊 グラフ情報 */}
      {graphData.length > 0 && (
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <div className="flex items-center gap-2 text-sm text-blue-700 dark:text-blue-400">
            <Settings className="h-4 w-4" />
            <span>
              範囲: [{graphRange[0].toFixed(1)}, {graphRange[1].toFixed(1)}] | 
              タイプ: {graphType.toUpperCase()}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
