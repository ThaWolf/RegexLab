import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { TrainingExercise } from './training-exercise.entity'
import { TrainingLevel } from './training-level.enum'

@Injectable()
export class TrainingsService {
  constructor(
    @InjectRepository(TrainingExercise)
    private readonly repo: Repository<TrainingExercise>,
  ) {}

  async randomByLevel(level: TrainingLevel): Promise<TrainingExercise | null> {
    return this.repo
      .createQueryBuilder('exercise')
      .where('exercise.level = :level', { level })
      .orderBy('RANDOM()')
      .getOne()
  }

  async validateRegex(
    exerciseId: number,
    regex: string,
  ): Promise<boolean> {
    const exercise = await this.repo.findOneBy({ id: exerciseId })
    if (!exercise) return false
    return regex === exercise.expectedRegex
  }
}
