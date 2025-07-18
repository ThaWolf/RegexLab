import { Controller, Get, Param } from '@nestjs/common'
import { UsersService } from './users.service'

@Controller('users')
export class UsersController {
  constructor(private readonly service: UsersService) {}

  @Get(':id/stats')
  async stats(@Param('id') id: number) {
    return this.service.getStats(id)
  }
}
