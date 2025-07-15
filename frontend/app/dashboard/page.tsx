import { redirect } from 'next/navigation'
import { getAuthSession } from '../../lib/auth'

export default async function DashboardPage() {
  const session = await getAuthSession()
  if (!session) {
    redirect('/api/auth/signin')
  }

  const apiBase = process.env.NEXT_PUBLIC_API_URL || '/api'
  let health = 'Unknown'
  try {
    const res = await fetch(`${apiBase}/health`)
    health = await res.text()
  } catch (e) {
    health = 'Error'
  }

  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p className="mt-2">Bienvenido, {session.user?.name}</p>
      <p className="mt-2">Estado del backend: {health}</p>
    </main>
  )
}
