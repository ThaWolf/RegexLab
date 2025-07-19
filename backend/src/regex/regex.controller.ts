import { Controller, Post, Get, Body, Query, HttpException, HttpStatus } from '@nestjs/common'
import { RegexService, RegexGenerationRequest } from './regex.service'
import { ExplainRegexDto, TestRegexDto, GenerateRegexDto } from './dto/regex.dto'

@Controller('regex')
export class RegexController {
  constructor(private readonly regexService: RegexService) {}

  @Post('explain')
  async explainRegex(@Body() dto: ExplainRegexDto) {
    try {
      return await this.regexService.explainRegex(dto.pattern, dto.flags || '')
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to explain regex pattern',
        HttpStatus.BAD_REQUEST
      )
    }
  }

  @Post('generate')
  async generateRegex(@Body() dto: GenerateRegexDto) {
    try {
      const request: RegexGenerationRequest = {
        description: dto.description,
        examples: dto.examples ? dto.examples.split(',').map(e => e.trim()) : undefined,
        flags: dto.flags
      }
      const pattern = await this.regexService.generateRegex(request)
      return { pattern }
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to generate regex pattern',
        HttpStatus.BAD_REQUEST
      )
    }
  }

  @Post('test')
  async testRegex(@Body() dto: TestRegexDto) {
    try {
      return await this.regexService.testRegex(dto.pattern, dto.text, dto.flags || '')
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to test regex pattern',
        HttpStatus.BAD_REQUEST
      )
    }
  }

  @Get('health')
  async getHealth() {
    return {
      status: 'ok',
      module: 'regex',
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    }
  }

  @Get('patterns')
  async getCommonPatterns() {
    return {
      patterns: [
        {
          name: 'Email',
          pattern: '^[\\w.-]+@[\\w.-]+\\.[A-Za-z]{2,}$',
          description: 'Validates email addresses'
        },
        {
          name: 'Phone Number',
          pattern: '^\\+?[1-9]\\d{1,14}$',
          description: 'Validates international phone numbers'
        },
        {
          name: 'Date (DD/MM/YYYY)',
          pattern: '^(0[1-9]|[12][0-9]|3[01])/(0[1-9]|1[0-2])/\\d{4}$',
          description: 'Validates dates in DD/MM/YYYY format'
        },
        {
          name: 'URL',
          pattern: '^https?://[\\w.-]+\\.[A-Za-z]{2,}(/\\S*)?$',
          description: 'Validates URLs'
        },
        {
          name: 'Credit Card',
          pattern: '^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|6(?:011|5[0-9]{2})[0-9]{12}|(?:2131|1800|35\\d{3})\\d{11})$',
          description: 'Validates major credit card numbers'
        }
      ]
    }
  }
} 