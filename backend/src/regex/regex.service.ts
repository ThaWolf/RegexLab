import { Injectable } from '@nestjs/common'

export interface RegexExplanation {
  pattern: string
  description: string
  components: RegexComponent[]
  examples: string[]
  warnings: string[]
}

export interface RegexComponent {
  type: 'literal' | 'character-class' | 'quantifier' | 'group' | 'anchor' | 'escape' | 'modifier'
  value: string
  description: string
  position: { start: number; end: number }
}

export interface RegexGenerationRequest {
  description: string
  examples?: string[]
  flags?: string
}

@Injectable()
export class RegexService {
  /**
   * Parse and explain a regex pattern
   */
  async explainRegex(pattern: string, flags: string = ''): Promise<RegexExplanation> {
    try {
      // Validate the regex first
      new RegExp(pattern, flags)
      
      const components = this.parseComponents(pattern)
      const description = this.generateDescription(components)
      const examples = this.generateExamples(pattern, flags)
      const warnings = this.generateWarnings(pattern, flags)
      
      return {
        pattern,
        description,
        components,
        examples,
        warnings
      }
    } catch (error) {
      throw new Error(`Invalid regex pattern: ${error.message}`)
    }
  }

  /**
   * Generate regex from description
   */
  async generateRegex(request: RegexGenerationRequest): Promise<string> {
    const { description, examples, flags } = request
    
    // Simple pattern matching for common descriptions
    const patterns = this.matchDescriptionToPatterns(description.toLowerCase())
    
    if (patterns.length > 0) {
      return patterns[0].pattern
    }
    
    // If no direct match, try to build from examples
    if (examples && examples.length > 0) {
      return this.buildRegexFromExamples(examples)
    }
    
    throw new Error('Unable to generate regex from description. Please provide examples.')
  }

  /**
   * Test regex against text and return detailed results
   */
  async testRegex(pattern: string, text: string, flags: string = ''): Promise<{
    hasMatches: boolean
    matches: string[]
    groups: string[][]
    positions: { start: number; end: number }[]
  }> {
    try {
      const regex = new RegExp(pattern, flags)
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
      throw new Error(`Invalid regex: ${error.message}`)
    }
  }

  private parseComponents(pattern: string): RegexComponent[] {
    const components: RegexComponent[] = []
    let i = 0
    
    while (i < pattern.length) {
      const char = pattern[i]
      
      if (char === '\\') {
        // Escape sequence
        const escape = this.parseEscapeSequence(pattern, i)
        components.push(escape)
        i = escape.position.end
      } else if (char === '[') {
        // Character class
        const charClass = this.parseCharacterClass(pattern, i)
        components.push(charClass)
        i = charClass.position.end
      } else if (char === '(') {
        // Group
        const group = this.parseGroup(pattern, i)
        components.push(group)
        i = group.position.end
      } else if (char === '^' || char === '$') {
        // Anchor
        components.push({
          type: 'anchor',
          value: char,
          description: char === '^' ? 'Start of line' : 'End of line',
          position: { start: i, end: i + 1 }
        })
        i++
      } else if ('*+?{}'.includes(char)) {
        // Quantifier
        const quantifier = this.parseQuantifier(pattern, i)
        components.push(quantifier)
        i = quantifier.position.end
      } else {
        // Literal character
        components.push({
          type: 'literal',
          value: char,
          description: `Literal character '${char}'`,
          position: { start: i, end: i + 1 }
        })
        i++
      }
    }
    
    return components
  }

  private parseEscapeSequence(pattern: string, start: number): RegexComponent {
    const char = pattern[start + 1]
    let description = ''
    
    switch (char) {
      case 'd': description = 'Any digit (0-9)'; break
      case 'D': description = 'Any non-digit'; break
      case 'w': description = 'Word character (a-z, A-Z, 0-9, _)'; break
      case 'W': description = 'Non-word character'; break
      case 's': description = 'Whitespace character'; break
      case 'S': description = 'Non-whitespace character'; break
      case 'b': description = 'Word boundary'; break
      case 'B': description = 'Non-word boundary'; break
      case 'n': description = 'Newline character'; break
      case 't': description = 'Tab character'; break
      case 'r': description = 'Carriage return'; break
      default: description = `Escaped character '${char}'`
    }
    
    return {
      type: 'escape',
      value: `\\${char}`,
      description,
      position: { start, end: start + 2 }
    }
  }

