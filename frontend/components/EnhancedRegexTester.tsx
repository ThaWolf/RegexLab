'use client'

import { useState, useEffect } from 'react'
import { Input } from './ui/input'
import { Button } from './ui/button'

interface RegexExplanation {
  pattern: string
  description: string
  components: Array<{
    type: string
    value: string
    description: string
    position: { start: number; end: number }
  }>
  examples: string[]
  warnings: string[]
}

interface RegexTestResult {
  hasMatches: boolean
  matches: string[]
  groups: string[][]
  positions: { start: number; end: number }[]
}

interface CommonPattern {
  name: string
  pattern: string
  description: string
}

export default function EnhancedRegexTester() {
  const [pattern, setPattern] = useState('')
  const [text, setText] = useState('')
  const [flags, setFlags] = useState('g')
  const [explanation, setExplanation] = useState<RegexExplanation | null>(null)
  const [testResult, setTestResult] = useState<RegexTestResult | null>(null)
  const [commonPatterns, setCommonPatterns] = useState<CommonPattern[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const apiBase = process.env.NEXT_PUBLIC_API_URL || '/api'

  useEffect(() => {
    fetchCommonPatterns()
  }, [])

  const fetchCommonPatterns = async () => {
    try {
      const response = await fetch(`${apiBase}/regex/patterns`)
      const data = await response.json()
      setCommonPatterns(data.patterns)
    } catch (error) {
      console.error('Failed to fetch common patterns:', error)
    }
  }

  const explainRegex = async () => {
    if (!pattern.trim()) return

    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`${apiBase}/regex/explain`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pattern, flags })
      })

      if (!response.ok) {
        throw new Error('Failed to explain regex')
      }

      const data = await response.json()
      setExplanation(data)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to explain regex')
    } finally {
      setLoading(false)
    }
  }

  const testRegex = async () => {
    if (!pattern.trim() || !text.trim()) return

    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`${apiBase}/regex/test`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pattern, text, flags })
      })

      if (!response.ok) {
        throw new Error('Failed to test regex')
      }

      const data = await response.json()
      setTestResult(data)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to test regex')
    } finally {
      setLoading(false)
    }
  }

  const selectPattern = (patternData: CommonPattern) => {
    setPattern(patternData.pattern)
    setText('')
    setExplanation(null)
    setTestResult(null)
  }

  const highlightMatches = () => {
    if (!testResult?.hasMatches || !text) return text

    let highlightedText = text
    const positions = [...testResult.positions].reverse() // Reverse to maintain indices

    positions.forEach(({ start, end }) => {
      const before = highlightedText.slice(0, start)
      const match = highlightedText.slice(start, end)
      const after = highlightedText.slice(end)
      highlightedText = `${before}<mark class="bg-yellow-200 px-1 rounded">${match}</mark>${after}`
    })

    return highlightedText
  }

  return (
    <div className="space-y-6 p-6 border rounded-lg bg-white shadow-sm">
      <div className="space-y-4">
        <h2 className="text-xl font-bold">Enhanced Regex Tester</h2>
        
        {/* Common Patterns */}
        <div>
          <h3 className="text-sm font-medium mb-2">Common Patterns</h3>
          <div className="flex flex-wrap gap-2">
            {commonPatterns.map((patternData) => (
              <button
                key={patternData.name}
                onClick={() => selectPattern(patternData)}
                className="px-3 py-1 text-xs bg-blue-100 text-blue-800 rounded hover:bg-blue-200 transition-colors"
                title={patternData.description}
              >
                {patternData.name}
              </button>
            ))}
          </div>
        </div>

        {/* Regex Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Regex Pattern</label>
          <div className="flex gap-2">
            <Input
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
              placeholder="Enter regex pattern..."
              className="font-mono"
            />
            <Input
              value={flags}
              onChange={(e) => setFlags(e.target.value)}
              placeholder="Flags (g, i, m, s, u, y)"
              className="w-32"
            />
          </div>
        </div>

        {/* Test Text */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Test Text</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter text to test against..."
            className="w-full p-3 border rounded-md resize-none h-24"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button onClick={explainRegex} disabled={loading || !pattern.trim()}>
            {loading ? 'Explaining...' : 'Explain Pattern'}
          </Button>
          <Button onClick={testRegex} disabled={loading || !pattern.trim() || !text.trim()}>
            {loading ? 'Testing...' : 'Test Regex'}
          </Button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        {/* Explanation */}
        {explanation && (
          <div className="space-y-3 p-4 bg-blue-50 rounded-md">
            <h3 className="font-medium">Pattern Explanation</h3>
            <p className="text-sm text-gray-700">{explanation.description}</p>
            
            {explanation.components.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-2">Components:</h4>
                <div className="space-y-1">
                  {explanation.components.map((component, index) => (
                    <div key={index} className="text-xs bg-white p-2 rounded border">
                      <span className="font-mono text-blue-600">{component.value}</span>
                      <span className="text-gray-600 ml-2">- {component.description}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {explanation.warnings.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-2 text-orange-800">Warnings:</h4>
                <ul className="text-xs text-orange-700 space-y-1">
                  {explanation.warnings.map((warning, index) => (
                    <li key={index}>• {warning}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Test Results */}
        {testResult && (
          <div className="space-y-3 p-4 bg-green-50 rounded-md">
            <h3 className="font-medium">Test Results</h3>
            
            <div className="text-sm">
              <p className="mb-2">
                <span className="font-medium">Status:</span>{' '}
                <span className={testResult.hasMatches ? 'text-green-600' : 'text-red-600'}>
                  {testResult.hasMatches ? 'Matches found' : 'No matches'}
                </span>
              </p>
              
              {testResult.hasMatches && (
                <>
                  <p className="mb-2">
                    <span className="font-medium">Matches found:</span> {testResult.matches.length}
                  </p>
                  
                  <div className="mb-3">
                    <span className="font-medium">Highlighted text:</span>
                    <div 
                      className="mt-1 p-2 bg-white border rounded text-sm"
                      dangerouslySetInnerHTML={{ __html: highlightMatches() }}
                    />
                  </div>
                  
                  {testResult.matches.length > 0 && (
                    <div>
                      <span className="font-medium">Matches:</span>
                      <div className="mt-1 space-y-1">
                        {testResult.matches.map((match, index) => (
                          <div key={index} className="text-xs bg-white p-1 rounded border font-mono">
                            "{match}" at position {testResult.positions[index]?.start}-{testResult.positions[index]?.end}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 