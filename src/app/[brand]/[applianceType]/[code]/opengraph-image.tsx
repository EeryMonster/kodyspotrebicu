import { ImageResponse } from 'next/og'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'
// Cache obraz na 24 h — OG image se málokdy mění a chceme minimalizovat DB volaní.
// Cold-start Neon může první dotaz selhat / timeoutnout, což historicky generovalo 5xx
// hlášené GSC jako "Chyba serveru" na OG image URL.
export const revalidate = 86400
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

interface Props {
  params: { brand: string; applianceType: string; code: string }
}

const APPLIANCE_LABELS: Record<string, string> = {
  pracky: 'Pračka',
  mycky: 'Myčka',
  susicky: 'Sušička',
}

export default async function Image({ params }: Props) {
  // Tvrdý timeout 2s na DB query — pokud Neon studený a nestihne odpovědět,
  // pokračujeme s fallback obrázkem postaveným z URL params (lepší než 5xx).
  const dbPromise = prisma.errorCode
    .findUnique({
      where: { slug: params.code },
      select: { code: true, title: true, brand: true, applianceType: true },
    })
    .catch(() => null)
  const timeoutPromise = new Promise<null>((resolve) => setTimeout(() => resolve(null), 2000))
  const entry = await Promise.race([dbPromise, timeoutPromise])

  const code = entry?.code ?? params.code.toUpperCase()
  const title = entry?.title ?? 'Chybový kód spotřebiče'
  const brand = entry?.brand ?? (params.brand.charAt(0).toUpperCase() + params.brand.slice(1))
  const applianceLabel = APPLIANCE_LABELS[params.applianceType] ?? ''

  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #1e40af 0%, #1d4ed8 50%, #2563eb 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '60px',
        }}
      >
        <div style={{ fontSize: 28, fontWeight: 700, color: '#bfdbfe' }}>
          KódySpotřebičů.cz
        </div>
        <div>
          <div
            style={{
              background: 'rgba(255,255,255,0.15)',
              borderRadius: 16,
              padding: '16px 32px',
              display: 'inline-block',
              fontSize: 64,
              fontWeight: 900,
              color: 'white',
              fontFamily: 'monospace',
              marginBottom: 24,
            }}
          >
            {code}
          </div>
          <div style={{ fontSize: 40, fontWeight: 700, color: 'white', lineHeight: 1.2, marginBottom: 16 }}>
            {title}
          </div>
          <div style={{ fontSize: 24, color: '#bfdbfe' }}>
            {brand}{applianceLabel ? ` · ${applianceLabel}` : ''}
          </div>
        </div>
      </div>
    ),
    { ...size }
  )
}
