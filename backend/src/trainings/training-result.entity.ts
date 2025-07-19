import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm'
import { TrainingExercise } from './training-exercise.entity'

@Entity()
export class TrainingResult {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  userId: number

  @Column()
  exerciseId: number

  @Column()
  userRegex: string

  @Column()
  isCorrect: boolean

  @CreateDateColumn()
  timestamp: Date

  @ManyToOne(() => TrainingExercise)
  @JoinColumn({ name: 'exerciseId' })
  exercise: TrainingExercise
}
