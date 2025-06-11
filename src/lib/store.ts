import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { CalculationResult } from './calculator'

interface CalculationHistory {
  id: string
  expression: string
  result: string
  steps: string[]
  operationType: string
  timestamp: Date
  graphData?: any
}

interface CalculatorState {
  // 💻 **現在の状態**
  currentExpression: string
  currentResult: string
  isCalculating: boolean
  error: string | null
  
  // 📊 **表示モード**
  displayMode: 'calculator' | 'graph' | 'history' | 'image'
  
  // 🧮 **計算履歴**
  history: CalculationHistory[]
  
  // 📈 **グラフデータ**
  graphData: any[]
  graphRange: [number, number]
  
  // 🖼️ **画像解析**
  uploadedImage: string | null
  imageAnalysisResult: string | null
  
  // セッション管理
  userSession: string
  
  // 🔧 **アクション**
  setExpression: (expr: string) => void
  appendToExpression: (value: string) => void
  clearExpression: () => void
  clearAll: () => void
  
  // 計算実行
  calculate: (result: CalculationResult) => void
  setCalculating: (status: boolean) => void
  setError: (error: string | null) => void
  
  // 表示モード切り替え
  setDisplayMode: (mode: 'calculator' | 'graph' | 'history' | 'image') => void
  
  // 履歴管理
  addToHistory: (calculation: Omit<CalculationHistory, 'id' | 'timestamp'>) => void
  clearHistory: () => void
  removeFromHistory: (id: string) => void
  
  // グラフ関連
  setGraphData: (data: any[]) => void
  setGraphRange: (range: [number, number]) => void
  
  // 画像関連
  setUploadedImage: (image: string | null) => void
  setImageAnalysisResult: (result: string | null) => void
  
  // セッション
  generateUserSession: () => void
}

export const useCalculatorStore = create<CalculatorState>()(
  persist(
    (set, get) => ({
      // 🏁 **初期状態**
      currentExpression: '',
      currentResult: '',
      isCalculating: false,
      error: null,
      displayMode: 'calculator',
      history: [],
      graphData: [],
      graphRange: [-10, 10],
      uploadedImage: null,
      imageAnalysisResult: null,
      userSession: Math.random().toString(36).substr(2, 9),
  
  // 📝 **式操作**
  setExpression: (expr: string) => {
    set({ currentExpression: expr, error: null })
  },
  
  appendToExpression: (value: string) => {
    set((state) => ({
      currentExpression: state.currentExpression + value,
      error: null
    }))
  },
  
  clearExpression: () => {
    set({ currentExpression: '', error: null })
  },
  
  clearAll: () => {
    set({
      currentExpression: '',
      currentResult: '',
      error: null,
      graphData: []
    })
  },
  
  // 🧮 **計算実行**
  calculate: (result: CalculationResult) => {
    const { expression, result: calcResult, steps, operationType, graphData, error } = result
    
    if (error) {
      set({ error, isCalculating: false })
      return
    }
    
    set({
      currentResult: calcResult,
      error: null,
      isCalculating: false
    })
    
    // 履歴に追加
    get().addToHistory({
      expression,
      result: calcResult,
      steps,
      operationType
    })
    
    // グラフデータがある場合は設定
    if (graphData) {
      set({ graphData: [graphData] })
    }
  },
  
  setCalculating: (status: boolean) => {
    set({ isCalculating: status })
  },
  
  setError: (error: string | null) => {
    set({ error })
  },
  
  // 🖥️ **表示モード**
  setDisplayMode: (mode) => {
    set({ displayMode: mode })
  },
  
  // 📚 **履歴管理**
  addToHistory: (calculation) => {
    const newCalculation: CalculationHistory = {
      ...calculation,
      id: Date.now().toString(),
      timestamp: new Date()
    }
    
    set((state) => ({
      history: [newCalculation, ...state.history.slice(0, 49)] // 最大50件
    }))
  },
  
  clearHistory: () => {
    set({ history: [] })
  },
  
  removeFromHistory: (id: string) => {
    set((state) => ({
      history: state.history.filter(item => item.id !== id)
    }))
  },
  
  // 📊 **グラフ関連**
  setGraphData: (data: any[]) => {
    set({ graphData: data })
  },
  
  setGraphRange: (range: [number, number]) => {
    set({ graphRange: range })
  },
  
  // 🖼️ **画像関連**
  setUploadedImage: (image: string | null) => {
    set({ uploadedImage: image })
  },
  
  setImageAnalysisResult: (result: string | null) => {
    set({ imageAnalysisResult: result })
  },
  
  // 👤 **セッション管理**
  generateUserSession: () => {
    set({ userSession: Math.random().toString(36).substr(2, 9) })
  }
}),
{
  name: 'advanced-calculator-storage', // ローカルストレージのキー名
  storage: createJSONStorage(() => localStorage),
  partialize: (state) => ({
    // 💾 **永続化対象**（一時的な状態は除外）
    history: state.history,
    graphRange: state.graphRange,
    userSession: state.userSession,
    displayMode: state.displayMode
  }),
  version: 1,
  migrate: (persistedState: any, version: number) => {
    // 🔄 **データ移行**（将来のバージョンアップ用）
    if (version === 0) {
      // 初期版からの移行処理
      return {
        ...persistedState,
        version: 1
      }
    }
    return persistedState
  }
}
)
)

// 🎯 **セレクター（パフォーマンス最適化）**
export const useCurrentExpression = () => useCalculatorStore(state => state.currentExpression)
export const useCurrentResult = () => useCalculatorStore(state => state.currentResult)
export const useIsCalculating = () => useCalculatorStore(state => state.isCalculating)
export const useError = () => useCalculatorStore(state => state.error)
export const useDisplayMode = () => useCalculatorStore(state => state.displayMode)
export const useHistory = () => useCalculatorStore(state => state.history)
export const useGraphData = () => useCalculatorStore(state => state.graphData)
