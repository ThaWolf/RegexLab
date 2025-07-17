import { redirect } from 'next/navigation'

export default function AuthErrorPage({
  searchParams,
}: {
  searchParams: { error?: string }
}) {
  const error = searchParams.error

  // Redirect to home page with error message
  if (error) {
    redirect(`/?error=${encodeURIComponent(error)}`)
  }

  // Default redirect to home page
  redirect('/')
} 