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
      setResult(regex.test(text) ? 'Matches' : 'No match')
    } catch (e) {
      setResult('Invalid expression')
    }
  }

  return (
    <div className="space-y-2 p-4 border rounded bg-white">
      <Input
        placeholder="Regular expression"
        value={pattern}
        onChange={(e) => setPattern(e.target.value)}
      />
      <Input
        placeholder="Text to test"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <Button onClick={handleTest}>Test</Button>
      {result && <div className="font-medium">{result}</div>}
    </div>
  )
}
