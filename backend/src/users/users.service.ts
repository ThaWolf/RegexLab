import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { TrainingResult } from '../trainings/training-result.entity'
import { TrainingExercise } from '../trainings/training-exercise.entity'

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(TrainingResult)
    private readonly resultsRepo: Repository<TrainingResult>,
    @InjectRepository(TrainingExercise)
    private readonly exercisesRepo: Repository<TrainingExercise>,
  ) {}

  async getStats(userId: number) {
    const totalCompleted = await this.resultsRepo.count({ where: { userId } })
    const successes = await this.resultsRepo.count({ where: { userId, isCorrect: true } })

    const byLevelRows = await this.resultsRepo
      .createQueryBuilder('result')
      .leftJoin(TrainingExercise, 'exercise', 'exercise.id = result.exerciseId')
      .select('exercise.level', 'level')
      .addSelect('COUNT(*)', 'count')
      .where('result.userId = :userId', { userId })
      .andWhere('result.isCorrect = true')
      .groupBy('exercise.level')
      .getRawMany()

    const correctByLevel: Record<string, number> = {}
    for (const row of byLevelRows) {
      correctByLevel[row.level] = parseInt(row.count, 10)
    }

    const successRate = totalCompleted === 0 ? 0 : successes / totalCompleted

    return { totalCompleted, correctByLevel, successRate }
  }
}
