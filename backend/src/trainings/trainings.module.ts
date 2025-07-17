import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { TrainingExercise } from './training-exercise.entity'
import { TrainingResult } from './training-result.entity'
import { TrainingsService } from './trainings.service'
import { TrainingsController } from './trainings.controller'
import { SeedService } from './seed.service'

@Module({
  imports: [TypeOrmModule.forFeature([TrainingExercise, TrainingResult])],
  providers: [TrainingsService, SeedService],
  controllers: [TrainingsController],
})
export class TrainingsModule {}