  private parseCharacterClass(pattern: string, start: number): RegexComponent {
    let i = start + 1
    let content = '['
    let description = 'Character class: '
    
    while (i < pattern.length && pattern[i] !== ']') {
      content += pattern[i]
      i++
    }
    
    if (i < pattern.length) {
      content += ']'
      i++
    }
    
    // Generate description based on content
    if (content === '[a-z]') description += 'Lowercase letters'
    else if (content === '[A-Z]') description += 'Uppercase letters'
    else if (content === '[0-9]') description += 'Digits'
    else if (content === '[a-zA-Z]') description += 'Letters'
    else if (content === '[a-zA-Z0-9]') description += 'Alphanumeric characters'
    else description += `Characters: ${content.slice(1, -1)}`
    
    return {
      type: 'character-class',
      value: content,
      description,
      position: { start, end: i }
    }
  }

  private parseGroup(pattern: string, start: number): RegexComponent {
    let i = start + 1
    let content = '('
    let depth = 1
    
    while (i < pattern.length && depth > 0) {
      if (pattern[i] === '(') depth++
      else if (pattern[i] === ')') depth--
      content += pattern[i]
      i++
    }
    
    return {
      type: 'group',
      value: content,
      description: 'Group for capturing or non-capturing',
      position: { start, end: i }
    }
  }

  private parseQuantifier(pattern: string, start: number): RegexComponent {
    const char = pattern[start]
    let value = char
    let description = ''
    
    if (char === '{') {
      // Complex quantifier like {n,m}
      let i = start + 1
      while (i < pattern.length && pattern[i] !== '}') {
        value += pattern[i]
        i++
      }
      if (i < pattern.length) {
        value += '}'
        i++
      }
      description = `Quantifier: ${value}`
    } else {
      switch (char) {
        case '*': description = 'Zero or more times'; break
        case '+': description = 'One or more times'; break
        case '?': description = 'Zero or one time (optional)'; break
      }
    }
    
    return {
      type: 'quantifier',
      value,
      description,
      position: { start, end: start + value.length }
    }
  }

  private generateDescription(components: RegexComponent[]): string {
    const descriptions = components.map(c => c.description)
    return descriptions.join(', ')
  }

  private generateExamples(pattern: string, flags: string): string[] {
    const examples = []
    
    // Generate examples based on pattern type
    if (pattern.includes('\\d')) {
      examples.push('123', '456', '789')
    }
    if (pattern.includes('[a-z]')) {
      examples.push('abc', 'def', 'xyz')
    }
    if (pattern.includes('\\w')) {
      examples.push('hello', 'world', 'test123')
    }
    
    return examples.slice(0, 3) // Limit to 3 examples
  }

  private generateWarnings(pattern: string, flags: string): string[] {
    const warnings = []
    
    if (pattern.includes('.*') && !pattern.includes('^') && !pattern.includes('$')) {
      warnings.push('Consider using anchors (^, $) to avoid partial matches')
    }
    
    if (pattern.includes('\\d{4}') && !pattern.includes('\\b')) {
      warnings.push('Consider using word boundaries for number matching')
    }
    
    return warnings
  }

  private matchDescriptionToPatterns(description: string): Array<{ pattern: string; description: string }> {
    const patterns = []
    
    if (description.includes('email')) {
      patterns.push({
        pattern: '^[\\w.-]+@[\\w.-]+\\.[A-Za-z]{2,}$',
        description: 'Email validation pattern'
      })
    }
    
    if (description.includes('phone') || description.includes('number')) {
      patterns.push({
        pattern: '^\\+?[1-9]\\d{1,14}$',
        description: 'Phone number pattern'
      })
    }
    
    if (description.includes('date')) {
      patterns.push({
        pattern: '^(0[1-9]|[12][0-9]|3[01])/(0[1-9]|1[0-2])/\\d{4}$',
        description: 'Date pattern (DD/MM/YYYY)'
      })
    }
    
    if (description.includes('url')) {
      patterns.push({
        pattern: '^https?://[\\w.-]+\\.[A-Za-z]{2,}(/\\S*)?$',
        description: 'URL validation pattern'
      })
    }
    
    return patterns
  }

  private buildRegexFromExamples(examples: string[]): string {
    // Simple pattern building from examples
    if (examples.length === 0) return ''
    
    const first = examples[0]
    let pattern = ''
    
    for (let i = 0; i < first.length; i++) {
      const chars = examples.map(ex => ex[i]).filter((char, index, arr) => arr.indexOf(char) === index)
      
      if (chars.length === 1) {
        pattern += chars[0]
      } else if (chars.every(c => /[0-9]/.test(c))) {
        pattern += '\\d'
      } else if (chars.every(c => /[a-zA-Z]/.test(c))) {
        pattern += '[a-zA-Z]'
      } else {
        pattern += `[${chars.join('')}]`
      }
    }
    
    return pattern
  }
} 