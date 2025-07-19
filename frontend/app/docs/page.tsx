'use client'

import { useState } from 'react'
import { Button } from '../../components/ui/button'

interface RegexPattern {
  name: string
  pattern: string
  description: string
  example: string
  category: string
}

const commonPatterns: RegexPattern[] = [
  {
    name: 'Email',
    pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
    description: 'Matches a valid email address',
    example: 'user@example.com',
    category: 'Validation'
  },
  {
    name: 'Phone Number',
    pattern: '^\\+?[1-9]\\d{1,14}$',
    description: 'Matches international phone numbers',
    example: '+1234567890',
    category: 'Validation'
  },
  {
    name: 'URL',
    pattern: '^https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)$',
    description: 'Matches valid URLs',
    example: 'https://example.com',
    category: 'Validation'
  },
  {
    name: 'Date (YYYY-MM-DD)',
    pattern: '^\\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\\d|3[01])$',
    description: 'Matches dates in YYYY-MM-DD format',
    example: '2024-01-15',
    category: 'Validation'
  },
  {
    name: 'Credit Card',
    pattern: '^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|6(?:011|5[0-9]{2})[0-9]{12}|(?:2131|1800|35\\d{3})\\d{11})$',
    description: 'Matches common credit card formats',
    example: '4111111111111111',
    category: 'Validation'
  },
  {
    name: 'IPv4 Address',
    pattern: '\\b(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\b',
    description: 'Matches valid IPv4 addresses',
    example: '192.168.1.1',
    category: 'Networking'
  },
  {
    name: 'Strong Password',
    pattern: '(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}',
    description: 'Matches strong passwords with lowercase, uppercase, digit, and special character',
    example: 'MyPass123!',
    category: 'Security'
  },
  {
    name: 'Time (24h)',
    pattern: '([01]?[0-9]|2[0-3]):[0-5][0-9]',
    description: 'Matches 24-hour time format',
    example: '14:30',
    category: 'Time'
  },
  {
    name: 'HTML Tags',
    pattern: '<([a-z]+)(?:[^<]+)*(?:>(?:<\\/[a-z]+>)*<\\/\\1>|\\/>)',
    description: 'Matches properly closed HTML tags',
    example: '<div>content</div>',
    category: 'Markup'
  }
]

const regexComponents = [
  {
    category: 'Anchors',
    items: [
      { symbol: '^', description: 'Start of string or line' },
      { symbol: '$', description: 'End of string or line' },
      { symbol: '\\b', description: 'Word boundary' },
      { symbol: '\\B', description: 'Non-word boundary' }
    ]
  },
  {
    category: 'Quantifiers',
    items: [
      { symbol: '*', description: 'Zero or more (greedy)' },
      { symbol: '+', description: 'One or more (greedy)' },
      { symbol: '?', description: 'Zero or one (greedy)' },
      { symbol: '{n}', description: 'Exactly n times' },
      { symbol: '{n,}', description: 'n or more times' },
      { symbol: '{n,m}', description: 'Between n and m times' },
      { symbol: '*?', description: 'Zero or more (lazy)' },
      { symbol: '+?', description: 'One or more (lazy)' },
      { symbol: '??', description: 'Zero or one (lazy)' }
    ]
  },
  {
    category: 'Character Classes',
    items: [
      { symbol: '[abc]', description: 'Any character from a, b, or c' },
      { symbol: '[^abc]', description: 'Any character except a, b, or c' },
      { symbol: '[a-z]', description: 'Any lowercase letter' },
      { symbol: '[A-Z]', description: 'Any uppercase letter' },
      { symbol: '[0-9]', description: 'Any digit' },
      { symbol: '\\d', description: 'Any digit (same as [0-9])' },
      { symbol: '\\D', description: 'Any non-digit' },
      { symbol: '\\w', description: 'Word character (same as [a-zA-Z0-9_])' },
      { symbol: '\\W', description: 'Non-word character' },
      { symbol: '\\s', description: 'Whitespace character' },
      { symbol: '\\S', description: 'Non-whitespace character' }
    ]
  },
  {
    category: 'Groups',
    items: [
      { symbol: '(abc)', description: 'Capturing group' },
      { symbol: '(?:abc)', description: 'Non-capturing group' },
      { symbol: '(?<name>abc)', description: 'Named capturing group' },
      { symbol: '\\1', description: 'Backreference to first group' },
      { symbol: '\\k<name>', description: 'Backreference to named group' }
    ]
  },
  {
    category: 'Lookarounds',
    items: [
      { symbol: '(?=abc)', description: 'Positive lookahead' },
      { symbol: '(?!abc)', description: 'Negative lookahead' },
      { symbol: '(?<=abc)', description: 'Positive lookbehind' },
      { symbol: '(?<!abc)', description: 'Negative lookbehind' }
    ]
  }
]

