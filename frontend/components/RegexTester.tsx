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
    <div className="space-y-4 p-6 rounded-2xl bg-garden-light dark:bg-garden-dark border border-earth-light dark:border-garden-dark shadow-soft transition-colors">
      <h2 className="text-xl font-semibold mb-2 text-garden-dark dark:text-earth-light">Regex Tester</h2>
      <Input
        placeholder="Regular expression"
        value={pattern}
        onChange={(e) => setPattern(e.target.value)}
        className="bg-earth-light dark:bg-garden-dark border border-garden dark:border-earth-light focus:ring-2 focus:ring-sky transition-colors"
      />
      <Input
        placeholder="Text to test"
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="bg-earth-light dark:bg-garden-dark border border-garden dark:border-earth-light focus:ring-2 focus:ring-sky transition-colors"
      />
      <Button onClick={handleTest} className="bg-sky hover:bg-sky-dark text-white font-semibold px-6 py-2 rounded-lg transition-colors">
        Test
      </Button>
      {result && (
        <div className="font-medium mt-2 text-garden-dark dark:text-earth-light">
          {result}
        </div>
      )}
    </div>
  )
}
