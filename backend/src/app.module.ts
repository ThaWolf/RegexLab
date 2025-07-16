import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AppController } from './app.controller'
import { TrainingsModule } from './trainings/trainings.module'
import { UsersModule } from './users/users.module'
import { RegexModule } from './regex/regex.module'

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      autoLoadEntities: true,
      synchronize: true,
    }),
    TrainingsModule,
    UsersModule,
    RegexModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
