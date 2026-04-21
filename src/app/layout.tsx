import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
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
    card: 'summary',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="cs">
      <body className={`${inter.className} min-h-screen flex flex-col bg-gray-50`}>
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
