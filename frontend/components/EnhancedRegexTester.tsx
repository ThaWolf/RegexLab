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

interface RegexGenerationRequest {
  description: string
  examples?: string[]
  flags?: string
}

interface RegexFlavor {
  id: string
  name: string
  description: string
  features: string[]
  limitations: string[]
}

const regexFlavors: RegexFlavor[] = [
  {
    id: 'javascript',
    name: 'JavaScript (ECMAScript)',
    description: 'Standard JavaScript regex engine with modern features',
    features: ['Lookahead/lookbehind', 'Unicode support', 'Named groups', 'Sticky flag (y)'],
    limitations: ['No lookbehind in older browsers', 'Limited recursion support']
  },
  {
    id: 'pcre',
    name: 'PCRE (Perl Compatible)',
    description: 'Perl Compatible Regular Expressions - most feature-rich',
    features: ['Full lookahead/lookbehind', 'Recursion', 'Conditional patterns', 'Atomic groups', 'Possessive quantifiers'],
    limitations: ['Complex syntax', 'Performance overhead']
  },
  {
    id: 'posix',
    name: 'POSIX (Basic & Extended)',
    description: 'Standard POSIX regex with basic and extended flavors',
    features: ['Standard compliance', 'Portable across systems', 'Simple syntax'],
    limitations: ['Limited features', 'No lookahead/lookbehind', 'No named groups']
  },
  {
    id: 'python',
    name: 'Python (re module)',
    description: 'Python regex engine with comprehensive features',
    features: ['Lookahead/lookbehind', 'Unicode support', 'Verbose mode', 'Inline flags'],
    limitations: ['No atomic groups', 'Limited recursion']
  },
  {
    id: 'java',
    name: 'Java (java.util.regex)',
    description: 'Java regex engine with good feature support',
    features: ['Lookahead/lookbehind', 'Unicode support', 'Possessive quantifiers', 'Atomic groups'],
    limitations: ['No recursion', 'Limited conditional patterns']
  }
]

