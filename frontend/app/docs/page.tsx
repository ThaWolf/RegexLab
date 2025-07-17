'use client'

import { useState } from 'react'

interface RegexPattern {
  name: string
  pattern: string
  description: string
  example: string
}

const commonPatterns: RegexPattern[] = [
  {
    name: 'Email',
    pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
    description: 'Matches a valid email address',
    example: 'user@example.com'
  },
  {
    name: 'Phone Number',
    pattern: '^\\+?[1-9]\\d{1,14}$',
    description: 'Matches international phone numbers',
    example: '+1234567890'
  },
  {
    name: 'URL',
    pattern: '^https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)$',
    description: 'Matches valid URLs',
    example: 'https://example.com'
  },
  {
    name: 'Date (YYYY-MM-DD)',
    pattern: '^\\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\\d|3[01])$',
    description: 'Matches dates in YYYY-MM-DD format',
    example: '2024-01-15'
  },
  {
    name: 'Credit Card',
    pattern: '^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|6(?:011|5[0-9]{2})[0-9]{12}|(?:2131|1800|35\\d{3})\\d{11})$',
    description: 'Matches common credit card formats',
    example: '4111111111111111'
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
  }
]

export default function DocsPage() {
  const [activeTab, setActiveTab] = useState<'getting-started' | 'patterns' | 'reference'>('getting-started')

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-garden-dark dark:text-earth-light">
          RegexLab Documentation
        </h1>
        <p className="text-lg text-garden-dark dark:text-earth-light max-w-3xl mx-auto">
          Master regular expressions with our comprehensive guide. Learn the fundamentals, explore common patterns, and practice with interactive examples.
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-garden dark:border-earth-light">
        {[
          { id: 'getting-started', label: 'Getting Started' },
          { id: 'patterns', label: 'Common Patterns' },
          { id: 'reference', label: 'Quick Reference' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === tab.id
                ? 'border-b-2 border-sky text-sky-dark dark:text-sky-light'
                : 'text-garden-dark dark:text-earth-light hover:text-sky-dark dark:hover:text-sky-light'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="min-h-[600px]">
        {activeTab === 'getting-started' && (
          <div className="space-y-8">
            <section className="bg-garden-light dark:bg-garden-dark p-6 rounded-2xl">
              <h2 className="text-2xl font-bold text-garden-dark dark:text-earth-light mb-4">
                What are Regular Expressions?
              </h2>
              <p className="text-garden-dark dark:text-earth-light mb-4">
                Regular expressions (regex) are powerful patterns used to match, search, and manipulate text. 
                They provide a concise and flexible way to identify strings of interest, such as particular characters, 
                words, or patterns of characters.
              </p>
              <p className="text-garden-dark dark:text-earth-light">
                RegexLab helps you learn and practice regular expressions through interactive testing and guided training exercises.
              </p>
            </section>

            <section className="bg-garden-light dark:bg-garden-dark p-6 rounded-2xl">
              <h2 className="text-2xl font-bold text-garden-dark dark:text-earth-light mb-4">
                How to Use RegexLab
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-garden-dark dark:text-earth-light mb-2">
                    1. Regex Playground
                  </h3>
                  <p className="text-garden-dark dark:text-earth-light">
                    Use the main playground to test your regex patterns against sample text. 
                    Get real-time explanations and see detailed match information.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-garden-dark dark:text-earth-light mb-2">
                    2. Training Mode
                  </h3>
                  <p className="text-garden-dark dark:text-earth-light">
                    Practice with guided exercises that challenge you to write regex patterns 
                    for specific scenarios. Progress through different difficulty levels.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-garden-dark dark:text-earth-light mb-2">
                    3. Documentation
                  </h3>
                  <p className="text-garden-dark dark:text-earth-light">
                    Reference this documentation for common patterns, syntax explanations, 
                    and learning resources.
                  </p>
                </div>
              </div>
            </section>

            <section className="bg-garden-light dark:bg-garden-dark p-6 rounded-2xl">
              <h2 className="text-2xl font-bold text-garden-dark dark:text-earth-light mb-4">
                Basic Regex Concepts
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-garden-dark dark:text-earth-light mb-2">
                    Literal Characters
                  </h3>
                  <p className="text-garden-dark dark:text-earth-light mb-2">
                    Most characters match themselves literally:
                  </p>
                  <div className="bg-earth-light dark:bg-garden-dark p-3 rounded font-mono text-sm">
                    cat matches "cat"
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-garden-dark dark:text-earth-light mb-2">
                    Special Characters
                  </h3>
                  <p className="text-garden-dark dark:text-earth-light mb-2">
                    Some characters have special meaning and need escaping:
                  </p>
                  <div className="bg-earth-light dark:bg-garden-dark p-3 rounded font-mono text-sm">
                    \. matches literal dot<br/>
                    \* matches literal asterisk
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {activeTab === 'patterns' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-garden-dark dark:text-earth-light">
              Common Regex Patterns
            </h2>
            <div className="grid gap-6">
              {commonPatterns.map((pattern) => (
                <div key={pattern.name} className="bg-garden-light dark:bg-garden-dark p-6 rounded-2xl">
                  <h3 className="text-xl font-semibold text-garden-dark dark:text-earth-light mb-2">
                    {pattern.name}
                  </h3>
                  <p className="text-garden-dark dark:text-earth-light mb-3">
                    {pattern.description}
                  </p>
                  <div className="space-y-2">
                    <div>
                      <span className="font-medium text-garden-dark dark:text-earth-light">Pattern:</span>
                      <div className="bg-earth-light dark:bg-garden-dark p-2 rounded font-mono text-sm mt-1">
                        {pattern.pattern}
                      </div>
                    </div>
                    <div>
                      <span className="font-medium text-garden-dark dark:text-earth-light">Example:</span>
                      <div className="bg-earth-light dark:bg-garden-dark p-2 rounded font-mono text-sm mt-1">
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
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-garden-dark dark:text-earth-light">
              Quick Reference
            </h2>
            <div className="grid gap-6">
              {regexComponents.map((category) => (
                <div key={category.category} className="bg-garden-light dark:bg-garden-dark p-6 rounded-2xl">
                  <h3 className="text-xl font-semibold text-garden-dark dark:text-earth-light mb-4">
                    {category.category}
                  </h3>
                  <div className="grid gap-3">
                    {category.items.map((item, index) => (
                      <div key={index} className="flex items-center space-x-4">
                        <div className="bg-earth-light dark:bg-garden-dark px-3 py-1 rounded font-mono text-sm min-w-[80px] text-center">
                          {item.symbol}
                        </div>
                        <span className="text-garden-dark dark:text-earth-light">
                          {item.description}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="text-center text-garden-dark dark:text-earth-light mt-12">
        <p className="text-sm">
          Ready to practice? Head to the{' '}
          <a href="/train" className="text-sky hover:underline">
            Training page
          </a>{' '}
          to test your regex skills!
        </p>
      </div>
    </div>
  )
} 