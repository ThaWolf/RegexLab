import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  // NextAuth debug logging endpoint
  // In production, we can either log or ignore these requests
  if (process.env.NODE_ENV === 'development') {
    try {
      const body = await request.json()
      console.log('NextAuth Debug Log:', body)
    } catch (error) {
      console.log('NextAuth Debug Log: Unable to parse body')
    }
  }
  
  return NextResponse.json({ success: true })
}

export async function GET() {
  return NextResponse.json({ success: true })
} 