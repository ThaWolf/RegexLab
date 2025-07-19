import { Injectable, OnModuleInit } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { TrainingExercise } from './training-exercise.entity'
import { TrainingLevel } from './training-level.enum'
import { TrainingResult } from './training-result.entity'
import { SeedService } from './seed.service'

export interface ValidationResult {
  valid: boolean
  matches?: string[]
  explanation?: string
  hint?: string
}

export interface UserProgress {
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

export interface DetailedUserStats {
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

@Injectable()
export class TrainingsService implements OnModuleInit {
  constructor(
    @InjectRepository(TrainingExercise)
    private readonly exerciseRepo: Repository<TrainingExercise>,
    @InjectRepository(TrainingResult)
    private readonly resultRepo: Repository<TrainingResult>,
    private readonly seedService: SeedService,
  ) {}

  async onModuleInit() {
    // Seed training exercises when the module initializes
    await this.seedService.seedTrainingExercises()
  }

  async randomByLevel(level: TrainingLevel): Promise<TrainingExercise | null> {
    return this.exerciseRepo
      .createQueryBuilder('exercise')
      .where('exercise.level = :level', { level })
      .orderBy('RANDOM()')
      .getOne()
  }

  async validateRegex(
    userId: number,
    exerciseId: number,
    regex: string,
  ): Promise<ValidationResult> {
    const exercise = await this.exerciseRepo.findOneBy({ id: exerciseId })
    if (!exercise) {
      return {
        valid: false,
        explanation: 'Exercise not found',
      }
    }

    const isCorrect = regex === exercise.expectedRegex
    
    // Save the result
    await this.resultRepo.save({
      userId,
      exerciseId,
      userRegex: regex,
      isCorrect,
    })

    // Get matches for feedback
    let matches: string[] = []
    try {
      const regexObj = new RegExp(regex, 'g')
      matches = exercise.inputString.match(regexObj) || []
    } catch (error) {
      // Invalid regex - no matches
    }

    if (isCorrect) {
      return {
        valid: true,
        matches,
        explanation: 'Great job! Your regex pattern correctly matches the required elements.',
      }
    } else {
      const hint = this.generateHint(exercise, regex, matches)
      return {
        valid: false,
        matches,
        hint,
        explanation: 'Your regex pattern doesn\'t match the expected result. Try adjusting your pattern.',
      }
    }
  }

  async getUserProgress(userId: number, level?: TrainingLevel): Promise<UserProgress> {
    const query = this.resultRepo
      .createQueryBuilder('result')
      .leftJoin('result.exercise', 'exercise')
      .where('result.userId = :userId', { userId })

    if (level) {
      query.andWhere('exercise.level = :level', { level })
    }

    const results = await query.getMany()
    const totalExercises = await this.exerciseRepo.count({
      where: level ? { level } : {},
    })

    const completedExercises = new Set(results.map(r => r.exerciseId)).size
    const correctResults = results.filter(r => r.isCorrect).length
    const averageScore = results.length > 0 ? Math.round((correctResults / results.length) * 100) : 0

    // Calculate current streak
    const sortedResults = results
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    
    let currentStreak = 0
    for (const result of sortedResults) {
      if (result.isCorrect) {
        currentStreak++
      } else {
        break
      }
    }

    // Calculate level progress
    const levelProgress = {
      basic: { completed: 0, total: 0, accuracy: 0 },
      intermediate: { completed: 0, total: 0, accuracy: 0 },
      advanced: { completed: 0, total: 0, accuracy: 0 }
    }

    // Get level-specific stats
    for (const level of ['basic', 'intermediate', 'advanced'] as TrainingLevel[]) {
      const levelResults = results.filter(r => r.exercise?.level === level)
      const levelExercises = await this.exerciseRepo.count({ where: { level } })
      const levelCorrect = levelResults.filter(r => r.isCorrect).length
      
      levelProgress[level] = {
        completed: new Set(levelResults.map(r => r.exerciseId)).size,
        total: levelExercises,
        accuracy: levelResults.length > 0 ? Math.round((levelCorrect / levelResults.length) * 100) : 0
      }
    }

    // Calculate weekly stats (last 7 days)
    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
    const weeklyResults = results.filter(r => new Date(r.timestamp) >= oneWeekAgo)
    const weeklyCorrect = weeklyResults.filter(r => r.isCorrect).length

    // Calculate achievements
    const achievements = this.calculateAchievements(results, completedExercises, currentStreak, averageScore)

    return {
      totalExercises,
      completedExercises,
      currentStreak,
      averageScore,
      totalTimeSpent: results.length * 30, // Estimate 30 seconds per attempt
      lastActivity: results.length > 0 ? results[0].timestamp : new Date(),
      levelProgress,
      achievements,
      weeklyStats: {
        attempts: weeklyResults.length,
        correct: weeklyCorrect,
        accuracy: weeklyResults.length > 0 ? Math.round((weeklyCorrect / weeklyResults.length) * 100) : 0,
        streak: currentStreak
      }
    }
  }

