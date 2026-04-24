import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const inter = Inter({ subsets: ['latin', 'latin-ext'] })

export const metadata: Metadata = {
  title: {
    default: 'Chybové kódy spotřebičů – databáze chyb praček, myček a sušiček',
    template: '%s | KódySpotřebičů.cz',
  },
  description:
    'Databáze chybových kódů praček, myček a sušiček. Najděte příčinu chyby, zjistěte závažnost a naučte se, co dělat dál.',
  metadataBase: new URL('https://www.kodyspotrebicu.cz'),
  openGraph: {
    siteName: 'KódySpotřebičů.cz',
    type: 'website',
    locale: 'cs_CZ',
  },
  twitter: {
    card: 'summary_large_image',
  },
  other: {
    'google-adsense-account': 'ca-pub-1027768572288829',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="cs">
      <head>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1027768572288829"
          crossOrigin="anonymous"
          strategy="beforeInteractive"
        />
      </head>
      <body className={`${inter.className} min-h-screen flex flex-col bg-gray-50`}>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:px-4 focus:py-2 focus:bg-white focus:text-blue-700 focus:border focus:border-blue-700 focus:rounded focus:shadow-lg focus:outline-none"
        >
          Přeskočit na obsah
        </a>
        <Header />
        <main id="main-content" className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
