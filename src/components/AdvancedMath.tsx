'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useCalculatorStore } from '@/lib/store'
import { AdvancedCalculator } from '@/lib/calculator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { 
  Sigma, 
  TrendingUp, 
  BarChart3, 
  Calculator, 
  Settings,
  BookOpen,
  Zap,
  Target
} from 'lucide-react'

interface AdvancedMathProps {
  onResult: (result: any) => void
}

const AdvancedMathComponent: React.FC<AdvancedMathProps> = ({ onResult }) => {
  const { currentExpression, setError } = useCalculatorStore()
  const [isCalculating, setIsCalculating] = useState(false)
  const [variable, setVariable] = useState('x')
  const [matrixA, setMatrixA] = useState<number[][]>([[1, 2], [3, 4]])
  const [matrixB, setMatrixB] = useState<number[][]>([[5, 6], [7, 8]])
  const [statisticsData, setStatisticsData] = useState<string>('1,2,3,4,5')

  // 🔍 **微分計算**
  const handleDerivative = async () => {
    if (!currentExpression.trim()) {
      setError('微分する関数を入力してください')
      return
    }

    setIsCalculating(true)
    try {
      const result = AdvancedCalculator.calculateDerivative(currentExpression, variable)
      onResult(result)
    } catch (error) {
      setError(`微分エラー: ${error}`)
    } finally {
      setIsCalculating(false)
    }
  }

  // ∫ **積分計算**
  const handleIntegral = async () => {
    if (!currentExpression.trim()) {
      setError('積分する関数を入力してください')
      return
    }

    setIsCalculating(true)
    try {
      const result = AdvancedCalculator.calculateIntegral(currentExpression, variable)
      onResult(result)
    } catch (error) {
      setError(`積分エラー: ${error}`)
    } finally {
      setIsCalculating(false)
    }
  }

  // 📈 **方程式求解**
  const handleSolveEquation = async () => {
    if (!currentExpression.trim()) {
      setError('解く方程式を入力してください（例: x^2 - 4 = 0）')
      return
    }

    setIsCalculating(true)
    try {
      const result = AdvancedCalculator.solveEquation(currentExpression, variable)
      onResult(result)
    } catch (error) {
      setError(`方程式求解エラー: ${error}`)
    } finally {
      setIsCalculating(false)
    }
  }

  // 📊 **統計計算**
  const handleStatistics = async () => {
    try {
      const data = statisticsData.split(',').map(num => parseFloat(num.trim()))
      
      if (data.some(isNaN)) {
        setError('有効な数値をカンマ区切りで入力してください')
        return
      }

      setIsCalculating(true)
      const result = AdvancedCalculator.calculateStatistics(data)
      onResult(result)
    } catch (error) {
      setError(`統計計算エラー: ${error}`)
    } finally {
      setIsCalculating(false)
    }
  }

  // 🔢 **行列計算**
  const handleMatrixOperation = async (operation: string) => {
    setIsCalculating(true)
    try {
      const result = AdvancedCalculator.calculateMatrix(
        operation, 
        matrixA, 
        operation !== 'determinant' && operation !== 'inverse' ? matrixB : undefined
      )
      onResult(result)
    } catch (error) {
      setError(`行列計算エラー: ${error}`)
    } finally {
      setIsCalculating(false)
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Zap className="h-4 w-4" />
          高度計算
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            高度数学機能
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="calculus" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="calculus" className="flex items-center gap-1">
              <Sigma className="h-4 w-4" />
              微積分
            </TabsTrigger>
            <TabsTrigger value="algebra" className="flex items-center gap-1">
              <Target className="h-4 w-4" />
              代数
            </TabsTrigger>
            <TabsTrigger value="statistics" className="flex items-center gap-1">
              <BarChart3 className="h-4 w-4" />
              統計
            </TabsTrigger>
            <TabsTrigger value="matrix" className="flex items-center gap-1">
              <Calculator className="h-4 w-4" />
              行列
            </TabsTrigger>
          </TabsList>

          {/* 🔍 微積分タブ */}
          <TabsContent value="calculus" className="space-y-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
              <h3 className="font-semibold mb-2">📝 現在の式</h3>
              <div className="font-mono bg-white dark:bg-gray-800 p-2 rounded border">
                f({variable}) = {currentExpression || '式を入力してください'}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <label className="text-sm font-medium">変数:</label>
              <Select value={variable} onValueChange={setVariable}>
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="x">x</SelectItem>
                  <SelectItem value="y">y</SelectItem>
                  <SelectItem value="t">t</SelectItem>
                  <SelectItem value="u">u</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button
                onClick={handleDerivative}
                disabled={isCalculating}
                className="flex items-center gap-2 h-16"
              >
                <TrendingUp className="h-5 w-5" />
                <div>
                  <div className="font-semibold">微分</div>
                  <div className="text-sm">d/d{variable}</div>
                </div>
              </Button>

              <Button
                onClick={handleIntegral}
                disabled={isCalculating}
                className="flex items-center gap-2 h-16"
              >
                <Sigma className="h-5 w-5" />
                <div>
                  <div className="font-semibold">積分</div>
                  <div className="text-sm">∫ d{variable}</div>
                </div>
              </Button>
            </div>
          </TabsContent>

          {/* 📈 代数タブ */}
          <TabsContent value="algebra" className="space-y-4">
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
              <h3 className="font-semibold mb-2">📝 方程式を入力</h3>
              <div className="font-mono bg-white dark:bg-gray-800 p-2 rounded border">
                {currentExpression || 'x^2 - 4 = 0'}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                例: x^2 - 4 = 0, 2*x + 3 = 7, sin(x) = 0.5
              </p>
            </div>

            <div className="flex items-center gap-4">
              <label className="text-sm font-medium">解く変数:</label>
              <Select value={variable} onValueChange={setVariable}>
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="x">x</SelectItem>
                  <SelectItem value="y">y</SelectItem>
                  <SelectItem value="t">t</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={handleSolveEquation}
              disabled={isCalculating}
              className="w-full h-16 flex items-center gap-2"
            >
              <Target className="h-5 w-5" />
              <div>
                <div className="font-semibold">方程式を解く</div>
                <div className="text-sm">{variable} について解く</div>
              </div>
            </Button>
          </TabsContent>

          {/* 📊 統計タブ */}
          <TabsContent value="statistics" className="space-y-4">
            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
              <h3 className="font-semibold mb-2">📊 データを入力</h3>
              <textarea
                className="w-full p-2 border rounded font-mono text-sm"
                placeholder="数値をカンマ区切りで入力（例: 1,2,3,4,5）"
                value={statisticsData}
                onChange={(e) => setStatisticsData(e.target.value)}
                rows={3}
              />
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                平均、分散、標準偏差、最小値、最大値を計算します
              </p>
            </div>

            <Button
              onClick={handleStatistics}
              disabled={isCalculating}
              className="w-full h-16 flex items-center gap-2"
            >
              <BarChart3 className="h-5 w-5" />
              <div>
                <div className="font-semibold">統計計算</div>
                <div className="text-sm">記述統計量を計算</div>
              </div>
            </Button>
          </TabsContent>

          {/* 🔢 行列タブ */}
          <TabsContent value="matrix" className="space-y-4">
            <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4">
              <h3 className="font-semibold mb-4">🔢 行列設定</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">行列A</label>
                  <div className="grid grid-cols-2 gap-1">
                    {matrixA.map((row, i) =>
                      row.map((val, j) => (
                        <input
                          key={`${i}-${j}`}
                          type="number"
                          value={val}
                          onChange={(e) => {
                            const newMatrix = [...matrixA]
                            newMatrix[i][j] = parseFloat(e.target.value) || 0
                            setMatrixA(newMatrix)
                          }}
                          className="w-full p-1 text-center border rounded text-sm"
                        />
                      ))
                    )}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">行列B</label>
                  <div className="grid grid-cols-2 gap-1">
                    {matrixB.map((row, i) =>
                      row.map((val, j) => (
                        <input
                          key={`${i}-${j}`}
                          type="number"
                          value={val}
                          onChange={(e) => {
                            const newMatrix = [...matrixB]
                            newMatrix[i][j] = parseFloat(e.target.value) || 0
                            setMatrixB(newMatrix)
                          }}
                          className="w-full p-1 text-center border rounded text-sm"
                        />
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Button
                onClick={() => handleMatrixOperation('add')}
                disabled={isCalculating}
                size="sm"
              >
                A + B
              </Button>
              <Button
                onClick={() => handleMatrixOperation('multiply')}
                disabled={isCalculating}
                size="sm"
              >
                A × B
              </Button>
              <Button
                onClick={() => handleMatrixOperation('determinant')}
                disabled={isCalculating}
                size="sm"
              >
                det(A)
              </Button>
              <Button
                onClick={() => handleMatrixOperation('inverse')}
                disabled={isCalculating}
                size="sm"
              >
                A⁻¹
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        <div className="text-xs text-gray-500 dark:text-gray-400 mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded">
          💡 <strong>ヒント:</strong> 式は計算機画面で入力してから、ここで高度な演算を実行してください。
          結果は自動的に履歴に保存されます。
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default AdvancedMathComponent
