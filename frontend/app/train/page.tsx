'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { useSession } from 'next-auth/react'
import { Button } from '../../components/ui/button'

const CodeMirror = dynamic(() => import('@uiw/react-codemirror'), { ssr: false })

interface Exercise {
  id: number
  inputString: string
  description: string
  expectedRegex: string
  level: 'basic' | 'intermediate' | 'advanced'
}

interface TrainingProgress {
  totalExercises: number
  completedExercises: number
  currentStreak: number
  averageScore: number
  totalTimeSpent: number
  lastActivity: Date
  levelProgress: {
    basic: { completed: number; total: number; accuracy: number }
    intermediate: { completed: number; total: number; accuracy: number }
    advanced: { completed: number; total: number; accuracy: number }
  }
  achievements: string[]
  weeklyStats: {
    attempts: number
    correct: number
    accuracy: number
    streak: number
  }
}

interface DetailedUserStats {
  totalAttempts: number
  correctAttempts: number
  accuracy: number
  totalTimeSpent: number
  averageAttemptsPerExercise: number
  levelBreakdown: {
    basic: { total: number; correct: number; accuracy: number; completed: number }
    intermediate: { total: number; correct: number; accuracy: number; completed: number }
    advanced: { total: number; correct: number; accuracy: number; completed: number }
  }
  recentActivity: Array<{
    exerciseId: number
    exerciseLevel: string
    isCorrect: boolean
    timestamp: Date
    userRegex: string
  }>
  streaks: {
    current: number
    longest: number
    average: number
  }
  achievements: Array<{
    id: string
    name: string
    description: string
    earnedAt: Date
  }>
  weeklyProgress: Array<{
    week: string
    attempts: number
    correct: number
    accuracy: number
  }>
}

interface ValidationResult {
  valid: boolean
  matches?: string[]
  explanation?: string
  hint?: string
}

