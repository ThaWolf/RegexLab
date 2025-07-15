import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'
import { TrainingLevel } from './training-level.enum'

@Entity()
export class TrainingExercise {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'enum', enum: TrainingLevel })
  level: TrainingLevel

  @Column()
  inputString: string

  @Column()
  expectedRegex: string

  @Column()
  description: string
}
