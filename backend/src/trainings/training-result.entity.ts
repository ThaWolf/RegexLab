import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm'

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
}
