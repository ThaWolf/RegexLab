import { Module } from '@nestjs/common'
import { RegexService } from './regex.service'
import { RegexController } from './regex.controller'

@Module({
  providers: [RegexService],
  controllers: [RegexController],
  exports: [RegexService]
})
export class RegexModule {} 