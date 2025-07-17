import NextAuth from 'next-auth'
import { authOptions } from '@/lib/auth'

export const GET = async (req: Request) => {
  try {
    // @ts-ignore
    return await NextAuth(authOptions)(req)
  } catch (error) {
    console.error('NextAuth GET error:', error)
    return new Response('Internal Server Error', { status: 500 })
  }
}

export const POST = async (req: Request) => {
  try {
    // @ts-ignore
    return await NextAuth(authOptions)(req)
  } catch (error) {
    console.error('NextAuth POST error:', error)
    return new Response('Internal Server Error', { status: 500 })
  }
} 