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
    setResult(data.valid ? '¡Correcto!' : 'Incorrecto')
  }

  if (!exercise) {
    return <p className="p-4">Cargando...</p>
  }

  return (
    <main className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Entrenamiento</h1>
      <select
        className="border p-1 rounded"
        value={level}
        onChange={(e) => setLevel(e.target.value as any)}
      >
        <option value="basic">Básico</option>
        <option value="intermediate">Intermedio</option>
        <option value="advanced">Avanzado</option>
      </select>
      <p>{exercise.description}</p>
      <div className="p-2 bg-gray-100 rounded font-mono">
        {exercise.inputString}
      </div>
      <CodeMirror value={regex} height="100px" onChange={(val) => setRegex(val)} />
      <button
        onClick={handleValidate}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        Validar
      </button>
      {result && <div className="font-bold">{result}</div>}
    </main>
  )
}
