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
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 5432,
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'password',
      database: process.env.DB_NAME || 'regexlab',
      autoLoadEntities: true,
      synchronize: true,
      logging: process.env.NODE_ENV === 'development',
    }),
    TrainingsModule,
    UsersModule,
    RegexModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
