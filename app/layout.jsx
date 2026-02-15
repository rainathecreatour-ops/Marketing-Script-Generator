import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Marketing Script Generator - AI-Powered Social Media Scripts',
  description: 'Generate professional marketing scripts for TikTok, Instagram, YouTube, and Facebook with AI',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
