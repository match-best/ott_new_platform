import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Providers } from "@/components/providers"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "StreamPlay - Your Ultimate OTT Platform",
  description: "Watch the latest movies, TV shows, and exclusive content. Stream in HD with StreamPlay - Your gateway to endless entertainment.",
  keywords: ["streaming", "movies", "TV shows", "entertainment", "OTT platform"],
  authors: [{ name: "StreamPlay Team" }],
  viewport: "width=device-width, initial-scale=1",
  icons: {
    icon: [
      { url: 'https://uxwing.com/wp-content/themes/uxwing/download/video-photography-multimedia/red-play-button-icon.png', sizes: '32x32', type: 'image/png' },
      { url: 'https://uxwing.com/wp-content/themes/uxwing/download/video-photography-multimedia/red-play-button-icon.png', sizes: '16x16', type: 'image/png' },
      { url: 'https://uxwing.com/wp-content/themes/uxwing/download/video-photography-multimedia/red-play-button-icon.svg', type: 'image/svg+xml' },
    ],
    apple: [
      { url: 'https://uxwing.com/wp-content/themes/uxwing/download/video-photography-multimedia/red-play-button-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      { rel: 'mask-icon', url: 'https://uxwing.com/wp-content/themes/uxwing/download/video-photography-multimedia/red-play-button-icon.svg', color: '#dc2626' },
    ]
  },
  manifest: '/site.webmanifest',
  themeColor: '#dc2626',
  openGraph: {
    title: 'StreamPlay - Your Ultimate OTT Platform',
    description: 'Watch the latest movies, TV shows, and exclusive content in HD',
    type: 'website',
    locale: 'en_US',
    siteName: 'StreamPlay',
    images: [
      {
        url: 'https://uxwing.com/wp-content/themes/uxwing/download/video-photography-multimedia/red-play-button-icon.png',
        width: 512,
        height: 512,
        alt: 'StreamPlay - Ultimate OTT Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'StreamPlay - Your Ultimate OTT Platform',
    description: 'Watch the latest movies, TV shows, and exclusive content in HD',
    images: ['https://uxwing.com/wp-content/themes/uxwing/download/video-photography-multimedia/red-play-button-icon.png'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}
