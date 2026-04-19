import { NextResponse } from 'next/server'

// Simple helpful rating endpoint – logs to console for now.
// In the future, this can be stored in a DB table for analytics.
export async function POST(request: Request) {
  try {
    const { errorCodeId, helpful } = await request.json()
    if (!errorCodeId || typeof helpful !== 'boolean') {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
    }
    console.log(`[helpful] errorCodeId=${errorCodeId} helpful=${helpful}`)
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
