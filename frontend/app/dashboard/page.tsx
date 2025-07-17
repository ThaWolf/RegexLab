import { redirect } from 'next/navigation'
import { getAuthSession } from '@/lib/auth'

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

  let stats: {
    totalCompleted: number
    successRate: number
    correctByLevel: Record<string, number>
  } | null = null
  try {
    const res = await fetch(`${apiBase}/users/${session.user?.id}/stats`)
    stats = await res.json()
  } catch (e) {
    stats = null
  }

  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p className="mt-2">Welcome, {session.user?.name}</p>
      <p className="mt-2">Backend status: {health}</p>
      {stats && (
        <div className="mt-4 space-y-1">
          <p>Exercises completed: {stats.totalCompleted}</p>
          <p>Success rate: {(stats.successRate * 100).toFixed(0)}%</p>
          <p className="font-semibold">Correct answers by level:</p>
          <ul className="list-disc list-inside">
            {Object.entries(stats.correctByLevel).map(([lvl, count]) => (
              <li key={lvl}>
                {lvl}: {count}
              </li>
            ))}
          </ul>
        </div>
      )}
    </main>
  )
}
