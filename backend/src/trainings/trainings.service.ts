import { Injectable, OnModuleInit } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { TrainingExercise } from './training-exercise.entity'
import { TrainingLevel } from './training-level.enum'
import { TrainingResult } from './training-result.entity'
import { SeedService } from './seed.service'

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
