// TailwindCSS動作確認用テストページ
export default function DebugPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
          🧪 TailwindCSS動作テスト
        </h1>
        
        {/* 基本スタイルテスト */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            📋 基本スタイルテスト
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-red-100 p-4 rounded-lg">
              <p className="text-red-800 font-medium">赤色背景</p>
            </div>
            <div className="bg-green-100 p-4 rounded-lg">
              <p className="text-green-800 font-medium">緑色背景</p>
            </div>
            <div className="bg-blue-100 p-4 rounded-lg">
              <p className="text-blue-800 font-medium">青色背景</p>
            </div>
          </div>
        </div>

        {/* レスポンシブテスト */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            📱 レスポンシブテスト
          </h2>
          <div className="text-center">
            <div className="block sm:hidden text-pink-600 font-bold">
              📱 モバイル表示
            </div>
            <div className="hidden sm:block md:hidden text-purple-600 font-bold">
              📱 タブレット表示
            </div>
            <div className="hidden md:block text-indigo-600 font-bold">
              💻 デスクトップ表示
            </div>
          </div>
        </div>

        {/* ホバーエフェクトテスト */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            ✨ ホバーエフェクトテスト
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200">
              色変化ボタン
            </button>
            <button className="bg-green-500 hover:scale-105 text-white font-bold py-3 px-6 rounded-lg transition-transform duration-200">
              拡大ボタン
            </button>
          </div>
        </div>

        {/* カスタムCSSテスト */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            🎨 カスタムCSSテスト
          </h2>
          <div className="space-y-4">
            <div className="calculator-button bg-gray-200 text-gray-800 text-center cursor-pointer">
              カスタム計算機ボタン
            </div>
            <div className="calculator-display">
              <div className="calculation-step">計算ステップ表示</div>
              <div className="text-xl">12345</div>
            </div>
          </div>
        </div>

        {/* 診断情報 */}
        <div className="bg-gray-800 text-green-400 rounded-lg p-6 mt-6 font-mono text-sm">
          <h3 className="text-lg font-bold mb-2">🔍 診断情報</h3>
          <div className="space-y-1">
            <div>✅ このページが正しく表示されていれば、TailwindCSSは動作しています</div>
            <div>❌ スタイルが適用されていない場合は、設定に問題があります</div>
            <div>🔧 修正方法：</div>
            <div className="ml-4">1. downgrade-tailwind.bat を実行</div>
            <div className="ml-4">2. または install-dependencies.bat を実行</div>
          </div>
        </div>
      </div>
    </div>
  );
}