  async getUserStats(userId: number) {
    const results = await this.resultRepo.find({
      where: { userId },
      relations: ['exercise'],
    })

    const stats = {
      totalAttempts: results.length,
      correctAttempts: results.filter(r => r.isCorrect).length,
      accuracy: results.length > 0 ? Math.round((results.filter(r => r.isCorrect).length / results.length) * 100) : 0,
      levelBreakdown: {
        basic: { total: 0, correct: 0 },
        intermediate: { total: 0, correct: 0 },
        advanced: { total: 0, correct: 0 },
      },
      recentActivity: results.slice(0, 10).map(r => ({
        exerciseId: r.exerciseId,
        isCorrect: r.isCorrect,
        timestamp: r.timestamp,
      })),
    }

    // Calculate level breakdown
    for (const result of results) {
      if (result.exercise) {
        const level = result.exercise.level
        stats.levelBreakdown[level].total++
        if (result.isCorrect) {
          stats.levelBreakdown[level].correct++
        }
      }
    }

    return stats
  }

  async getDetailedUserStats(userId: number): Promise<DetailedUserStats> {
    const results = await this.resultRepo.find({
      where: { userId },
      relations: ['exercise'],
      order: { timestamp: 'DESC' }
    })

    const totalAttempts = results.length
    const correctAttempts = results.filter(r => r.isCorrect).length
    const accuracy = totalAttempts > 0 ? Math.round((correctAttempts / totalAttempts) * 100) : 0

    // Calculate level breakdown with completion status
    const levelBreakdown = {
      basic: { total: 0, correct: 0, accuracy: 0, completed: 0 },
      intermediate: { total: 0, correct: 0, accuracy: 0, completed: 0 },
      advanced: { total: 0, correct: 0, accuracy: 0, completed: 0 }
    }

    const completedExercises = new Set(results.map(r => r.exerciseId))
    
    for (const level of ['basic', 'intermediate', 'advanced'] as TrainingLevel[]) {
      const levelResults = results.filter(r => r.exercise?.level === level)
      const levelExercises = await this.exerciseRepo.count({ where: { level } })
      const levelCorrect = levelResults.filter(r => r.isCorrect).length
      const levelCompleted = new Set(levelResults.map(r => r.exerciseId)).size
      
      levelBreakdown[level] = {
        total: levelResults.length,
        correct: levelCorrect,
        accuracy: levelResults.length > 0 ? Math.round((levelCorrect / levelResults.length) * 100) : 0,
        completed: levelCompleted
      }
    }

    // Calculate streaks
    const streaks = this.calculateStreaks(results)

    // Calculate achievements
    const achievements = this.calculateDetailedAchievements(results, completedExercises.size, streaks.current, accuracy)

    // Calculate weekly progress (last 8 weeks)
    const weeklyProgress = this.calculateWeeklyProgress(results)

    return {
      totalAttempts,
      correctAttempts,
      accuracy,
      totalTimeSpent: totalAttempts * 30, // Estimate 30 seconds per attempt
      averageAttemptsPerExercise: completedExercises.size > 0 ? Math.round(totalAttempts / completedExercises.size * 10) / 10 : 0,
      levelBreakdown,
      recentActivity: results.slice(0, 10).map(r => ({
        exerciseId: r.exerciseId,
        exerciseLevel: r.exercise?.level || 'unknown',
        isCorrect: r.isCorrect,
        timestamp: r.timestamp,
        userRegex: r.userRegex
      })),
      streaks,
      achievements,
      weeklyProgress
    }
  }

