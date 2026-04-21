import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const BAD_WORDS = ['kurva', 'píča', 'kokot', 'debil', 'kretén', 'hovno', 'prdel', 'zmrd', 'idiot']

export async function POST(request: Request) {
  try {
    const { authorName, content, errorCodeId } = await request.json()

    if (!authorName || !content || !errorCodeId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const contentLower = content.toLowerCase()
    
    // Automatic moderation
    let isApproved = true

    // Check for links/spam
    if (
      contentLower.includes('http://') ||
      contentLower.includes('https://') ||
      contentLower.includes('<a') ||
      contentLower.includes('www.')
    ) {
      isApproved = false
    }

    // Check for bad words
    if (BAD_WORDS.some(word => contentLower.includes(word))) {
      isApproved = false
    }

    const comment = await prisma.comment.create({
      data: {
        authorName: authorName.trim().substring(0, 50),
        content: content.trim().substring(0, 1000),
        errorCodeId,
        isApproved,
      },
    })

    if (process.env.RESEND_API_KEY && process.env.NOTIFY_EMAIL) {
      const status = isApproved ? '✅ schválený' : '⏳ čeká na schválení'
      await resend.emails.send({
        from: 'Komentáře <notifikace@kodyspotrebicu.cz>',
        to: process.env.NOTIFY_EMAIL,
        subject: `Nový komentář od ${comment.authorName} [${status}]`,
        html: `
          <p><strong>Autor:</strong> ${comment.authorName}</p>
          <p><strong>Status:</strong> ${status}</p>
          <p><strong>Komentář:</strong></p>
          <blockquote>${comment.content}</blockquote>
          <p><a href="https://chyby-spotrebicu.cz/admin/comments">Zobrazit v adminu</a></p>
        `,
      }).catch((err: unknown) => console.error('Email notification failed', err))
    }

    return NextResponse.json({ success: true, comment })
  } catch (error) {
    console.error('Failed to create comment', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