export default function DocsPage() {
  const [activeTab, setActiveTab] = useState<'getting-started' | 'patterns' | 'reference'>('getting-started')
  const [searchQuery, setSearchQuery] = useState('')
  const [copiedPattern, setCopiedPattern] = useState<string | null>(null)
  const [testPattern, setTestPattern] = useState<string>('')
  const [testText, setTestText] = useState<string>('')
  const [testResult, setTestResult] = useState<string[]>([])

  const filteredPatterns = commonPatterns.filter(pattern =>
    pattern.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pattern.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pattern.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const copyToClipboard = async (text: string, patternName: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedPattern(patternName)
      setTimeout(() => setCopiedPattern(null), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  const testPatternInRealTime = () => {
    if (!testPattern.trim() || !testText.trim()) {
      setTestResult([])
      return
    }

    try {
      const regex = new RegExp(testPattern, 'g')
      const matches = testText.match(regex) || []
      setTestResult(matches)
    } catch (error) {
      setTestResult([])
    }
  }

  const usePatternInPlayground = (pattern: string) => {
    // Store the pattern in localStorage for the playground to pick up
    localStorage.setItem('regexlab-pattern', pattern)
    window.location.href = '/'
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <section className="text-center space-y-6 py-12">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-primary-600 via-secondary-600 to-accent-600 bg-clip-text text-transparent">
          RegexLab Documentation
        </h1>
        <p className="text-xl text-text-secondary-light dark:text-text-secondary-dark max-w-4xl mx-auto leading-relaxed">
          Master regular expressions with our comprehensive guide. Learn the fundamentals, explore common patterns, and practice with interactive examples.
        </p>
      </section>

      {/* Navigation Tabs */}
      <section className="max-w-6xl mx-auto">
        <div className="flex border-b border-border-light dark:border-border-dark">
          {[
            { id: 'getting-started', label: 'Getting Started' },
            { id: 'patterns', label: 'Common Patterns' },
            { id: 'reference', label: 'Quick Reference' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-8 py-4 font-semibold transition-all duration-200 relative ${
                activeTab === tab.id
                  ? 'text-primary-600 dark:text-primary-400'
                  : 'text-text-secondary-light dark:text-text-secondary-dark hover:text-primary-600 dark:hover:text-primary-400'
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-500 to-secondary-500"></div>
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="min-h-[600px] py-8">
          {activeTab === 'getting-started' && (
            <div className="space-y-8">
              <section className="bg-surface-light dark:bg-surface-dark p-8 rounded-2xl border border-border-light dark:border-border-dark shadow-modern-lg">
                <h2 className="text-3xl font-bold text-text-primary-light dark:text-text-primary-dark mb-6">
                  What are Regular Expressions?
                </h2>
                <div className="space-y-4 text-text-secondary-light dark:text-text-secondary-dark leading-relaxed">
                  <p>
                    Regular expressions (regex) are powerful patterns used to match, search, and manipulate text. 
                    They provide a concise and flexible way to identify strings of interest, such as particular characters, 
                    words, or patterns of characters.
                  </p>
                  <p>
                    RegexLab helps you learn and practice regular expressions through interactive testing and guided training exercises.
                  </p>
                </div>
              </section>

              <section className="bg-surface-light dark:bg-surface-dark p-8 rounded-2xl border border-border-light dark:border-border-dark shadow-modern-lg">
                <h2 className="text-3xl font-bold text-text-primary-light dark:text-text-primary-dark mb-6">
                  How to Use RegexLab
                </h2>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-lg">1</span>
                    </div>
                    <h3 className="text-xl font-semibold text-text-primary-light dark:text-text-primary-dark">
                      Regex Playground
                    </h3>
                    <p className="text-text-secondary-light dark:text-text-secondary-dark">
                      Use the main playground to test your regex patterns against sample text. 
                      Get real-time explanations and see detailed match information.
                    </p>
                  </div>
                  <div className="space-y-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-secondary-500 to-secondary-600 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-lg">2</span>
                    </div>
                    <h3 className="text-xl font-semibold text-text-primary-light dark:text-text-primary-dark">
                      Training Mode
                    </h3>
                    <p className="text-text-secondary-light dark:text-text-secondary-dark">
                      Practice with guided exercises that challenge you to write regex patterns 
                      for specific scenarios. Progress through different difficulty levels.
                    </p>
                  </div>
                  <div className="space-y-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-accent-500 to-accent-600 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-lg">3</span>
                    </div>
                    <h3 className="text-xl font-semibold text-text-primary-light dark:text-text-primary-dark">
                      Documentation
                    </h3>
                    <p className="text-text-secondary-light dark:text-text-secondary-dark">
                      Reference this documentation for common patterns, syntax explanations, 
                      and learning resources.
                    </p>
                  </div>
                </div>
              </section>

              <section className="bg-surface-light dark:bg-surface-dark p-8 rounded-2xl border border-border-light dark:border-border-dark shadow-modern-lg">
                <h2 className="text-3xl font-bold text-text-primary-light dark:text-text-primary-dark mb-6">
                  Basic Regex Concepts
                </h2>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-text-primary-light dark:text-text-primary-dark">
                      Literal Characters
                    </h3>
                    <p className="text-text-secondary-light dark:text-text-secondary-dark">
                      Most characters match themselves literally:
                    </p>
                    <div className="p-4 bg-white dark:bg-neutral-900 border border-border-light dark:border-border-dark rounded-lg font-mono text-sm text-primary-600 dark:text-primary-400 shadow-modern">
                      cat matches "cat"
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-text-primary-light dark:text-text-primary-dark">
                      Special Characters
                    </h3>
                    <p className="text-text-secondary-light dark:text-text-secondary-dark">
                      Some characters have special meaning and need escaping:
                    </p>
                    <div className="p-4 bg-white dark:bg-neutral-900 border border-border-light dark:border-border-dark rounded-lg font-mono text-sm text-primary-600 dark:text-primary-400 shadow-modern">
                      \. matches literal dot<br/>
                      \* matches literal asterisk
                    </div>
                  </div>
                </div>
              </section>
            </div>
          )}

          {activeTab === 'patterns' && (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold text-text-primary-light dark:text-text-primary-dark">
                  Common Regex Patterns
                </h2>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search patterns..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="px-4 py-2 border border-border-light dark:border-border-dark rounded-lg bg-white dark:bg-neutral-900 text-text-primary-light dark:text-text-primary-dark focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-400 dark:focus:border-primary-400 transition-all duration-200 shadow-modern"
                  />
                </div>
              </div>

              {/* Quick Test Panel */}
              <div className="bg-gradient-to-r from-accent-50 to-primary-50 dark:from-accent-900/20 dark:to-primary-900/20 p-6 rounded-2xl border border-accent-200 dark:border-accent-800">
                <h3 className="text-xl font-semibold text-text-primary-light dark:text-text-primary-dark mb-4">
                  Quick Test Panel
                </h3>
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-text-primary-light dark:text-text-primary-dark">Pattern:</label>
                    <input
                      type="text"
                      value={testPattern}
                      onChange={(e) => setTestPattern(e.target.value)}
                      placeholder="Enter regex pattern..."
                      className="w-full px-3 py-2 border border-border-light dark:border-border-dark rounded-lg bg-white dark:bg-neutral-900 text-text-primary-light dark:text-text-primary-dark focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-400 dark:focus:border-primary-400 transition-all duration-200 font-mono text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-text-primary-light dark:text-text-primary-dark">Test Text:</label>
                    <input
                      type="text"
                      value={testText}
                      onChange={(e) => setTestText(e.target.value)}
                      placeholder="Enter text to test..."
                      className="w-full px-3 py-2 border border-border-light dark:border-border-dark rounded-lg bg-white dark:bg-neutral-900 text-text-primary-light dark:text-text-primary-dark focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-400 dark:focus:border-primary-400 transition-all duration-200"
                    />
                  </div>
                </div>
                <Button
                  onClick={testPatternInRealTime}
                  variant="primary"
                  size="sm"
                  className="mb-4"
                >
                  Test Pattern
                </Button>
                {testResult.length > 0 && (
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                    <div className="text-sm text-green-800 dark:text-green-200 mb-2">
                      Found {testResult.length} match{testResult.length !== 1 ? 'es' : ''}:
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {testResult.map((match, index) => (
                        <span key={index} className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded text-sm font-mono">
                          "{match}"
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="grid gap-8">
                {filteredPatterns.map((pattern) => (
                  <div key={pattern.name} className="bg-surface-light dark:bg-surface-dark p-8 rounded-2xl border border-border-light dark:border-border-dark shadow-modern-lg hover:shadow-modern-xl transition-all duration-300">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-2xl font-semibold text-text-primary-light dark:text-text-primary-dark">
                          {pattern.name}
                        </h3>
                        <span className="inline-block px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full text-sm font-medium mt-2">
                          {pattern.category}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => copyToClipboard(pattern.pattern, pattern.name)}
                          variant="outline"
                          size="sm"
                        >
                          {copiedPattern === pattern.name ? 'Copied!' : 'Copy'}
                        </Button>
                        <Button
                          onClick={() => usePatternInPlayground(pattern.pattern)}
                          variant="accent"
                          size="sm"
                        >
                          Test in Playground
                        </Button>
                      </div>
                    </div>
                    <p className="text-text-secondary-light dark:text-text-secondary-dark mb-6 leading-relaxed">
                      {pattern.description}
                    </p>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <span className="font-semibold text-text-primary-light dark:text-text-primary-dark">Pattern:</span>
                        <div className="p-4 bg-white dark:bg-neutral-900 border border-border-light dark:border-border-dark rounded-lg font-mono text-sm text-primary-600 dark:text-primary-400 shadow-modern">
                          {pattern.pattern}
                        </div>
                      </div>
                      <div className="space-y-3">
                        <span className="font-semibold text-text-primary-light dark:text-text-primary-dark">Example:</span>
                        <div className="p-4 bg-white dark:bg-neutral-900 border border-border-light dark:border-border-dark rounded-lg font-mono text-sm text-accent-600 dark:text-accent-400 shadow-modern">
                          {pattern.example}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'reference' && (
            <div className="space-y-8">
              <h2 className="text-3xl font-bold text-text-primary-light dark:text-text-primary-dark">
                Quick Reference
              </h2>
              <div className="grid gap-8">
                {regexComponents.map((category) => (
                  <div key={category.category} className="bg-surface-light dark:bg-surface-dark p-8 rounded-2xl border border-border-light dark:border-border-dark shadow-modern-lg">
                    <h3 className="text-2xl font-semibold text-text-primary-light dark:text-text-primary-dark mb-6">
                      {category.category}
                    </h3>
                    <div className="grid gap-4">
                      {category.items.map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-4 bg-white dark:bg-neutral-900 rounded-lg border border-border-light dark:border-border-dark shadow-modern hover:shadow-modern-md transition-all duration-200">
                          <div className="flex items-center space-x-6">
                            <div className="px-4 py-2 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-lg font-mono text-sm font-semibold min-w-[100px] text-center">
                              {item.symbol}
                            </div>
                            <span className="text-text-secondary-light dark:text-text-secondary-dark font-medium">
                              {item.description}
                            </span>
                          </div>
                          <Button
                            onClick={() => copyToClipboard(item.symbol, item.symbol)}
                            variant="ghost"
                            size="sm"
                          >
                            {copiedPattern === item.symbol ? 'Copied!' : 'Copy'}
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <section className="text-center py-12">
        <div className="bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 p-8 rounded-2xl border border-primary-200 dark:border-primary-800">
          <p className="text-text-secondary-light dark:text-text-secondary-dark text-lg mb-4">
            Ready to practice? Head to the Training page to test your regex skills!
          </p>
          <div className="flex justify-center gap-4">
            <a 
              href="/train" 
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white font-semibold rounded-lg transition-all duration-200 shadow-modern hover:shadow-modern-md transform hover:scale-105"
            >
              Start Training
              <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
            <a 
              href="/" 
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-accent-500 to-accent-600 hover:from-accent-600 hover:to-accent-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-modern hover:shadow-modern-md transform hover:scale-105"
            >
              Try Playground
              <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </a>
          </div>
        </div>
      </section>
    </div>
  )
} 