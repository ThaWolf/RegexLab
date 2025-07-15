import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { TrainingExercise } from './training-exercise.entity'
import { TrainingsService } from './trainings.service'
import { TrainingsController } from './trainings.controller'

@Module({
  imports: [TypeOrmModule.forFeature([TrainingExercise])],
  providers: [TrainingsService],
  controllers: [TrainingsController],
})
export class TrainingsModule {}
