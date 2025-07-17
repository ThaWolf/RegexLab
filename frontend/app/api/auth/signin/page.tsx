import { redirect } from 'next/navigation'

export default function SignInPage() {
  // Redirect to NextAuth's default sign-in page
  redirect('/api/auth/signin/google')
} 