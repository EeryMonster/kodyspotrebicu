import type { Metadata, Viewport } from 'next'
import { Inter, Space_Grotesk, JetBrains_Mono } from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  variable: '--font-sans',
})
const spaceGrotesk = Space_Grotesk({
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  variable: '--font-display',
  weight: ['500', '600', '700'],
})
const jetBrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mono',
  weight: ['400', '500', '600', '700'],
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#1e3a8a',
}

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
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="cs" className={`${inter.variable} ${spaceGrotesk.variable} ${jetBrainsMono.variable}`}>
      <body className="font-sans min-h-screen flex flex-col bg-gray-50">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:px-4 focus:py-2 focus:bg-white focus:text-blue-700 focus:border focus:border-blue-700 focus:rounded focus:shadow-lg focus:outline-none"
        >
          Přeskočit na obsah
        </a>
        <Header />
        <main id="main-content" className="flex-1">{children}</main>
        <Footer />
        {process.env.NEXT_PUBLIC_HEUREKA_POSITION_ID && (
          <Script
            src="https://serve.affiliate.heureka.cz/js/trixam.min.js"
            strategy="afterInteractive"
          />
        )}
      </body>
    </html>
  )
}