export default function TrainPage() {
  const [exercise, setExercise] = useState<Exercise | null>(null)
  const [regex, setRegex] = useState('')
  const [result, setResult] = useState<ValidationResult | null>(null)
  const [level, setLevel] = useState<'basic' | 'intermediate' | 'advanced'>('basic')
  const [progress, setProgress] = useState<TrainingProgress | null>(null)
  const [detailedStats, setDetailedStats] = useState<DetailedUserStats | null>(null)
  const [showHint, setShowHint] = useState(false)
  const [showSolution, setShowSolution] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentMatches, setCurrentMatches] = useState<string[]>([])
  const [showDetailedStats, setShowDetailedStats] = useState(false)
  const { data: session } = useSession()

  const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

  useEffect(() => {
    fetchExercise()
    fetchProgress()
    fetchDetailedStats()
  }, [level])

  // Real-time validation as user types
  useEffect(() => {
    if (!exercise || !regex.trim()) {
      setCurrentMatches([])
      return
    }

    try {
      const regexObj = new RegExp(regex, 'g')
      const matches = exercise.inputString.match(regexObj) || []
      setCurrentMatches(matches)
    } catch (error) {
      setCurrentMatches([])
    }
  }, [regex, exercise])

  const fetchExercise = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`${apiBase}/trainings/random?level=${level}`)
      if (!response.ok) throw new Error('Failed to fetch exercise')
      const data = await response.json()
      setExercise(data)
      setRegex('')
      setResult(null)
      setShowHint(false)
      setShowSolution(false)
    } catch (error) {
      // Fallback to demo exercises when backend is not available
      const demoExercises = {
        basic: [
          {
            id: 1,
            inputString: 'Hello world',
            description: 'Match the word "Hello"',
            expectedRegex: 'Hello',
            level: 'basic'
          },
          {
            id: 2,
            inputString: 'The quick brown fox',
            description: 'Match the word "fox"',
            expectedRegex: 'fox',
            level: 'basic'
          }
        ],
        intermediate: [
          {
            id: 3,
            inputString: 'Email: user@example.com',
            description: 'Match an email address',
            expectedRegex: '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}',
            level: 'intermediate'
          }
        ],
        advanced: [
          {
            id: 4,
            inputString: 'Phone: +1-555-123-4567',
            description: 'Match a phone number with country code',
            expectedRegex: '\\+?[1-9]\\d{1,14}',
            level: 'advanced'
          }
        ]
      }
      
      const exercises = demoExercises[level as keyof typeof demoExercises] || demoExercises.basic
      const randomExercise = exercises[Math.floor(Math.random() * exercises.length)] as Exercise
      setExercise(randomExercise)
      setRegex('')
      setResult(null)
      setShowHint(false)
      setShowSolution(false)
      setError('Using demo mode - backend not available')
    } finally {
      setLoading(false)
    }
  }

  const fetchProgress = async () => {
    if (!session?.user?.id) return
    
    try {
      const response = await fetch(`${apiBase}/trainings/progress?userId=${session.user.id}&level=${level}`)
      if (response.ok) {
        const data = await response.json()
        setProgress(data)
      }
    } catch (error) {
      console.error('Failed to fetch progress:', error)
    }
  }

  const fetchDetailedStats = async () => {
    if (!session?.user?.id) return
    
    try {
      const response = await fetch(`${apiBase}/trainings/stats?userId=${session.user.id}`)
      if (response.ok) {
        const data = await response.json()
        setDetailedStats(data)
      }
    } catch (error) {
      console.error('Failed to fetch detailed stats:', error)
    }
  }

  const handleValidate = async () => {
    if (!exercise) return
    
    setLoading(true)
    setError(null)
    
    try {
      // If we have a session, try to validate with backend
      if (session?.user?.id) {
        const response = await fetch(`${apiBase}/trainings/validate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: session.user.id,
            id: exercise.id,
            regex,
          }),
        })
        
        if (response.ok) {
          const data = await response.json()
          setResult(data)
          
          if (data.valid) {
            // Fetch updated progress after successful completion
            fetchProgress()
            fetchDetailedStats()
          }
          return
        }
      }
      
      // Fallback validation for demo mode
      try {
        const userRegex = new RegExp(regex, 'g')
        const matches = exercise.inputString.match(userRegex) || []
        const expectedRegex = new RegExp(exercise.expectedRegex, 'g')
        const expectedMatches = exercise.inputString.match(expectedRegex) || []
        
        const isValid = matches.length > 0 && matches.length === expectedMatches.length &&
          matches.every((match, index) => match === expectedMatches[index])
        
        setResult({
          valid: isValid,
          matches: matches,
          explanation: isValid 
            ? 'Great job! Your regex pattern correctly matches the required elements.'
            : 'Your regex pattern doesn\'t match the expected result. Try again!',
          hint: isValid ? undefined : getHint()
        })
      } catch (regexError) {
        setResult({
          valid: false,
          explanation: 'Invalid regex pattern. Please check your syntax.',
          hint: 'Make sure your regex pattern is valid. Common issues include unescaped special characters.'
        })
      }
    } catch (error) {
      setError('Failed to validate solution. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const getHint = () => {
    if (!exercise) return ''
    
    const hints = {
      basic: [
        'Try matching the exact word or phrase',
        'Use simple text matching without special characters',
        'Look for the specific word mentioned in the description'
      ],
      intermediate: [
        'Use character classes like [a-z] for letters',
        'Try using quantifiers like + or *',
        'Consider using anchors like ^ or $',
        'Use escape sequences like \\d for digits'
      ],
      advanced: [
        'Use lookahead/lookbehind assertions',
        'Consider using non-capturing groups (?:...)',
        'Use word boundaries \\b for precise matching',
        'Try using alternation | for multiple options'
      ]
    }
    
    const levelHints = hints[exercise.level] || hints.basic
    return levelHints[Math.floor(Math.random() * levelHints.length)]
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'basic': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
      case 'advanced': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
    }
  }

  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading && !exercise) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-6">
          <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mx-auto animate-pulse-gentle">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <p className="text-text-secondary-light dark:text-text-secondary-dark text-lg">Loading training exercise...</p>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <section className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
          Training Exercises
        </h1>
        <p className="text-text-secondary-light dark:text-text-secondary-dark text-lg">
          Practice your regex skills with interactive exercises
        </p>
      </section>

      {/* Enhanced Progress Dashboard */}
      {progress && (
        <section className="max-w-6xl mx-auto">
          <div className="bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 border border-primary-200 dark:border-primary-800 rounded-2xl shadow-modern-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark">Your Progress</h2>
              <Button
                onClick={() => setShowDetailedStats(!showDetailedStats)}
                variant="outline"
                size="sm"
              >
                {showDetailedStats ? 'Hide Details' : 'Show Details'}
              </Button>
            </div>
            
            {/* Basic Progress Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">{progress.completedExercises}</div>
                <div className="text-sm text-text-secondary-light dark:text-text-secondary-dark">Completed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent-600 dark:text-accent-400">{progress.totalExercises}</div>
                <div className="text-sm text-text-secondary-light dark:text-text-secondary-dark">Total</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-secondary-600 dark:text-secondary-400">{progress.currentStreak}</div>
                <div className="text-sm text-text-secondary-light dark:text-text-secondary-dark">Streak</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">{progress.averageScore}%</div>
                <div className="text-sm text-text-secondary-light dark:text-text-secondary-dark">Success Rate</div>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="mb-6">
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-primary-500 to-secondary-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(progress.completedExercises / progress.totalExercises) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Detailed Stats */}
            {showDetailedStats && detailedStats && (
              <div className="space-y-6 border-t border-primary-200 dark:border-primary-800 pt-6">
                {/* Overall Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white dark:bg-neutral-900 rounded-lg p-4 border border-border-light dark:border-border-dark">
                    <h3 className="text-sm font-semibold text-text-secondary-light dark:text-text-secondary-dark mb-2">Total Attempts</h3>
                    <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">{detailedStats.totalAttempts}</div>
                    <div className="text-xs text-text-secondary-light dark:text-text-secondary-dark mt-1">
                      {detailedStats.averageAttemptsPerExercise.toFixed(1)} avg per exercise
                    </div>
                  </div>
                  <div className="bg-white dark:bg-neutral-900 rounded-lg p-4 border border-border-light dark:border-border-dark">
                    <h3 className="text-sm font-semibold text-text-secondary-light dark:text-text-secondary-dark mb-2">Accuracy</h3>
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">{detailedStats.accuracy}%</div>
                    <div className="text-xs text-text-secondary-light dark:text-text-secondary-dark mt-1">
                      {detailedStats.correctAttempts} correct out of {detailedStats.totalAttempts}
                    </div>
                  </div>
                  <div className="bg-white dark:bg-neutral-900 rounded-lg p-4 border border-border-light dark:border-border-dark">
                    <h3 className="text-sm font-semibold text-text-secondary-light dark:text-text-secondary-dark mb-2">Time Spent</h3>
                    <div className="text-2xl font-bold text-secondary-600 dark:text-secondary-400">
                      {formatTime(detailedStats.totalTimeSpent)}
                    </div>
                    <div className="text-xs text-text-secondary-light dark:text-text-secondary-dark mt-1">
                      Learning and practicing
                    </div>
                  </div>
                </div>

                {/* Level Breakdown */}
                <div className="bg-white dark:bg-neutral-900 rounded-lg p-4 border border-border-light dark:border-border-dark">
                  <h3 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark mb-4">Level Breakdown</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {(['basic', 'intermediate', 'advanced'] as const).map((level) => {
                      const stats = detailedStats.levelBreakdown[level]
                      return (
                        <div key={level} className="text-center">
                          <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-2 ${getLevelColor(level)}`}>
                            {level.charAt(0).toUpperCase() + level.slice(1)}
                          </div>
                          <div className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark">
                            {stats.completed}/{stats.total}
                          </div>
                          <div className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                            {stats.accuracy}% accuracy
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1 mt-2">
                            <div 
                              className="bg-gradient-to-r from-primary-500 to-secondary-500 h-1 rounded-full"
                              style={{ width: `${(stats.completed / stats.total) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Streaks and Achievements */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white dark:bg-neutral-900 rounded-lg p-4 border border-border-light dark:border-border-dark">
                    <h3 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark mb-4">Streaks</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-text-secondary-light dark:text-text-secondary-dark">Current</span>
                        <span className="font-semibold text-primary-600 dark:text-primary-400">{detailedStats.streaks.current}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-secondary-light dark:text-text-secondary-dark">Longest</span>
                        <span className="font-semibold text-secondary-600 dark:text-secondary-400">{detailedStats.streaks.longest}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-secondary-light dark:text-text-secondary-dark">Average</span>
                        <span className="font-semibold text-accent-600 dark:text-accent-400">{detailedStats.streaks.average.toFixed(1)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white dark:bg-neutral-900 rounded-lg p-4 border border-border-light dark:border-border-dark">
                    <h3 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark mb-4">Achievements</h3>
                    {detailedStats.achievements.length > 0 ? (
                      <div className="space-y-2">
                        {detailedStats.achievements.slice(0, 3).map((achievement) => (
                          <div key={achievement.id} className="flex items-center space-x-2">
                            <span className="text-yellow-500">🏆</span>
                            <div>
                              <div className="text-sm font-medium text-text-primary-light dark:text-text-primary-dark">
                                {achievement.name}
                              </div>
                              <div className="text-xs text-text-secondary-light dark:text-text-secondary-dark">
                                {achievement.description}
                              </div>
                            </div>
                          </div>
                        ))}
                        {detailedStats.achievements.length > 3 && (
                          <div className="text-xs text-text-secondary-light dark:text-text-secondary-dark">
                            +{detailedStats.achievements.length - 3} more achievements
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-text-secondary-light dark:text-text-secondary-dark text-sm">
                        Complete exercises to earn achievements!
                      </div>
                    )}
                  </div>
                </div>

                {/* Recent Activity */}
                {detailedStats.recentActivity.length > 0 && (
                  <div className="bg-white dark:bg-neutral-900 rounded-lg p-4 border border-border-light dark:border-border-dark">
                    <h3 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark mb-4">Recent Activity</h3>
                    <div className="space-y-2">
                      {detailedStats.recentActivity.slice(0, 5).map((activity, index) => (
                        <div key={index} className="flex items-center justify-between text-sm">
                          <div className="flex items-center space-x-2">
                            <span className={activity.isCorrect ? 'text-green-500' : 'text-red-500'}>
                              {activity.isCorrect ? '✓' : '✗'}
                            </span>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${getLevelColor(activity.exerciseLevel)}`}>
                              {activity.exerciseLevel}
                            </span>
                            <span className="text-text-secondary-light dark:text-text-secondary-dark">
                              Exercise #{activity.exerciseId}
                            </span>
                          </div>
                          <span className="text-text-secondary-light dark:text-text-secondary-dark">
                            {formatDate(activity.timestamp.toString())}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Weekly Progress */}
                {detailedStats.weeklyProgress.length > 0 && (
                  <div className="bg-white dark:bg-neutral-900 rounded-lg p-4 border border-border-light dark:border-border-dark">
                    <h3 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark mb-4">Weekly Progress</h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      {detailedStats.weeklyProgress.slice(-4).map((week, index) => (
                        <div key={index} className="text-center">
                          <div className="text-sm text-text-secondary-light dark:text-text-secondary-dark mb-1">
                            {week.week}
                          </div>
                          <div className="text-lg font-bold text-primary-600 dark:text-primary-400">
                            {week.accuracy}%
                          </div>
                          <div className="text-xs text-text-secondary-light dark:text-text-secondary-dark">
                            {week.correct}/{week.attempts} correct
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Main Content */}
      <section className="max-w-4xl mx-auto">
        <div className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-2xl shadow-modern-lg p-8 space-y-8 transition-all duration-300 hover:shadow-modern-xl">
          
          {/* Level Selector and Navigation */}
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">Current Exercise</h2>
            <div className="flex items-center gap-4">
              <label htmlFor="level" className="font-semibold text-text-primary-light dark:text-text-primary-dark">Level:</label>
              <select
                id="level"
                className="border border-border-light dark:border-border-dark rounded-lg px-4 py-2 bg-white dark:bg-neutral-900 text-text-primary-light dark:text-text-primary-dark focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-400 dark:focus:border-primary-400 transition-all duration-200 shadow-modern"
                value={level}
                onChange={(e) => setLevel(e.target.value as any)}
              >
                <option value="basic">Basic</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
              <Button
                onClick={fetchExercise}
                variant="outline"
                size="sm"
                disabled={loading}
              >
                {loading ? 'Loading...' : 'New Exercise'}
              </Button>
            </div>
          </div>

          {/* Exercise Info */}
          {exercise && (
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getLevelColor(exercise.level)}`}>
                  {exercise.level.charAt(0).toUpperCase() + exercise.level.slice(1)}
                </span>
                <span className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                  Exercise #{exercise.id}
                </span>
              </div>
            </div>
          )}

          {/* Exercise Description */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark">Description</h3>
            <p className="text-text-secondary-light dark:text-text-secondary-dark text-lg leading-relaxed">{exercise?.description}</p>
          </div>

          {/* Input String */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark">Input String</h3>
            <div className="p-4 bg-white dark:bg-neutral-900 border border-border-light dark:border-border-dark rounded-lg font-mono text-base text-primary-600 dark:text-primary-400 shadow-modern">
              {exercise?.inputString}
            </div>
          </div>

          {/* Real-time Match Preview */}
          {currentMatches.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark">Live Preview</h3>
              <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <div className="text-sm text-green-800 dark:text-green-200 mb-2">
                  Found {currentMatches.length} match{currentMatches.length !== 1 ? 'es' : ''}:
                </div>
                <div className="flex flex-wrap gap-2">
                  {currentMatches.map((match, index) => (
                    <span key={index} className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded text-sm font-mono">
                      "{match}"
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Regex Editor */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark">Your Regex Pattern</h3>
            <div className="border border-border-light dark:border-border-dark rounded-lg overflow-hidden shadow-modern">
              <CodeMirror value={regex} height="120px" onChange={(val) => setRegex(val)} />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-4 pt-4">
            <Button
              onClick={() => setShowHint(!showHint)}
              variant="outline"
              size="lg"
            >
              {showHint ? 'Hide Hint' : 'Get Hint'}
            </Button>
            <Button
              onClick={handleValidate}
              variant="primary"
              size="lg"
              disabled={loading || !regex.trim()}
            >
              {loading ? 'Validating...' : 'Validate Solution'}
            </Button>
            <Button
              onClick={() => setShowSolution(!showSolution)}
              variant="outline"
              size="lg"
            >
              {showSolution ? 'Hide Solution' : 'Show Solution'}
            </Button>
          </div>

          {/* Error Display */}
          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-800 dark:text-red-200 text-sm font-medium">{error}</p>
            </div>
          )}

          {/* Hint */}
          {showHint && (
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <h4 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-2">💡 Hint</h4>
              <p className="text-blue-700 dark:text-blue-300">{getHint()}</p>
            </div>
          )}

          {/* Solution */}
          {showSolution && exercise && (
            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
              <h4 className="text-lg font-semibold text-purple-800 dark:text-purple-200 mb-2">🔍 Solution</h4>
              <div className="space-y-2">
                <div className="font-mono text-purple-700 dark:text-purple-300 bg-purple-100 dark:bg-purple-900/30 p-2 rounded">
                  {exercise.expectedRegex}
                </div>
                <p className="text-purple-700 dark:text-purple-300 text-sm">
                  This pattern will match the required elements in the input string.
                </p>
              </div>
            </div>
          )}

          {/* Result */}
          {result && (
            <div className={`text-center p-6 rounded-lg font-bold text-lg ${
              result.valid 
                ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-800' 
                : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-800'
            }`}>
              <div className="text-2xl mb-2">
                {result.valid ? '🎉' : '❌'}
              </div>
              <div className="mb-2">
                {result.valid ? 'Correct!' : 'Incorrect'}
              </div>
              {result.explanation && (
                <p className="text-sm font-normal mt-2 opacity-90">
                  {result.explanation}
                </p>
              )}
              {result.hint && !result.valid && (
                <p className="text-sm font-normal mt-2 opacity-90">
                  💡 {result.hint}
                </p>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
