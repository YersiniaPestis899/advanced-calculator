'use client'

import React from 'react' 
import { useCalculatorStore } from '@/lib/store'
import { Button } from '@/components/ui/button'
import CalculatorComponent from './Calculator'
import GraphDisplay from './GraphDisplay'
import HistoryDisplay from './HistoryDisplay'
import ImageAnalysis from './ImageAnalysis'
import { Calculator, TrendingUp, History, Camera, Settings, Moon, Sun } from 'lucide-react'

interface TabButtonProps {
  mode: 'calculator' | 'graph' | 'history' | 'image'
  currentMode: string
  onClick: () => void
  icon: React.ReactNode
  label: string
  count?: number
}

const TabButton: React.FC<TabButtonProps> = ({ 
  mode, 
  currentMode, 
  onClick, 
  icon, 
  label, 
  count 
}) => (
  <Button
    variant={currentMode === mode ? 'default' : 'ghost'}
    onClick={onClick}
    className="flex flex-col items-center gap-1 h-auto p-3 md:flex-row md:gap-2"
  >
    {icon}
    <span className="text-xs md:text-sm">{label}</span>
    {count !== undefined && count > 0 && (
      <span className="bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[18px] text-center">
        {count > 99 ? '99+' : count}
      </span>
    )}
  </Button>
)

export default function MainLayout() {
  const { displayMode, setDisplayMode, history } = useCalculatorStore()
  const [darkMode, setDarkMode] = React.useState(false)

  // 🌓 **ダークモード切り替え**
  React.useEffect(() => {
    const isDark = localStorage.getItem('darkMode') === 'true'
    setDarkMode(isDark)
    if (isDark) {
      document.documentElement.classList.add('dark')
    }
  }, [])

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode
    setDarkMode(newDarkMode)
    localStorage.setItem('darkMode', newDarkMode.toString())
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  // 📱 **コンテンツレンダリング**
  const renderContent = () => {
    switch (displayMode) {
      case 'calculator':
        return <CalculatorComponent />
      case 'graph':
        return <GraphDisplay />
      case 'history':
        return <HistoryDisplay />
      case 'image':
        return <ImageAnalysis />
      default:
        return <CalculatorComponent />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      {/* 📱 ヘッダー */}
      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* ロゴ */}
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-xl">
                <Calculator className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800 dark:text-gray-200">
                  Advanced Calculator
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  AI搭載高機能計算機
                </p>
              </div>
            </div>

            {/* 設定ボタン */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleDarkMode}
                className="rounded-full"
              >
                {darkMode ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* 🧩 メインコンテナ */}
      <div className="container mx-auto px-4 py-6">
        {/* タブナビゲーション */}
        <nav className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-2 mb-6 sticky top-20 z-40">
          <div className="flex justify-center">
            <div className="flex bg-gray-100 dark:bg-gray-700 rounded-xl p-1 gap-1">
              <TabButton
                mode="calculator"
                currentMode={displayMode}
                onClick={() => setDisplayMode('calculator')}
                icon={<Calculator className="h-5 w-5" />}
                label="計算機"
              />
              
              <TabButton
                mode="graph"
                currentMode={displayMode}
                onClick={() => setDisplayMode('graph')}
                icon={<TrendingUp className="h-5 w-5" />}
                label="グラフ"
              />
              
              <TabButton
                mode="history"
                currentMode={displayMode}
                onClick={() => setDisplayMode('history')}
                icon={<History className="h-5 w-5" />}
                label="履歴"
                count={history.length}
              />
              
              <TabButton
                mode="image"
                currentMode={displayMode}
                onClick={() => setDisplayMode('image')}
                icon={<Camera className="h-5 w-5" />}
                label="画像解析"
              />
            </div>
          </div>
        </nav>

        {/* 📱 メインコンテンツ */}
        <main className="fade-in">
          {renderContent()}
        </main>
      </div>

      {/* 📱 フッター */}
      <footer className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-t border-gray-200 dark:border-gray-700 mt-12">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Calculator className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Advanced Calculator
              </span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-500">
              🤖 Powered by AWS Bedrock Claude 4 Opus | 💾 ローカル保存
            </p>
            <div className="flex items-center justify-center gap-4 mt-3 text-xs text-gray-400">
              <span>🧮 基本計算</span>
              <span>📊 3Dグラフ</span>
              <span>🔍 微分・積分</span>
              <span>📸 画像解析</span>
              <span>💾 履歴保存</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
