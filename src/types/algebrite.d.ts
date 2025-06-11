declare module 'algebrite' {
  export function eval(expr: string): any;
  export function derivative(expr: string, variable: string): string;
  export function integral(expr: string, variable: string): string;
  export function factor(expr: string): string;
  export function expand(expr: string): string;
  export function simplify(expr: string): string;
  export function solve(equation: string, variable: string): string[];
  export function float(expr: string): number;
  export function run(script: string): any;
}
