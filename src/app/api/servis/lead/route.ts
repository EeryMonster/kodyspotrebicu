import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Resend } from 'resend'

const NOTIFY_RECIPIENT = process.env.NOTIFY_EMAIL || 'info@kodyspotrebicu.cz'

function sanitize(value: unknown, max: number): string {
  if (typeof value !== 'string') return ''
  return value.trim().substring(0, max)
}

function isValidZip(zip: string): boolean {
  return /^\d{3}\s?\d{2}$/.test(zip)
}

function isValidPhone(phone: string): boolean {
  const digits = phone.replace(/\D/g, '')
  return digits.length >= 9 && digits.length <= 15
}

function isValidEmail(email: string): boolean {
  if (!email) return true
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Honeypot — pole, které lidé nevyplní, ale spamboti ano
    if (body.website) {
      return NextResponse.json({ success: true }, { status: 200 })
    }

    const zipCode = sanitize(body.zipCode, 10)
    const phone = sanitize(body.phone, 30)
    const email = sanitize(body.email, 100)
    const brand = sanitize(body.brand, 50)
    const applianceType = sanitize(body.applianceType, 50)
    const errorCode = sanitize(body.errorCode, 20)
    const description = sanitize(body.description, 2000)

    if (!zipCode || !isValidZip(zipCode)) {
      return NextResponse.json({ error: 'Neplatné PSČ (formát 12345 nebo 123 45)' }, { status: 400 })
    }
    if (!phone || !isValidPhone(phone)) {
      return NextResponse.json({ error: 'Neplatné telefonní číslo' }, { status: 400 })
    }
    if (email && !isValidEmail(email)) {
      return NextResponse.json({ error: 'Neplatný e-mail' }, { status: 400 })
    }
    if (!description || description.length < 10) {
      return NextResponse.json({ error: 'Prosím popište problém alespoň 10 znaky' }, { status: 400 })
    }

    const forwardedFor = request.headers.get('x-forwarded-for')
    const ipAddress = forwardedFor ? forwardedFor.split(',')[0].trim() : null

    const lead = await prisma.serviceLead.create({
      data: {
        zipCode,
        phone,
        email: email || null,
        brand: brand || null,
        applianceType: applianceType || null,
        errorCode: errorCode || null,
        description,
        ipAddress,
      },
    })

    if (process.env.RESEND_API_KEY) {
      const resend = new Resend(process.env.RESEND_API_KEY)
      const subject = `Nová poptávka servisu — ${brand || 'neuvedeno'} ${applianceType || ''} ${errorCode ? `(${errorCode})` : ''}`.trim()
      const html = `
        <h2>Nová poptávka servisu spotřebiče</h2>
        <p><strong>PSČ:</strong> ${zipCode}</p>
        <p><strong>Telefon:</strong> ${phone}</p>
        ${email ? `<p><strong>E-mail:</strong> ${email}</p>` : ''}
        ${brand ? `<p><strong>Značka:</strong> ${brand}</p>` : ''}
        ${applianceType ? `<p><strong>Typ spotřebiče:</strong> ${applianceType}</p>` : ''}
        ${errorCode ? `<p><strong>Chybový kód:</strong> ${errorCode}</p>` : ''}
        <p><strong>Popis problému:</strong></p>
        <blockquote>${description.replace(/\n/g, '<br>')}</blockquote>
        <hr>
        <p style="color:#666;font-size:12px">Lead ID: ${lead.id} • IP: ${ipAddress || 'neznámá'} • ${new Date().toLocaleString('cs-CZ')}</p>
      `
      await resend.emails.send({
        from: 'Servis <notifikace@kodyspotrebicu.cz>',
        to: NOTIFY_RECIPIENT,
        subject,
        html,
        replyTo: email || undefined,
      }).catch((err: unknown) => console.error('Service lead email notification failed', err))
    }

    return NextResponse.json({ success: true, id: lead.id })
  } catch (error) {
    console.error('Failed to create service lead', error)
    return NextResponse.json({ error: 'Interní chyba serveru' }, { status: 500 })
  }
}
