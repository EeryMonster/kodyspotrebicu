import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

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

    return NextResponse.json({ success: true, comment })
  } catch (error) {
    console.error('Failed to create comment', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
