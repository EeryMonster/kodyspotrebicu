/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: process.env.NEXT_DIST_DIR || '.next',
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://serve.affiliate.heureka.cz https://*.googlesyndication.com https://*.googleadservices.com https://*.google.com https://*.gstatic.com",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: blob: https://serve.affiliate.heureka.cz https://*.googlesyndication.com https://*.doubleclick.net https://*.google.com https://*.gstatic.com",
              "font-src 'self' https://*.gstatic.com",
              "connect-src 'self' https://serve.affiliate.heureka.cz https://*.googlesyndication.com https://*.doubleclick.net https://*.google.com https://*.gstatic.com",
              "frame-ancestors 'none'",
              // Reklamy se renderují v iframe; bez frame-src by je default-src 'self' zablokoval.
              "frame-src https://*.googlesyndication.com https://*.doubleclick.net https://*.google.com",
            ].join('; '),
          },
        ],
      },
    ]
  },
}

export default nextConfig
