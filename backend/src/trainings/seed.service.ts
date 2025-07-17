import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { TrainingExercise } from './training-exercise.entity'
import { trainingExercises } from './seed-data'

@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(TrainingExercise)
    private readonly exerciseRepo: Repository<TrainingExercise>,
  ) {}

  async seedTrainingExercises(): Promise<void> {
    try {
      // Check if exercises already exist
      const existingCount = await this.exerciseRepo.count()
      if (existingCount > 0) {
        console.log(`Database already contains ${existingCount} training exercises. Skipping seed.`)
        return
      }

      // Insert all training exercises
      const exercises = trainingExercises.map(exercise => this.exerciseRepo.create(exercise))
      await this.exerciseRepo.save(exercises)
      
      console.log(`Successfully seeded ${exercises.length} training exercises.`)
    } catch (error) {
      console.error('Error seeding training exercises:', error)
    }
  }
} 