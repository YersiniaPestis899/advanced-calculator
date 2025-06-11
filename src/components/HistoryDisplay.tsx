'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { useCalculatorStore } from '@/lib/store'
import { formatDateTime } from '@/lib/utils'
import { History, Trash2, Download, Calculator, FileText } from 'lucide-react'

interface HistoryItemProps {
  item: {
    id: string
    expression: string
    result: string
    steps: string[]
    operationType: string
    timestamp: Date
  }
  onDelete: (id: string) => void
  onReuse: (expression: string) => void
}

const HistoryItem: React.FC<HistoryItemProps> = ({ item, onDelete, onReuse }) => (
  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
    <div className="flex justify-between items-start mb-2">
      <div className="flex-1">
        <div className="font-mono text-sm text-gray-600 dark:text-gray-400 mb-1">
          {item.expression}
        </div>
        <div className="font-mono font-bold text-lg text-gray-800 dark:text-gray-200">
          = {item.result}
        </div>
      </div>
      
      <div className="flex gap-1 ml-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onReuse(item.expression)}
          className="p-2 h-8 w-8"
          title="計算式を再利用"
        >
          <Calculator className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(item.id)}
          className="p-2 h-8 w-8 text-red-500 hover:text-red-700"
          title="削除"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
    
    <div className="flex justify-between items-center">
      <div className="text-xs text-gray-500 dark:text-gray-400">
        {formatDateTime(item.timestamp)} • {item.operationType}
      </div>
      
      {item.steps && item.steps.length > 0 && (
        <div className="text-xs text-blue-600 dark:text-blue-400">
          {item.steps.length} ステップ
        </div>
      )}
    </div>
    
    {item.steps && item.steps.length > 0 && (
      <details className="mt-2">
        <summary className="text-xs text-gray-500 dark:text-gray-400 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300">
          計算過程を表示
        </summary>
        <div className="mt-2 pl-4 border-l-2 border-gray-200 dark:border-gray-600">
          {item.steps.map((step, index) => (
            <div key={index} className="text-xs font-mono text-gray-600 dark:text-gray-400 py-1">
              {step}
            </div>
          ))}
        </div>
      </details>
    )}
  </div>
)

export default function HistoryDisplay() {
  const { history, clearHistory, removeFromHistory, setExpression, setDisplayMode } = useCalculatorStore()

  // 🔄 **計算式を再利用**
  const handleReuse = (expression: string) => {
    setExpression(expression)
    setDisplayMode('calculator')
  }

  // 🗑️ **履歴削除**
  const handleDelete = (id: string) => {
    removeFromHistory(id)
  }

  // 📊 **統計情報の計算**
  const totalCalculations = history.length
  const operationTypes = history.reduce((acc, item) => {
    acc[item.operationType] = (acc[item.operationType] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  // 📁 **エクスポート機能（ローカル）**
  const exportHistory = () => {
    const data = {
      exportDate: new Date().toISOString(),
      totalCalculations,
      history: history.map(item => ({
        expression: item.expression,
        result: item.result,
        steps: item.steps,
        operationType: item.operationType,
        timestamp: item.timestamp.toISOString()
      }))
    }
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `calculator-history-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="h-full flex flex-col">
      {/* 📊 **ヘッダー & 統計** */}
      <div className="flex-shrink-0 p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <History className="h-5 w-5 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
              計算履歴
            </h2>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={exportHistory}
              disabled={history.length === 0}
              className="flex items-center gap-1"
            >
              <Download className="h-4 w-4" />
              エクスポート
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={clearHistory}
              disabled={history.length === 0}
              className="flex items-center gap-1"
            >
              <Trash2 className="h-4 w-4" />
              全削除
            </Button>
          </div>
        </div>
        
        {/* 📈 **統計情報** */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {totalCalculations}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              総計算数
            </div>
          </div>
          
          {Object.entries(operationTypes).slice(0, 3).map(([type, count]) => (
            <div key={type} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
              <div className="text-xl font-bold text-gray-700 dark:text-gray-300">
                {count}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {type}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 📜 **履歴一覧** */}
      <div className="flex-1 overflow-y-auto p-4">
        {history.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400 mb-2">
              計算履歴がありません
            </h3>
            <p className="text-sm text-gray-400 dark:text-gray-500">
              計算を実行すると、ここに履歴が表示されます
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {history.map((item) => (
              <HistoryItem
                key={item.id}
                item={item}
                onDelete={handleDelete}
                onReuse={handleReuse}
              />
            ))}
          </div>
        )}
      </div>

      {/* 💡 **ヒント** */}
      <div className="flex-shrink-0 p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
          <div className="flex items-start gap-2">
            <div className="text-blue-600 dark:text-blue-400 font-medium text-sm">
              💡 ヒント:
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              履歴は自動的にローカルに保存されます。計算式をクリックして再利用したり、エクスポートしてバックアップできます。
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