  private generateHint(exercise: TrainingExercise, userRegex: string, matches: string[]): string {
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

  private calculateAchievements(results: TrainingResult[], completedExercises: number, currentStreak: number, averageScore: number): string[] {
    const achievements: string[] = []

    // First exercise completed
    if (completedExercises >= 1) {
      achievements.push('First Steps')
    }

    // Completed 5 exercises
    if (completedExercises >= 5) {
      achievements.push('Getting Started')
    }

    // Completed 10 exercises
    if (completedExercises >= 10) {
      achievements.push('Dedicated Learner')
    }

    // Completed all basic exercises
    if (completedExercises >= 15) {
      achievements.push('Regex Master')
    }

    // Streak achievements
    if (currentStreak >= 3) {
      achievements.push('On Fire')
    }

    if (currentStreak >= 5) {
      achievements.push('Unstoppable')
    }

    // Accuracy achievements
    if (averageScore >= 80) {
      achievements.push('High Achiever')
    }

    if (averageScore >= 95) {
      achievements.push('Perfectionist')
    }

    // Activity achievements
    if (results.length >= 50) {
      achievements.push('Persistent')
    }

    if (results.length >= 100) {
      achievements.push('Veteran')
    }

    return achievements
  }

  private calculateStreaks(results: TrainingResult[]) {
    const sortedResults = results.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    
    let currentStreak = 0
    let longestStreak = 0
    let tempStreak = 0

    for (const result of sortedResults) {
      if (result.isCorrect) {
        tempStreak++
        if (tempStreak === 1) {
          currentStreak = 1
        } else {
          currentStreak = tempStreak
        }
        longestStreak = Math.max(longestStreak, tempStreak)
      } else {
        tempStreak = 0
      }
    }

    // Calculate average streak
    let totalStreaks = 0
    let streakCount = 0
    tempStreak = 0

    for (const result of sortedResults) {
      if (result.isCorrect) {
        tempStreak++
      } else {
        if (tempStreak > 0) {
          totalStreaks += tempStreak
          streakCount++
        }
        tempStreak = 0
      }
    }

    const averageStreak = streakCount > 0 ? Math.round(totalStreaks / streakCount) : 0

    return {
      current: currentStreak,
      longest: longestStreak,
      average: averageStreak
    }
  }

  private calculateDetailedAchievements(results: TrainingResult[], completedExercises: number, currentStreak: number, accuracy: number) {
    const achievements: Array<{ id: string; name: string; description: string; earnedAt: Date }> = []
    const latestResult = results[0]

    // First exercise completed
    if (completedExercises >= 1) {
      achievements.push({
        id: 'first_steps',
        name: 'First Steps',
        description: 'Completed your first regex exercise',
        earnedAt: latestResult?.timestamp || new Date()
      })
    }

    // Completed 5 exercises
    if (completedExercises >= 5) {
      achievements.push({
        id: 'getting_started',
        name: 'Getting Started',
        description: 'Completed 5 regex exercises',
        earnedAt: latestResult?.timestamp || new Date()
      })
    }

    // Completed 10 exercises
    if (completedExercises >= 10) {
      achievements.push({
        id: 'dedicated_learner',
        name: 'Dedicated Learner',
        description: 'Completed 10 regex exercises',
        earnedAt: latestResult?.timestamp || new Date()
      })
    }

    // Streak achievements
    if (currentStreak >= 3) {
      achievements.push({
        id: 'on_fire',
        name: 'On Fire',
        description: 'Achieved a 3+ correct answer streak',
        earnedAt: latestResult?.timestamp || new Date()
      })
    }

    // Accuracy achievements
    if (accuracy >= 80) {
      achievements.push({
        id: 'high_achiever',
        name: 'High Achiever',
        description: 'Maintained 80%+ accuracy',
        earnedAt: latestResult?.timestamp || new Date()
      })
    }

    return achievements
  }

  private calculateWeeklyProgress(results: TrainingResult[]) {
    const weeklyProgress: Array<{ week: string; attempts: number; correct: number; accuracy: number }> = []
    
    for (let i = 7; i >= 0; i--) {
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - (i * 7))
      const endDate = new Date(startDate)
      endDate.setDate(endDate.getDate() + 6)

      const weekResults = results.filter(r => {
        const resultDate = new Date(r.timestamp)
        return resultDate >= startDate && resultDate <= endDate
      })

      const weekCorrect = weekResults.filter(r => r.isCorrect).length
      const weekAccuracy = weekResults.length > 0 ? Math.round((weekCorrect / weekResults.length) * 100) : 0

      weeklyProgress.push({
        week: startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        attempts: weekResults.length,
        correct: weekCorrect,
        accuracy: weekAccuracy
      })
    }

    return weeklyProgress
  }
}
