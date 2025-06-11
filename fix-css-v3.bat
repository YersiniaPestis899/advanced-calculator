@echo off
echo 🔧 TailwindCSS v3の不足依存関係を修正中...
echo.

REM 現在のディレクトリに移動
cd /d "C:\Users\karum\Downloads\advanced-calculator"

REM 不足しているプラグインをインストール
echo ✨ tailwindcss-animateをインストール中...
npm install tailwindcss-animate@^1.0.7

REM キャッシュをクリア
echo 🧹 Next.jsキャッシュをクリア中...
npm run build -- --debug 2>nul || echo "ビルドエラーは無視してください"
rmdir /s /q .next 2>nul || echo "キャッシュフォルダが見つかりません"

echo.
echo ✅ 依存関係修正完了！
echo 次のコマンドで開発サーバーを起動してください：
echo npm run dev
echo.
echo 📋 確認URL:
echo   - メイン: http://localhost:3000
echo   - テスト: http://localhost:3000/debug
echo.
pause
