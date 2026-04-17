import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'KódySpotřebičů.cz – databáze chybových kódů spotřebičů'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #1e40af 0%, #1d4ed8 50%, #2563eb 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '60px',
        }}
      >
        <div style={{ fontSize: 52, fontWeight: 800, color: 'white', marginBottom: 20, letterSpacing: -1 }}>
          KódySpotřebičů.cz
        </div>
        <div style={{ fontSize: 28, color: '#bfdbfe', textAlign: 'center', maxWidth: 800, lineHeight: 1.4 }}>
          Databáze chybových kódů praček, myček a sušiček
        </div>
        <div style={{ marginTop: 40, display: 'flex', gap: 16 }}>
          {['Pračky', 'Myčky', 'Sušičky'].map((label) => (
            <div
              key={label}
              style={{
                background: 'rgba(255,255,255,0.15)',
                borderRadius: 12,
                padding: '10px 24px',
                color: 'white',
                fontSize: 20,
              }}
            >
              {label}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  )
}
