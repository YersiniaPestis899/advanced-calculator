import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// 🧮 計算機ユーティリティ関数
export function formatNumber(num: number | string): string {
  const numStr = typeof num === 'string' ? num : num.toString()
  
  // 小数点以下の桁数を制限
  if (numStr.includes('.')) {
    const [integer, decimal] = numStr.split('.')
    return `${integer}.${decimal.slice(0, 8)}`
  }
  
  return numStr
}

export function isValidExpression(expression: string): boolean {
  try {
    // 基本的な文字のチェック
    const validChars = /^[0-9+\-*/().√π^sincos tanlogln\s]+$/
    return validChars.test(expression)
  } catch {
    return false
  }
}

export function sanitizeExpression(expression: string): string {
  return expression
    .replace(/[×]/g, '*')
    .replace(/[÷]/g, '/')
    .replace(/π/g, 'pi')
    .replace(/√/g, 'sqrt')
}

// 📅 日時フォーマット
export function formatDateTime(date: Date): string {
  return new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

// 🖼️ 画像処理ユーティリティ
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      const result = reader.result as string
      // data:image/...;base64, を除去
      const base64 = result.split(',')[1]
      resolve(base64)
    }
    reader.onerror = error => reject(error)
  })
}

export function isValidImageFile(file: File): boolean {
  const validTypes = ['image/jpeg', 'image/png', 'image/webp']
  const maxSize = 10 * 1024 * 1024 // 10MB
  
  return validTypes.includes(file.type) && file.size <= maxSize
}

// 🔢 数学ユーティリティ
export function degToRad(degrees: number): number {
  return degrees * (Math.PI / 180)
}

export function radToDeg(radians: number): number {
  return radians * (180 / Math.PI)
}

// 📊 グラフユーティリティ
export function generateColorPalette(count: number): string[] {
  const colors = [
    '#3B82F6', '#EF4444', '#10B981', '#F59E0B',
    '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'
  ]
  
  return Array.from({ length: count }, (_, i) => colors[i % colors.length])
}

// 💾 ローカルストレージユーティリティ
export function saveToLocalStorage(key: string, value: any): void {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error('Failed to save to localStorage:', error)
  }
}

export function loadFromLocalStorage<T>(key: string): T | null {
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : null
  } catch (error) {
    console.error('Failed to load from localStorage:', error)
    return null
  }
}
