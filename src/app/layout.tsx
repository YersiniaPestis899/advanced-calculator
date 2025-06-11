import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Advanced Calculator - AI搭載高機能計算機',
  description: 'AWS Bedrock Claude 4 Opus搭載の高機能計算機。基本計算から高等数学、3Dグラフ表示、画像解析まで対応',
  keywords: '計算機, 電卓, 数学, グラフ, AI, Claude, AWS Bedrock, 3D, 微分, 積分',
  authors: [{ name: 'Advanced Calculator Team' }],
  creator: 'Advanced Calculator',
  publisher: 'Advanced Calculator',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#3B82F6' },
    { media: '(prefers-color-scheme: dark)', color: '#1E40AF' }
  ],
  openGraph: {
    title: 'Advanced Calculator - AI搭載高機能計算機',
    description: 'Claude 4 Opus搭載の次世代計算機で数学問題を解こう',
    type: 'website',
    locale: 'ja_JP',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Advanced Calculator',
    description: 'AI搭載高機能計算機',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  manifest: '/manifest.json',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Advanced Calculator" />
      </head>
      <body className={`${inter.className} antialiased`} suppressHydrationWarning>
        {children}
      </body>
    </html>
  )
}
