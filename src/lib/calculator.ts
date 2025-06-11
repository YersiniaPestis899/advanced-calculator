import { evaluate, parse, compile, derivative, simplify, rationalize } from 'mathjs'
import * as Algebrite from 'algebrite'

export interface CalculationResult {
  result: string
  steps: string[]
  expression: string
  operationType: string
  graphData?: any
  error?: string
}

export class AdvancedCalculator {
  
  // 🔢 **基本計算（計算過程付き）**
  static evaluateExpression(expression: string): CalculationResult {
    try {
      const steps: string[] = []
      const cleanExpression = expression.replace(/[×]/g, '*').replace(/[÷]/g, '/')
      
      steps.push(`入力式: ${expression}`)
      steps.push(`正規化: ${cleanExpression}`)
      
      // 計算実行
      const result = evaluate(cleanExpression)
      steps.push(`計算結果: ${result}`)
      
      return {
        result: result.toString(),
        steps,
        expression: cleanExpression,
        operationType: 'basic'
      }
    } catch (error) {
      return {
        result: '',
        steps: [],
        expression: expression,
        operationType: 'basic',
        error: `計算エラー: ${error}`
      }
    }
  }

  // 📊 **関数グラフ作成**
  static generateGraph(expression: string, xRange: [number, number] = [-10, 10]): CalculationResult {
    try {
      const steps: string[] = []
      const compiledExpression = compile(expression)
      
      steps.push(`関数: f(x) = ${expression}`)
      steps.push(`定義域: [${xRange[0]}, ${xRange[1]}]`)
      
      const xValues: number[] = []
      const yValues: number[] = []
      
      const stepSize = (xRange[1] - xRange[0]) / 200
      
      for (let x = xRange[0]; x <= xRange[1]; x += stepSize) {
        try {
          const y = compiledExpression.evaluate({ x })
          if (typeof y === 'number' && !isNaN(y) && isFinite(y)) {
            xValues.push(x)
            yValues.push(y)
          }
        } catch (e) {
          // スキップ（定義されない点）
        }
      }
      
      steps.push(`データポイント数: ${xValues.length}`)
      
      const graphData = {
        x: xValues,
        y: yValues,
        type: 'scatter',
        mode: 'lines',
        name: `f(x) = ${expression}`,
        line: { color: '#3B82F6', width: 2 }
      }
      
      return {
        result: `グラフ生成完了: ${xValues.length}ポイント`,
        steps,
        expression,
        operationType: 'graph',
        graphData
      }
    } catch (error) {
      return {
        result: '',
        steps: [],
        expression,
        operationType: 'graph',
        error: `グラフ生成エラー: ${error}`
      }
    }
  }

  // 🎯 **微分計算**
  static calculateDerivative(expression: string, variable: string = 'x'): CalculationResult {
    try {
      const steps: string[] = []
      
      steps.push(`元の関数: f(${variable}) = ${expression}`)
      
      // Math.jsを使用した微分
      const derivativeExpression = derivative(expression, variable)
      const simplifiedDerivative = simplify(derivativeExpression)
      
      steps.push(`微分の計算: d/d${variable}(${expression})`)
      steps.push(`微分結果: f'(${variable}) = ${simplifiedDerivative}`)
      
      return {
        result: simplifiedDerivative.toString(),
        steps,
        expression,
        operationType: 'derivative'
      }
    } catch (error) {
      return {
        result: '',
        steps: [],
        expression,
        operationType: 'derivative', 
        error: `微分計算エラー: ${error}`
      }
    }
  }

  // ∫ **積分計算（Algebrite使用）**
  static calculateIntegral(expression: string, variable: string = 'x'): CalculationResult {
    try {
      const steps: string[] = []
      
      steps.push(`被積分関数: f(${variable}) = ${expression}`)
      
      // Algebriteを使用した積分
      const integralResult = Algebrite.integral(expression, variable)
      
      steps.push(`積分の計算: ∫${expression} d${variable}`)
      steps.push(`積分結果: F(${variable}) = ${integralResult}`)
      
      return {
        result: integralResult.toString(),
        steps,
        expression,
        operationType: 'integral'
      }
    } catch (error) {
      return {
        result: '',
        steps: [],
        expression,
        operationType: 'integral',
        error: `積分計算エラー: ${error}`
      }
    }
  }

