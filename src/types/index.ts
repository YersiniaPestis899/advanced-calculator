// 🧮 **計算関連の型定義**
export interface CalculationResult {
  result: string
  steps: string[]
  expression: string
  operationType: 'basic' | 'graph' | 'derivative' | 'integral' | 'equation' | 'statistics' | 'matrix'
  graphData?: PlotlyData
  error?: string
}

// 📊 **グラフデータの型定義**
export interface PlotlyData {
  x?: number[]
  y?: number[]
  z?: number[][] | number[]
  type: 'scatter' | 'surface' | 'mesh3d' | 'bar' | 'histogram'
  mode?: string
  name?: string
  line?: {
    color?: string
    width?: number
    dash?: string
  }
  marker?: {
    color?: string
    size?: number
    symbol?: string
  }
  colorscale?: Array<[number, string]>
  showscale?: boolean
  hovertemplate?: string
}

// 📚 **履歴データの型定義**
export interface HistoryItem {
  id: string
  expression: string
  result: string
  steps: string[]
  operationType: string
  timestamp: Date
  graphData?: PlotlyData
}

// 🗄️ **Supabase Database型定義**
export interface DatabaseCalculationHistory {
  id?: number
  expression: string
  result: string
  calculation_steps?: string[] | any
  operation_type: string
  created_at?: string
  user_session?: string
  graph_data?: any
  image_analysis?: any
}

// 🤖 **Bedrock API型定義**
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

// 📱 **UIの状態型定義**
export type DisplayMode = 'calculator' | 'graph' | 'history' | 'image'

export interface CalculatorState {
  currentExpression: string
  currentResult: string
  isCalculating: boolean
  error: string | null
  displayMode: DisplayMode
  history: HistoryItem[]
  graphData: PlotlyData[]
  graphRange: [number, number]
  uploadedImage: string | null
  imageAnalysisResult: string | null
  userSession: string
}

// 🎨 **Theme型定義**
export type Theme = 'light' | 'dark' | 'system'

// 🖼️ **画像処理型定義**
export interface ImageAnalysisResult {
  problem?: string
  steps?: string[]
  result?: string
  graph_data?: string
  confidence?: number
}

// 🔢 **行列型定義**
export type Matrix = number[][]

export interface MatrixOperation {
  type: 'add' | 'multiply' | 'determinant' | 'inverse' | 'transpose'
  matrixA: Matrix
  matrixB?: Matrix
}

// 📊 **統計型定義**
export interface StatisticsResult {
  mean: number
  variance: number
  standardDeviation: number
  min: number
  max: number
  count: number
  median?: number
  mode?: number[]
  quartiles?: [number, number, number]
}

// ⚙️ **設定型定義**
export interface AppSettings {
  theme: Theme
  language: 'ja' | 'en'
  decimalPlaces: number
  showSteps: boolean
  autoSave: boolean
  cloudSync: boolean
  graphAnimations: boolean
  keyboardShortcuts: boolean
}

// 🌐 **API Response型定義**
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// 📐 **数学関数型定義**
export interface MathFunction {
  name: string
  symbol: string
  description: string
  syntax: string
  example: string
  category: 'basic' | 'trigonometric' | 'logarithmic' | 'hyperbolic' | 'statistical'
}

// 🎯 **計算機ボタン型定義**
export interface CalculatorButton {
  value: string
  display: string
  type: 'number' | 'operator' | 'function' | 'action'
  variant?: 'calculator' | 'operator' | 'function' | 'equals'
  className?: string
}

// 🔍 **検索・フィルター型定義**
export interface HistoryFilter {
  operationType?: string
  dateRange?: {
    start: Date
    end: Date
  }
  searchTerm?: string
}

// 📱 **レスポンシブ型定義**
export type ScreenSize = 'mobile' | 'tablet' | 'desktop'

export interface ResponsiveConfig {
  screenSize: ScreenSize
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
}

// 🎨 **カラーパレット型定義**
export interface ColorPalette {
  primary: string
  secondary: string
  accent: string
  background: string
  surface: string
  error: string
  success: string
  warning: string
  info: string
}

// 🔧 **ユーティリティ型定義**
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

export type RequiredNonNull<T> = {
  [P in keyof T]-?: NonNullable<T[P]>
}

// 📊 **チャート設定型定義**
export interface ChartConfig {
  width?: number
  height?: number
  responsive?: boolean
  showLegend?: boolean
  showGrid?: boolean
  theme?: 'light' | 'dark'
  colors?: string[]
  animations?: boolean
}

export default {}
