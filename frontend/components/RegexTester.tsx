'use client'

import { useState } from 'react'
import { Input } from './ui/input'
import { Button } from './ui/button'

interface RegexTesterProps {
  initialPattern?: string
  initialText?: string
}

export default function RegexTester({ initialPattern = '', initialText = '' }: RegexTesterProps) {
  const [pattern, setPattern] = useState(initialPattern)
  const [text, setText] = useState(initialText)
  const [result, setResult] = useState<string | null>(null)

  const handleTest = () => {
    try {
      const regex = new RegExp(pattern)
      setResult(regex.test(text) ? 'Coincide' : 'No coincide')
    } catch (e) {
      setResult('Expresión inválida')
    }
  }

  return (
    <div className="space-y-2 p-4 border rounded bg-white">
      <Input
        placeholder="Expresión regular"
        value={pattern}
        onChange={(e) => setPattern(e.target.value)}
      />
      <Input
        placeholder="Texto a probar"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <Button onClick={handleTest}>Probar</Button>
      {result && <div className="font-medium">{result}</div>}
    </div>
  )
}