  // 🔍 **方程式求解**
  static solveEquation(equation: string, variable: string = 'x'): CalculationResult {
    try {
      const steps: string[] = []
      
      steps.push(`方程式: ${equation}`)
      
      // Algebriteを使用した方程式求解
      const solutions = Algebrite.solve(equation, variable)
      
      steps.push(`変数 ${variable} について解く`)
      steps.push(`解: ${variable} = ${solutions}`)
      
      return {
        result: solutions.toString(),
        steps,
        expression: equation,
        operationType: 'equation'
      }
    } catch (error) {
      return {
        result: '',
        steps: [],
        expression: equation,
        operationType: 'equation',
        error: `方程式求解エラー: ${error}`
      }
    }
  }

  // 📈 **統計計算**
  static calculateStatistics(data: number[]): CalculationResult {
    try {
      const steps: string[] = []
      const n = data.length
      
      steps.push(`データ数: ${n}`)
      steps.push(`データ: [${data.join(', ')}]`)
      
      // 平均
      const mean = data.reduce((sum, x) => sum + x, 0) / n
      steps.push(`平均: (${data.join(' + ')}) / ${n} = ${mean}`)
      
      // 分散
      const variance = data.reduce((sum, x) => sum + Math.pow(x - mean, 2), 0) / n
      steps.push(`分散: ${variance}`)
      
      // 標準偏差
      const stdDev = Math.sqrt(variance)
      steps.push(`標準偏差: √${variance} = ${stdDev}`)
      
      // 最小値・最大値
      const min = Math.min(...data)
      const max = Math.max(...data)
      steps.push(`最小値: ${min}, 最大値: ${max}`)
      
      const results = {
        mean,
        variance,
        standardDeviation: stdDev,
        min,
        max,
        count: n
      }
      
      return {
        result: JSON.stringify(results, null, 2),
        steps,
        expression: `stats([${data.join(', ')}])`,
        operationType: 'statistics'
      }
    } catch (error) {
      return {
        result: '',
        steps: [],
        expression: '',
        operationType: 'statistics',
        error: `統計計算エラー: ${error}`
      }
    }
  }

  // 🔢 **行列計算**
  static calculateMatrix(operation: string, matrixA: number[][], matrixB?: number[][]): CalculationResult {
    try {
      const steps: string[] = []
      
      steps.push(`行列A: ${JSON.stringify(matrixA)}`)
      if (matrixB) {
        steps.push(`行列B: ${JSON.stringify(matrixB)}`)
      }
      
      let result: any
      
      switch (operation) {
        case 'determinant':
          if (matrixA.length !== matrixA[0].length) {
            throw new Error('正方行列である必要があります')
          }
          result = evaluate(`det(${JSON.stringify(matrixA)})`)
          steps.push(`行列式: det(A) = ${result}`)
          break
          
        case 'inverse':
          if (matrixA.length !== matrixA[0].length) {
            throw new Error('正方行列である必要があります')
          }
          result = evaluate(`inv(${JSON.stringify(matrixA)})`)
          steps.push(`逆行列: A⁻¹ = ${JSON.stringify(result)}`)
          break
          
        case 'multiply':
          if (!matrixB) throw new Error('行列Bが必要です')
          result = evaluate(`${JSON.stringify(matrixA)} * ${JSON.stringify(matrixB)}`)
          steps.push(`行列の積: A × B = ${JSON.stringify(result)}`)
          break
          
        case 'add':
          if (!matrixB) throw new Error('行列Bが必要です')
          result = evaluate(`${JSON.stringify(matrixA)} + ${JSON.stringify(matrixB)}`)
          steps.push(`行列の和: A + B = ${JSON.stringify(result)}`)
          break
          
        default:
          throw new Error(`未対応の操作: ${operation}`)
      }
      
      return {
        result: typeof result === 'object' ? JSON.stringify(result, null, 2) : result.toString(),
        steps,
        expression: `matrix_${operation}`,
        operationType: 'matrix'
      }
    } catch (error) {
      return {
        result: '',
        steps: [],
        expression: '',
        operationType: 'matrix',
        error: `行列計算エラー: ${error}`
      }
    }
  }
}
