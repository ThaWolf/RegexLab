import { IsString, IsOptional, IsNotEmpty, MaxLength } from 'class-validator'

export class ExplainRegexDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  pattern: string

  @IsString()
  @IsOptional()
  @MaxLength(10)
  flags?: string
}

export class TestRegexDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  pattern: string

  @IsString()
  @IsNotEmpty()
  @MaxLength(10000)
  text: string

  @IsString()
  @IsOptional()
  @MaxLength(10)
  flags?: string
}

export class GenerateRegexDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  description: string

  @IsString()
  @IsOptional()
  @MaxLength(1000)
  examples?: string

  @IsString()
  @IsOptional()
  @MaxLength(10)
  flags?: string
} 