import { cn } from '../lib/utils'

describe('cn utility', () => {
  it('merges class names', () => {
    expect(cn('a', false && 'b', 'c')).toBe('a c')
  })
})