export default function EnhancedRegexTester() {
  const [pattern, setPattern] = useState('')
  const [text, setText] = useState('')
  const [flags, setFlags] = useState('g')
  const [explanation, setExplanation] = useState<RegexExplanation | null>(null)
  const [testResult, setTestResult] = useState<RegexTestResult | null>(null)
  const [commonPatterns, setCommonPatterns] = useState<CommonPattern[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [syntaxError, setSyntaxError] = useState<string | null>(null)
  const [generationDescription, setGenerationDescription] = useState('')
  const [generationExamples, setGenerationExamples] = useState('')
  const [showGeneration, setShowGeneration] = useState(false)
  const [explaining, setExplaining] = useState(false)
  const [selectedFlavor, setSelectedFlavor] = useState<string>('javascript')
  const [showFlavorInfo, setShowFlavorInfo] = useState(false)

  const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

  useEffect(() => {
    fetchCommonPatterns()
  }, [])

  // Check for pattern from docs page
  useEffect(() => {
    const savedPattern = localStorage.getItem('regexlab-pattern')
    if (savedPattern) {
      setPattern(savedPattern)
      localStorage.removeItem('regexlab-pattern')
    }
  }, [])

  // Real-time syntax validation
  useEffect(() => {
    if (pattern.trim()) {
      validateFlavorSyntax(pattern, flags, selectedFlavor)
    } else {
      setSyntaxError(null)
    }
  }, [pattern, flags, selectedFlavor])

  // Real-time explanation with debouncing
  useEffect(() => {
    if (!pattern.trim() || syntaxError) {
      setExplanation(null)
      setExplaining(false)
      return
    }

    setExplaining(true)
    const timeoutId = setTimeout(() => {
      explainRegex()
    }, 1000) // 1 second debounce

    return () => clearTimeout(timeoutId)
  }, [pattern, flags])

  // Real-time validation as user types
  useEffect(() => {
    if (!text.trim() || !pattern.trim()) {
      setTestResult(null)
      return
    }

    try {
      const result = testRegexWithFlavor(pattern, text, 'g', selectedFlavor)
      setTestResult(result)
    } catch (error) {
      setTestResult(null)
    }
  }, [text, pattern, selectedFlavor])

  const validateSyntax = (pattern: string, flags: string) => {
    try {
      new RegExp(pattern, flags)
      setSyntaxError(null)
    } catch (error) {
      setSyntaxError(error instanceof Error ? error.message : 'Invalid regex syntax')
    }
  }

  const validateFlavorSyntax = (pattern: string, flags: string, flavor: string) => {
    try {
      switch (flavor) {
        case 'javascript':
          new RegExp(pattern, flags)
          break
        case 'pcre':
          // PCRE-like validation (simplified)
          if (pattern.includes('(?R)') && !pattern.includes('(?<')) {
            throw new Error('PCRE recursion requires named groups')
          }
          new RegExp(pattern, flags)
          break
        case 'posix':
          // POSIX validation (simplified)
          if (pattern.includes('(?=') || pattern.includes('(?<')) {
            throw new Error('POSIX regex does not support lookahead/lookbehind')
          }
          new RegExp(pattern, flags)
          break
        case 'python':
          // Python-like validation
          if (pattern.includes('(?P<') && !pattern.includes('(?P=')) {
            throw new Error('Python named groups require proper backreferences')
          }
          new RegExp(pattern, flags)
          break
        case 'java':
          // Java-like validation
          new RegExp(pattern, flags)
          break
        default:
          new RegExp(pattern, flags)
      }
      setSyntaxError(null)
    } catch (error) {
      setSyntaxError(error instanceof Error ? error.message : 'Invalid regex syntax')
    }
  }

  const testRegexWithFlavor = (pattern: string, text: string, flags: string, flavor: string) => {
    try {
      let regex: RegExp
      
      switch (flavor) {
        case 'javascript':
          regex = new RegExp(pattern, flags)
          break
        case 'pcre':
          // PCRE-like testing (simplified)
          regex = new RegExp(pattern, flags)
          break
        case 'posix':
          // POSIX-like testing (simplified)
          regex = new RegExp(pattern, flags)
          break
        case 'python':
          // Python-like testing (simplified)
          regex = new RegExp(pattern, flags)
          break
        case 'java':
          // Java-like testing (simplified)
          regex = new RegExp(pattern, flags)
          break
        default:
          regex = new RegExp(pattern, flags)
      }

      const matches = text.match(regex)
      
      if (!matches) {
        return {
          hasMatches: false,
          matches: [],
          groups: [],
          positions: []
        }
      }

      const allMatches: string[] = []
      const allGroups: string[][] = []
      const allPositions: { start: number; end: number }[] = []
      
      let match
      const globalRegex = new RegExp(pattern, flags + (flags.includes('g') ? '' : 'g'))
      
      while ((match = globalRegex.exec(text)) !== null) {
        allMatches.push(match[0])
        allGroups.push(match.slice(1))
        allPositions.push({
          start: match.index,
          end: match.index + match[0].length
        })
      }

      return {
        hasMatches: true,
        matches: allMatches,
        groups: allGroups,
        positions: allPositions
      }
    } catch (error) {
      throw new Error(`Invalid regex: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  const fetchCommonPatterns = async () => {
    try {
      const response = await fetch(`${apiBase}/regex/patterns`)
      if (!response.ok) {
        console.warn('Failed to fetch common patterns, using empty array')
        setCommonPatterns([])
        return
      }
      const data = await response.json()
      setCommonPatterns(data.patterns || [])
    } catch (error) {
      console.error('Failed to fetch common patterns:', error)
      setCommonPatterns([])
    }
  }

  const explainRegex = async () => {
    if (!pattern.trim() || syntaxError) return

    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`${apiBase}/regex/explain`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pattern, flags })
      })

      if (response.ok) {
        const data = await response.json()
        setExplanation(data)
        setLoading(false)
        setExplaining(false)
        return
      }
    } catch (error) {
      // Continue to fallback
    }

    // Fallback to basic explanation
    try {
      const regex = new RegExp(pattern, flags)
      setExplanation({
        pattern,
        description: 'Basic regex pattern explanation (demo mode)',
        components: [
          {
            type: 'pattern',
            value: pattern,
            description: 'The regex pattern you entered',
            position: { start: 0, end: pattern.length }
          }
        ],
        examples: [],
        warnings: ['Using demo mode - backend not available']
      })
    } catch (regexError) {
      setError('Invalid regex pattern')
    } finally {
      setLoading(false)
      setExplaining(false)
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

      if (response.ok) {
        const data = await response.json()
        setTestResult(data)
        return
      }
    } catch (error) {
      // Continue to fallback
    }

    // Fallback to client-side regex testing
    try {
      const regex = new RegExp(pattern, flags)
      const matches = text.match(regex)
      
      setTestResult({
        hasMatches: matches !== null && matches.length > 0,
        matches: matches || [],
        groups: [],
        positions: matches ? matches.map(match => {
          const index = text.indexOf(match)
          return { start: index, end: index + match.length }
        }) : []
      })
    } catch (regexError) {
      setError('Invalid regex pattern')
    } finally {
      setLoading(false)
    }
  }

  const generateRegex = async () => {
    if (!generationDescription.trim()) return

    setLoading(true)
    setError(null)

    try {
      const request: RegexGenerationRequest = {
        description: generationDescription,
        flags: flags
      }

      if (generationExamples.trim()) {
        request.examples = generationExamples.split('\n').filter(ex => ex.trim())
      }

      const response = await fetch(`${apiBase}/regex/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request)
      })

      if (!response.ok) {
        throw new Error('Failed to generate regex')
      }

      const data = await response.json()
      setPattern(data.pattern)
      setGenerationDescription('')
      setGenerationExamples('')
      setShowGeneration(false)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to generate regex')
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
      highlightedText = `${before}<mark class="bg-yellow-200 dark:bg-yellow-800 px-1 rounded text-black dark:text-yellow-100">${match}</mark>${after}`
    })

    return highlightedText
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const generateCodeSnippet = (language: string) => {
    if (!pattern) return ''
    
    switch (language) {
      case 'javascript':
        return `// JavaScript Regex Example
const regex = /${pattern.replace(/\//g, '\\/')}/${flags};
const text = "Your test text here";

// Method 1: Using match()
const matches = text.match(regex);
console.log('Matches:', matches);

// Method 2: Using test()
const isValid = regex.test(text);
console.log('Is valid:', isValid);

// Method 3: Using exec() for detailed info
let match;
while ((match = regex.exec(text)) !== null) {
  console.log('Match:', match[0], 'at position:', match.index);
}`
      
      case 'python':
        return `# Python Regex Example
import re

pattern = r"${pattern}"
text = "Your test text here"

# Method 1: Using findall()
matches = re.findall(pattern, text, re.${flags.toUpperCase()})
print(f"Matches: {matches}")

# Method 2: Using search()
match = re.search(pattern, text, re.${flags.toUpperCase()})
if match:
    print(f"First match: {match.group()}")
    print(f"Position: {match.start()}-{match.end()}")

# Method 3: Using finditer() for all matches
for match in re.finditer(pattern, text, re.${flags.toUpperCase()}):
    print(f"Match: {match.group()} at {match.start()}-{match.end()}")`
      
      case 'java':
        return `// Java Regex Example
import java.util.regex.*;

public class RegexExample {
    public static void main(String[] args) {
        String pattern = "${pattern.replace(/"/g, '\\"')}";
        String text = "Your test text here";
        
        // Method 1: Using Pattern and Matcher
        Pattern regex = Pattern.compile(pattern, Pattern.${flags.toUpperCase()});
        Matcher matcher = regex.matcher(text);
        
        while (matcher.find()) {
            System.out.println("Match: " + matcher.group());
            System.out.println("Position: " + matcher.start() + "-" + matcher.end());
        }
        
        // Method 2: Using matches() for full string
        boolean matches = text.matches(pattern);
        System.out.println("Full string matches: " + matches);
    }
}`
      
      case 'csharp':
        return `// C# Regex Example
using System;
using System.Text.RegularExpressions;

class Program
{
    static void Main()
    {
        string pattern = @"${pattern}";
        string text = "Your test text here";
        
        // Method 1: Using Regex.Matches()
        MatchCollection matches = Regex.Matches(text, pattern, RegexOptions.${flags.toUpperCase()});
        foreach (Match match in matches)
        {
            Console.WriteLine($"Match: {match.Value}");
            Console.WriteLine($"Position: {match.Index}-{match.Index + match.Length}");
        }
        
        // Method 2: Using Regex.IsMatch()
        bool isValid = Regex.IsMatch(text, pattern, RegexOptions.${flags.toUpperCase()});
        Console.WriteLine($"Is valid: {isValid}");
    }
}`
      
      case 'php':
        return `<?php
// PHP Regex Example
$pattern = '/${pattern.replace(/\//g, '\\/')}/${flags}';
$text = "Your test text here";

// Method 1: Using preg_match_all()
if (preg_match_all($pattern, $text, $matches)) {
    echo "Matches: " . implode(', ', $matches[0]) . "\\n";
}

// Method 2: Using preg_match()
if (preg_match($pattern, $text, $matches)) {
    echo "First match: " . $matches[0] . "\\n";
}

// Method 3: Using preg_replace()
$replaced = preg_replace($pattern, 'REPLACEMENT', $text);
echo "Replaced: " . $replaced . "\\n";
?>`
      
      case 'ruby':
        return `# Ruby Regex Example
pattern = /${pattern}/${flags}
text = "Your test text here"

# Method 1: Using scan()
matches = text.scan(pattern)
puts "Matches: #{matches}"

# Method 2: Using match()
match = text.match(pattern)
if match
  puts "First match: #{match[0]}"
  puts "Position: #{match.begin(0)}-#{match.end(0)}"
end

# Method 3: Using gsub() for replacement
replaced = text.gsub(pattern, 'REPLACEMENT')
puts "Replaced: #{replaced}"`
      
      case 'go':
        return `package main

import (
    "fmt"
    "regexp"
)

func main() {
    pattern := \`${pattern}\`
    text := "Your test text here"
    
    // Method 1: Using FindAllString()
    regex := regexp.MustCompile(pattern)
    matches := regex.FindAllString(text, -1)
    fmt.Printf("Matches: %v\\n", matches)
    
    // Method 2: Using FindStringIndex()
    indices := regex.FindStringIndex(text)
    if indices != nil {
        fmt.Printf("First match at: %d-%d\\n", indices[0], indices[1])
    }
    
    // Method 3: Using MatchString()
    isValid := regex.MatchString(text)
    fmt.Printf("Is valid: %t\\n", isValid)
}`
      
      case 'rust':
        return `use regex::Regex;

fn main() {
    let pattern = r"${pattern}";
    let text = "Your test text here";
    
    // Method 1: Using find_iter()
    let regex = Regex::new(pattern).unwrap();
    for mat in regex.find_iter(text) {
        println!("Match: {} at {}-{}", 
                 mat.as_str(), mat.start(), mat.end());
    }
    
    // Method 2: Using is_match()
    let is_valid = regex.is_match(text);
    println!("Is valid: {}", is_valid);
    
    // Method 3: Using captures_iter() for groups
    for caps in regex.captures_iter(text) {
        println!("Full match: {}", &caps[0]);
        for (i, cap) in caps.iter().enumerate().skip(1) {
            if let Some(cap) = cap {
                println!("Group {}: {}", i, cap.as_str());
            }
        }
    }
}`
      
      default:
        return pattern
    }
  }

  const generateCodeSnippetWithText = (language: string, testText: string) => {
    if (!pattern) return ''
    
    const escapedText = testText.replace(/"/g, '\\"').replace(/'/g, "\\'")
    
    switch (language) {
      case 'javascript':
        return `// JavaScript Regex Example
const regex = /${pattern.replace(/\//g, '\\/')}/${flags};
const text = "${escapedText}";

// Method 1: Using match()
const matches = text.match(regex);
console.log('Matches:', matches);

// Method 2: Using test()
const isValid = regex.test(text);
console.log('Is valid:', isValid);

// Method 3: Using exec() for detailed info
let match;
while ((match = regex.exec(text)) !== null) {
  console.log('Match:', match[0], 'at position:', match.index);
}`
      
      case 'python':
        return `# Python Regex Example
import re

pattern = r"${pattern}"
text = "${escapedText}"

# Method 1: Using findall()
matches = re.findall(pattern, text, re.${flags.toUpperCase()})
print(f"Matches: {matches}")

# Method 2: Using search()
match = re.search(pattern, text, re.${flags.toUpperCase()})
if match:
    print(f"First match: {match.group()}")
    print(f"Position: {match.start()}-{match.end()}")

# Method 3: Using finditer() for all matches
for match in re.finditer(pattern, text, re.${flags.toUpperCase()}):
    print(f"Match: {match.group()} at {match.start()}-{match.end()}")`
      
      default:
        return generateCodeSnippet(language)
    }
  }

  return (
    <div className="space-y-8 p-8 bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-2xl shadow-modern-lg transition-all duration-300 hover:shadow-modern-xl">
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
            Regex Playground
          </h2>
          <p className="text-text-secondary-light dark:text-text-secondary-dark">
            Test and understand regular expressions in real-time
          </p>
        </div>
        
        {/* Common Patterns */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark">Common Patterns</h3>
          <div className="flex flex-wrap gap-2">
            {Array.isArray(commonPatterns) && commonPatterns.length > 0 ? (
              commonPatterns.map((patternData) => (
                <button
                  key={patternData.name}
                  onClick={() => selectPattern(patternData)}
                  className="px-4 py-2 text-sm bg-gradient-to-r from-primary-100 to-secondary-100 dark:from-primary-900 dark:to-secondary-900 text-primary-700 dark:text-primary-300 rounded-lg hover:from-primary-200 hover:to-secondary-200 dark:hover:from-primary-800 dark:hover:to-secondary-800 transition-all duration-200 shadow-modern hover:shadow-modern-md transform hover:scale-105 border border-primary-200 dark:border-primary-800"
                  title={patternData.description}
                >
                  {patternData.name}
                </button>
              ))
            ) : (
              <p className="text-sm text-text-muted-light dark:text-text-muted-dark">No common patterns available</p>
            )}
          </div>
        </div>

        {/* Regex Generation */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark">Regex Generation</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowGeneration(!showGeneration)}
            >
              {showGeneration ? 'Hide' : 'Generate Regex'}
            </Button>
          </div>
          
          {showGeneration && (
            <div className="space-y-4 p-4 bg-white dark:bg-neutral-900 rounded-lg border border-border-light dark:border-border-dark shadow-modern">
              <div className="space-y-2">
                <label className="text-sm font-medium text-text-primary-light dark:text-text-primary-dark">Description</label>
                <textarea
                  value={generationDescription}
                  onChange={(e) => setGenerationDescription(e.target.value)}
                  placeholder="Describe what you want to match (e.g., 'email addresses', 'phone numbers')"
                  className="w-full p-3 border border-border-light dark:border-border-dark rounded-lg resize-none h-20 bg-white dark:bg-neutral-900 text-text-primary-light dark:text-text-primary-dark focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-400 dark:focus:border-primary-400 transition-all duration-200"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-text-primary-light dark:text-text-primary-dark">Examples (optional)</label>
                <textarea
                  value={generationExamples}
                  onChange={(e) => setGenerationExamples(e.target.value)}
                  placeholder="Enter example strings, one per line"
                  className="w-full p-3 border border-border-light dark:border-border-dark rounded-lg resize-none h-20 bg-white dark:bg-neutral-900 text-text-primary-light dark:text-text-primary-dark focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-400 dark:focus:border-primary-400 transition-all duration-200"
                />
              </div>
              
              <Button
                onClick={generateRegex}
                disabled={loading || !generationDescription.trim()}
                variant="accent"
                size="sm"
              >
                {loading ? 'Generating...' : 'Generate Pattern'}
              </Button>
            </div>
          )}
        </div>

        {/* Regex Input */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark">Regex Pattern</label>
            <div className="flex items-center gap-2">
              <select
                value={selectedFlavor}
                onChange={(e) => setSelectedFlavor(e.target.value)}
                className="px-3 py-1 text-sm border border-border-light dark:border-border-dark rounded-lg bg-white dark:bg-neutral-900 text-text-primary-light dark:text-text-primary-dark focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-400 dark:focus:border-primary-400 transition-all duration-200"
              >
                {regexFlavors.map((flavor) => (
                  <option key={flavor.id} value={flavor.id}>
                    {flavor.name}
                  </option>
                ))}
              </select>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowFlavorInfo(!showFlavorInfo)}
              >
                ℹ️
              </Button>
            </div>
          </div>
          
          <div className="flex gap-3">
            <Input
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
              placeholder="Enter regex pattern..."
              className={`font-mono bg-white dark:bg-neutral-900 border transition-all duration-200 shadow-modern ${
                syntaxError 
                  ? 'border-red-500 focus:ring-red-500 focus:border-red-500 dark:focus:ring-red-400 dark:focus:border-red-400' 
                  : 'border-border-light dark:border-border-dark focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-400 dark:focus:border-primary-400'
              }`}
            />
            <Input
              value={flags}
              onChange={(e) => setFlags(e.target.value)}
              placeholder="Flags (g, i, m, s, u, y)"
              className="w-32 bg-white dark:bg-neutral-900 border border-border-light dark:border-border-dark focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-400 dark:focus:border-primary-400 transition-all duration-200 shadow-modern"
            />
          </div>
          
          {/* Flavor Information */}
          {showFlavorInfo && (
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <h4 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-3">
                {regexFlavors.find(f => f.id === selectedFlavor)?.name}
              </h4>
              <p className="text-blue-700 dark:text-blue-300 mb-3">
                {regexFlavors.find(f => f.id === selectedFlavor)?.description}
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h5 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Features:</h5>
                  <ul className="space-y-1">
                    {regexFlavors.find(f => f.id === selectedFlavor)?.features.map((feature, index) => (
                      <li key={index} className="text-sm text-blue-700 dark:text-blue-300 flex items-center">
                        <span className="mr-2">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h5 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Limitations:</h5>
                  <ul className="space-y-1">
                    {regexFlavors.find(f => f.id === selectedFlavor)?.limitations.map((limitation, index) => (
                      <li key={index} className="text-sm text-blue-700 dark:text-blue-300 flex items-center">
                        <span className="mr-2">⚠️</span>
                        {limitation}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
          
          {/* Syntax Error Display */}
          {syntaxError && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-800 dark:text-red-200 text-sm font-medium">Syntax Error: {syntaxError}</p>
            </div>
          )}
        </div>

        {/* Test Text */}
        <div className="space-y-3">
          <label className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark">Test Text</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter text to test against..."
            className="w-full p-4 border border-border-light dark:border-border-dark rounded-lg resize-none h-32 bg-white dark:bg-neutral-900 text-text-primary-light dark:text-text-primary-dark focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-400 dark:focus:border-primary-400 transition-all duration-200 shadow-modern font-mono"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 pt-2">
          <Button 
            onClick={explainRegex} 
            disabled={loading || !pattern.trim() || !!syntaxError || explaining} 
            variant="primary"
            size="lg"
          >
            {loading || explaining ? 'Explaining...' : 'Explain Pattern'}
          </Button>
          <Button 
            onClick={testRegex} 
            disabled={loading || !pattern.trim() || !text.trim() || !!syntaxError} 
            variant="secondary"
            size="lg"
          >
            {loading ? 'Testing...' : 'Test Regex'}
          </Button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg shadow-modern">
            <p className="text-red-800 dark:text-red-200 text-sm font-medium">{error}</p>
          </div>
        )}

        {/* Explanation */}
        {explanation && (
          <div className="space-y-4 p-6 bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 rounded-xl border border-primary-200 dark:border-primary-800 shadow-modern">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-text-primary-light dark:text-text-primary-dark">Pattern Explanation</h3>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-text-secondary-light dark:text-text-secondary-dark">Auto-generated</span>
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              </div>
            </div>
            <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed">{explanation.description}</p>
            
            {explanation.components.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-lg font-medium text-text-primary-light dark:text-text-primary-dark">Components:</h4>
                <div className="grid gap-2">
                  {explanation.components.map((component, index) => (
                    <div key={index} className="p-3 bg-white dark:bg-neutral-900 rounded-lg border border-border-light dark:border-border-dark shadow-modern">
                      <span className="font-mono text-primary-600 dark:text-primary-400 font-semibold">{component.value}</span>
                      <span className="text-text-secondary-light dark:text-text-secondary-dark ml-3">- {component.description}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {explanation.examples.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-lg font-medium text-text-primary-light dark:text-text-primary-dark">Examples:</h4>
                <div className="grid gap-2">
                  {explanation.examples.map((example, index) => (
                    <div key={index} className="p-3 bg-white dark:bg-neutral-900 rounded-lg border border-border-light dark:border-border-dark shadow-modern">
                      <span className="font-mono text-accent-600 dark:text-accent-400">{example}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {explanation.warnings.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-lg font-medium text-orange-700 dark:text-orange-300">Warnings:</h4>
                <ul className="space-y-1">
                  {explanation.warnings.map((warning, index) => (
                    <li key={index} className="text-sm text-orange-600 dark:text-orange-400 flex items-start">
                      <span className="mr-2 mt-1">•</span>
                      <span>{warning}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Code Generation */}
            <div className="space-y-3">
              <h4 className="text-lg font-medium text-text-primary-light dark:text-text-primary-dark">Code Snippets:</h4>
              <div className="grid gap-4">
                {[
                  { lang: 'javascript', name: 'JavaScript', icon: '⚡' },
                  { lang: 'python', name: 'Python', icon: '🐍' },
                  { lang: 'java', name: 'Java', icon: '☕' },
                  { lang: 'csharp', name: 'C#', icon: '🔷' },
                  { lang: 'php', name: 'PHP', icon: '🐘' },
                  { lang: 'ruby', name: 'Ruby', icon: '💎' },
                  { lang: 'go', name: 'Go', icon: '🐹' },
                  { lang: 'rust', name: 'Rust', icon: '🦀' }
                ].map(({ lang, name, icon }) => (
                  <div key={lang} className="p-4 bg-white dark:bg-neutral-900 rounded-lg border border-border-light dark:border-border-dark shadow-modern">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{icon}</span>
                        <span className="text-sm font-medium text-text-primary-light dark:text-text-primary-dark">{name}</span>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(generateCodeSnippet(lang))}
                        >
                          Copy
                        </Button>
                        {text && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copyToClipboard(generateCodeSnippetWithText(lang, text))}
                          >
                            Copy with Text
                          </Button>
                        )}
                      </div>
                    </div>
                    <pre className="text-xs font-mono text-primary-600 dark:text-primary-400 overflow-x-auto bg-gray-50 dark:bg-gray-900 p-3 rounded border">
                      {generateCodeSnippet(lang)}
                    </pre>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Real-time Explanation Loading */}
        {explaining && !explanation && (
          <div className="space-y-4 p-6 bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 rounded-xl border border-primary-200 dark:border-primary-800 shadow-modern">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-text-primary-light dark:text-text-primary-dark">Pattern Explanation</h3>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-text-secondary-light dark:text-text-secondary-dark">Generating...</span>
                <div className="w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="h-4 bg-white dark:bg-neutral-900 rounded animate-pulse"></div>
              <div className="h-4 bg-white dark:bg-neutral-900 rounded animate-pulse w-3/4"></div>
              <div className="h-4 bg-white dark:bg-neutral-900 rounded animate-pulse w-1/2"></div>
            </div>
          </div>
        )}

        {/* Test Results */}
        {testResult && (
          <div className="space-y-4 p-6 bg-gradient-to-br from-accent-50 to-primary-50 dark:from-accent-900/20 dark:to-primary-900/20 rounded-xl border border-accent-200 dark:border-accent-800 shadow-modern">
            <h3 className="text-xl font-semibold text-text-primary-light dark:text-text-primary-dark">Test Results</h3>
            
            <div className="space-y-6">
              {/* Match Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-white dark:bg-neutral-900 rounded-lg border border-border-light dark:border-border-dark shadow-modern">
                  <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                    {testResult.hasMatches ? testResult.matches.length : 0}
                  </div>
                  <div className="text-sm text-text-secondary-light dark:text-text-secondary-dark">Total Matches</div>
                </div>
                
                <div className="p-4 bg-white dark:bg-neutral-900 rounded-lg border border-border-light dark:border-border-dark shadow-modern">
                  <div className="text-2xl font-bold text-accent-600 dark:text-accent-400">
                    {testResult.hasMatches && testResult.groups.length > 0 
                      ? testResult.groups.reduce((total, group) => total + group.length, 0) 
                      : 0}
                  </div>
                  <div className="text-sm text-text-secondary-light dark:text-text-secondary-dark">Capture Groups</div>
                </div>
                
                <div className="p-4 bg-white dark:bg-neutral-900 rounded-lg border border-border-light dark:border-border-dark shadow-modern">
                  <div className="text-2xl font-bold text-secondary-600 dark:text-secondary-400">
                    {testResult.hasMatches && testResult.matches.length > 0
                      ? Math.round((testResult.matches.reduce((total, match) => total + match.length, 0) / text.length) * 100)
                      : 0}%
                  </div>
                  <div className="text-sm text-text-secondary-light dark:text-text-secondary-dark">Text Coverage</div>
                </div>
              </div>

              {/* Status Indicator */}
              <div className="flex items-center space-x-2">
                <span className="font-medium text-text-primary-light dark:text-text-primary-dark">Status:</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  testResult.hasMatches 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' 
                    : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                }`}>
                  {testResult.hasMatches ? '✓ Matches found' : '✗ No matches'}
                </span>
              </div>
              
              {testResult.hasMatches && (
                <>
                  {/* Highlighted Text */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-text-primary-light dark:text-text-primary-dark">Highlighted Text:</span>
                      <span className="text-xs text-text-secondary-light dark:text-text-secondary-dark">
                        {testResult.matches.length} match{testResult.matches.length !== 1 ? 'es' : ''} highlighted
                      </span>
                    </div>
                    <div 
                      className="p-4 bg-white dark:bg-neutral-900 border border-border-light dark:border-border-dark rounded-lg text-sm font-mono shadow-modern max-h-48 overflow-y-auto"
                      dangerouslySetInnerHTML={{ __html: highlightMatches() }}
                    />
                  </div>
                  
                  {/* Detailed Match Information */}
                  {testResult.matches.length > 0 && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-text-primary-light dark:text-text-primary-dark">Match Details:</span>
                        <span className="text-xs text-text-secondary-light dark:text-text-secondary-dark">
                          Click on matches to see details
                        </span>
                      </div>
                      
                      <div className="grid gap-3">
                        {testResult.matches.map((match, index) => (
                          <div key={index} className="p-4 bg-white dark:bg-neutral-900 rounded-lg border border-border-light dark:border-border-dark shadow-modern hover:shadow-modern-lg transition-all duration-200">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center space-x-2">
                                <span className="px-2 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-300 rounded text-xs font-medium">
                                  Match {index + 1}
                                </span>
                                <span className="text-xs text-text-secondary-light dark:text-text-secondary-dark">
                                  Position {testResult.positions[index]?.start}-{testResult.positions[index]?.end}
                                </span>
                              </div>
                              <span className="text-xs text-text-secondary-light dark:text-text-secondary-dark">
                                Length: {match.length}
                              </span>
                            </div>
                            
                            <div className="space-y-2">
                              <div className="font-mono text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20 p-2 rounded border border-primary-200 dark:border-primary-800">
                                "{match}"
                              </div>
                              
                              {testResult.groups[index] && testResult.groups[index].length > 0 && (
                                <div className="space-y-2">
                                  <span className="text-sm font-medium text-text-primary-light dark:text-text-primary-dark">Capture Groups:</span>
                                  <div className="grid gap-1">
                                    {testResult.groups[index].map((group, groupIndex) => (
                                      <div key={groupIndex} className="flex items-center space-x-2 text-sm">
                                        <span className="px-2 py-1 bg-accent-100 dark:bg-accent-900/30 text-accent-800 dark:text-accent-300 rounded text-xs font-medium min-w-[60px]">
                                          Group {groupIndex + 1}
                                        </span>
                                        <span className="font-mono text-accent-600 dark:text-accent-400">
                                          {group !== undefined ? `"${group}"` : '<undefined>'}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                              
                              {testResult.groups[index] && testResult.groups[index].length === 0 && (
                                <div className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                                  No capture groups in this match
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
              
              {!testResult.hasMatches && (
                <div className="p-4 bg-white dark:bg-neutral-900 rounded-lg border border-border-light dark:border-border-dark shadow-modern">
                  <div className="text-center text-text-secondary-light dark:text-text-secondary-dark">
                    <p className="text-lg font-medium mb-2">No matches found</p>
                    <p className="text-sm">Try adjusting your regex pattern or test text</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 