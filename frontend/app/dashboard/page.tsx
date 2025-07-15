import { redirect } from 'next/navigation'
import { getAuthSession } from '../../lib/auth'

export default async function DashboardPage() {
  const session = await getAuthSession()
  if (!session) {
    redirect('/api/auth/signin')
  }

  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p className="mt-2">Bienvenido, {session.user?.name}</p>
    </main>
  )
}
