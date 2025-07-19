import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { HttpExceptionFilter } from './common/filters/http-exception.filter'
import { ValidationPipe } from './common/pipes/validation.pipe'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  
  // Enable CORS for all origins (development)
  app.enableCors({
    origin: true, // Allow all origins
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  })
  
  // Global exception filter
  app.useGlobalFilters(new HttpExceptionFilter())
  
  // Global validation pipe
  app.useGlobalPipes(new ValidationPipe())
  
  app.setGlobalPrefix('api')
  const port = process.env.PORT || 3001
  await app.listen(port)
}
bootstrap()
