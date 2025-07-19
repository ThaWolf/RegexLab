import { Controller, Get, Post, Query, Body, HttpException, HttpStatus, Param, ParseIntPipe } from '@nestjs/common'
import { TrainingsService, ValidationResult, UserProgress, DetailedUserStats } from './trainings.service'
import { TrainingLevel } from './training-level.enum'
import { ValidateRegexDto, GetProgressDto, GetStatsDto, GetRandomExerciseDto } from './dto/training.dto'

@Controller('trainings')
export class TrainingsController {
  constructor(private readonly service: TrainingsService) {}

  @Get('random')
  async random(@Query('level') level: TrainingLevel): Promise<any> {
    try {
      const exercise = await this.service.randomByLevel(level)
      if (!exercise) {
        throw new HttpException(
          `No exercises found for level: ${level}`,
          HttpStatus.NOT_FOUND
        )
      }
      return exercise
    } catch (error) {
      if (error instanceof HttpException) {
        throw error
      }
      throw new HttpException(
        'Failed to fetch random exercise',
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }

  @Post('validate')
  async validate(@Body() dto: ValidateRegexDto): Promise<ValidationResult> {
    try {
      return await this.service.validateRegex(dto.userId, dto.id, dto.regex)
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to validate regex',
        HttpStatus.BAD_REQUEST
      )
    }
  }

  @Get('progress')
  async getProgress(
    @Query('userId', ParseIntPipe) userId: number,
    @Query('level') level?: TrainingLevel,
  ): Promise<UserProgress> {
    try {
      return await this.service.getUserProgress(userId, level)
    } catch (error) {
      throw new HttpException(
        'Failed to fetch user progress',
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }

  @Get('stats')
  async getStats(@Query('userId', ParseIntPipe) userId: number): Promise<DetailedUserStats> {
    try {
      return await this.service.getDetailedUserStats(userId)
    } catch (error) {
      throw new HttpException(
        'Failed to fetch user statistics',
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }
}
