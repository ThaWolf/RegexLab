import { Controller, Get, Post, Query, Body } from '@nestjs/common'
import { TrainingsService } from './trainings.service'
import { TrainingLevel } from './training-level.enum'

@Controller('trainings')
export class TrainingsController {
  constructor(private readonly service: TrainingsService) {}

  @Get('random')
  async random(@Query('level') level: TrainingLevel) {
    return this.service.randomByLevel(level)
  }

  @Post('validate')
  async validate(
    @Body('userId') userId: number,
    @Body('id') id: number,
    @Body('regex') regex: string,
  ) {
    const valid = await this.service.validateRegex(userId, id, regex)
    return { valid }
  }
}
