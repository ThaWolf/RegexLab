import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { TrainingExercise } from './training-exercise.entity'
import { TrainingLevel } from './training-level.enum'
import { TrainingResult } from './training-result.entity'

@Injectable()
export class TrainingsService {
  constructor(
    @InjectRepository(TrainingExercise)
    private readonly exerciseRepo: Repository<TrainingExercise>,
    @InjectRepository(TrainingResult)
    private readonly resultRepo: Repository<TrainingResult>,
  ) {}

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
  ): Promise<boolean> {
    const exercise = await this.exerciseRepo.findOneBy({ id: exerciseId })
    if (!exercise) return false
    const isCorrect = regex === exercise.expectedRegex
    await this.resultRepo.save({
      userId,
      exerciseId,
      userRegex: regex,
      isCorrect,
    })
    return isCorrect
  }
}
