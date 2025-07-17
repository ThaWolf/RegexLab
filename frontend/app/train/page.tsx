'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { useSession } from 'next-auth/react'

const CodeMirror = dynamic(() => import('@uiw/react-codemirror'), { ssr: false })

interface Exercise {
  id: number
  inputString: string
  description: string
}

export default function TrainPage() {
  const [exercise, setExercise] = useState<Exercise | null>(null)
  const [regex, setRegex] = useState('')
  const [result, setResult] = useState<string | null>(null)
  const [level, setLevel] = useState<'basic' | 'intermediate' | 'advanced'>('basic')
  const { data: session } = useSession()

  const apiBase = process.env.NEXT_PUBLIC_API_URL || '/api'

  useEffect(() => {
    fetch(`${apiBase}/trainings/random?level=${level}`)
      .then((res) => res.json())
      .then(setExercise)
  }, [apiBase, level])

  const handleValidate = async () => {
    if (!exercise) return
    const res = await fetch(`${apiBase}/trainings/validate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: session?.user?.id,
        id: exercise.id,
        regex,
      }),
    })
    const data = await res.json()
    setResult(data.valid ? 'Correct!' : 'Incorrect')
  }

  if (!exercise) {
    return <p className="p-4">Loading...</p>
  }

  return (
    <main className="p-4 max-w-2xl mx-auto">
      <div className="bg-garden-light dark:bg-garden-dark border border-earth-light dark:border-garden-dark rounded-2xl shadow-soft p-6 space-y-6 transition-colors">
        <h1 className="text-2xl font-bold text-garden-dark dark:text-earth-light mb-2">Training</h1>
        <div className="flex items-center gap-4">
          <label htmlFor="level" className="font-medium text-garden-dark dark:text-earth-light">Level:</label>
          <select
            id="level"
            className="border border-garden dark:border-earth-light rounded px-2 py-1 bg-earth-light dark:bg-garden-dark text-garden-dark dark:text-earth-light focus:ring-2 focus:ring-sky transition-colors"
            value={level}
            onChange={(e) => setLevel(e.target.value as any)}
          >
            <option value="basic">Basic</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>
        <p className="text-lg text-garden-dark dark:text-earth-light">{exercise.description}</p>
        <div className="p-3 bg-earth-light dark:bg-garden-dark border border-garden dark:border-earth-light rounded font-mono text-base text-sky-dark dark:text-sky-light">
          {exercise.inputString}
        </div>
        <CodeMirror value={regex} height="100px" onChange={(val) => setRegex(val)} />
        <button
          onClick={handleValidate}
          className="px-6 py-2 bg-sky hover:bg-sky-dark text-white font-semibold rounded-lg transition-colors"
        >
          Validate
        </button>
        {result && <div className="font-bold mt-2 text-garden-dark dark:text-earth-light">{result}</div>}
      </div>
    </main>
  )
}
