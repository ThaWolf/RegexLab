import { IsNumber, IsString, IsNotEmpty, IsEnum, IsOptional, Min, Max, MaxLength } from 'class-validator'
import { TrainingLevel } from '../training-level.enum'

export class ValidateRegexDto {
  @IsNumber()
  @Min(1)
  userId: number

  @IsNumber()
  @Min(1)
  id: number

  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  regex: string
}

export class GetProgressDto {
  @IsNumber()
  @Min(1)
  userId: number

  @IsEnum(TrainingLevel)
  @IsOptional()
  level?: TrainingLevel
}

export class GetStatsDto {
  @IsNumber()
  @Min(1)
  userId: number
}

export class GetRandomExerciseDto {
  @IsEnum(TrainingLevel)
  level: TrainingLevel
} 