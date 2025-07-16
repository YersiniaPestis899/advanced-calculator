'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { useCalculatorStore } from '@/lib/store'
import { AdvancedCalculator } from '@/lib/calculator'
import { cn, formatNumber, sanitizeExpression } from '@/lib/utils'
import AdvancedMathComponent from './AdvancedMath'
import { Calculator, Delete, RotateCcw, Zap } from 'lucide-react'

interface CalculatorButtonProps {
  value: string
  onClick: () => void
  variant?: 'calculator' | 'operator' | 'function' | 'equals'
  className?: string
  children?: React.ReactNode
  disabled?: boolean
}

const CalculatorButton: React.FC<CalculatorButtonProps> = ({
  value,
  onClick,
  variant = 'calculator',
  className,
  children,
  disabled = false
}) => (
  <Button
    variant={variant}
    size="calculator"
    onClick={onClick}
    disabled={disabled}
    className={cn("transition-all duration-200 hover:scale-105 active:scale-95", className)}
  >
    {children || value}
  </Button>
)

export default function CalculatorComponent() {
  const {
    currentExpression,
    currentResult,
    isCalculating,
    error,
    setExpression,
    appendToExpression,
    clearExpression,
    clearAll,
    calculate,
    setCalculating,
    setError
  } = useCalculatorStore()

  // 🔢 **数字・演算子の入力**
  const handleInput = (value: string) => {
    if (error) setError(null)
    appendToExpression(value)
  }

  // 🧮 **計算実行**
  const handleCalculate = async () => {
    if (!currentExpression.trim()) return
    
    setCalculating(true)
    setError(null)
    
    try {
      const sanitized = sanitizeExpression(currentExpression)
      const result = AdvancedCalculator.evaluateExpression(sanitized)
      calculate(result)
    } catch (error) {
      setError(`計算エラー: ${error}`)
    } finally {
      setCalculating(false)
    }
  }

  // 🗑️ **1文字削除**
  const handleBackspace = () => {
    if (currentExpression.length > 0) {
      setExpression(currentExpression.slice(0, -1))
    }
  }

  // 🤖 **高度計算結果処理**
  const handleAdvancedResult = (result: any) => {
    calculate(result)
  }

  // ⌨️ **キーボードサポート**
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const { key } = event
      
      if (key >= '0' && key <= '9') {
        handleInput(key)
      } else if (['+', '-', '*', '/', '(', ')'].includes(key)) {
        handleInput(key)
      } else if (key === 'Enter' || key === '=') {
        event.preventDefault()
        handleCalculate()
      } else if (key === 'Escape') {
        clearAll()
      } else if (key === 'Backspace') {
        handleBackspace()
      } else if (key === '.') {
        handleInput('.')
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentExpression])

  return (
    <div className="w-full max-w-md mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6">
      {/* 📱 ヘッダー */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Calculator className="h-6 w-6 text-blue-500" />
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
            高度計算機
          </h2>
        </div>
        
        {/* 🔬 高度計算ボタン */}
        <AdvancedMathComponent onResult={handleAdvancedResult} />
      </div>

      {/* 📺 ディスプレイ */}
      <div className="calculator-display mb-6">
        {/* 入力式 */}
        <div className="text-sm text-gray-600 dark:text-gray-400 mb-2 min-h-[20px]">
          {currentExpression || '式を入力してください'}
        </div>
        
        {/* 結果表示 */}
        <div className="text-2xl font-mono font-bold text-gray-800 dark:text-gray-200 min-h-[32px] flex items-center justify-end">
          {isCalculating ? (
            <div className="animate-pulse">計算中...</div>
          ) : error ? (
            <div className="text-red-500 text-sm">{error}</div>
          ) : (
            formatNumber(currentResult || '0')
          )}
        </div>
      </div>

      {/* 🔢 ボタングリッド */}
      <div className="grid grid-cols-4 gap-3">
        {/* 上段：クリア・削除・関数 */}
        <CalculatorButton 
          value="AC" 
          onClick={clearAll} 
          variant="function"
          className="col-span-2"
        >
          <RotateCcw className="h-4 w-4 mr-1" />
          オールクリア
        </CalculatorButton>
        
        <CalculatorButton 
          value="⌫" 
          onClick={handleBackspace}
          variant="function"
        >
          <Delete className="h-4 w-4" />
        </CalculatorButton>
        
        <CalculatorButton 
          value="÷" 
          onClick={() => handleInput('/')} 
          variant="operator"
        />

        {/* 数字ボタン 7-9 */}
        <CalculatorButton value="7" onClick={() => handleInput('7')} />
        <CalculatorButton value="8" onClick={() => handleInput('8')} />
        <CalculatorButton value="9" onClick={() => handleInput('9')} />
        <CalculatorButton value="×" onClick={() => handleInput('*')} variant="operator" />

        {/* 数字ボタン 4-6 */}
        <CalculatorButton value="4" onClick={() => handleInput('4')} />
        <CalculatorButton value="5" onClick={() => handleInput('5')} />
        <CalculatorButton value="6" onClick={() => handleInput('6')} />
        <CalculatorButton value="-" onClick={() => handleInput('-')} variant="operator" />

        {/* 数字ボタン 1-3 */}
        <CalculatorButton value="1" onClick={() => handleInput('1')} />
        <CalculatorButton value="2" onClick={() => handleInput('2')} />
        <CalculatorButton value="3" onClick={() => handleInput('3')} />
        <CalculatorButton value="+" onClick={() => handleInput('+')} variant="operator" />

        {/* 最下段 */}
        <CalculatorButton value="0" onClick={() => handleInput('0')} className="col-span-1" />
        <CalculatorButton value="." onClick={() => handleInput('.')} />
        <CalculatorButton value="(" onClick={() => handleInput('(')} variant="function" />
        <CalculatorButton value=")" onClick={() => handleInput(')')} variant="function" />

        {/* イコールボタン */}
        <CalculatorButton 
          value="=" 
          onClick={handleCalculate}
          variant="equals"
          className="col-span-4 mt-2"
          disabled={isCalculating}
        >
          {isCalculating ? '計算中...' : '='}
        </CalculatorButton>
      </div>

      {/* 🔬 高度な関数ボタン */}
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">高度な関数</div>
        <div className="grid grid-cols-3 gap-2">
          <CalculatorButton value="sin" onClick={() => handleInput('sin(')} variant="function" />
          <CalculatorButton value="cos" onClick={() => handleInput('cos(')} variant="function" />
          <CalculatorButton value="tan" onClick={() => handleInput('tan(')} variant="function" />
          <CalculatorButton value="log" onClick={() => handleInput('log10(')} variant="function" />
          <CalculatorButton value="ln" onClick={() => handleInput('log(')} variant="function" />
          <CalculatorButton value="√" onClick={() => handleInput('sqrt(')} variant="function" />
          <CalculatorButton value="π" onClick={() => handleInput('pi')} variant="function" />
          <CalculatorButton value="e" onClick={() => handleInput('e')} variant="function" />
          <CalculatorButton value="^" onClick={() => handleInput('^')} variant="function" />
        </div>
      </div>
    </div>
  )
}
