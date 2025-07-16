import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UsersController } from './users.controller'
import { UsersService } from './users.service'
import { TrainingResult } from '../trainings/training-result.entity'
import { TrainingExercise } from '../trainings/training-exercise.entity'

@Module({
  imports: [TypeOrmModule.forFeature([TrainingResult, TrainingExercise])],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
