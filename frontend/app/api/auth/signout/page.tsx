import { redirect } from 'next/navigation'

export default function SignOutPage() {
  // Redirect to NextAuth's default sign-out page
  redirect('/api/auth/signout')
} 