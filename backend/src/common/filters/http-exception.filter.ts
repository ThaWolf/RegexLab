import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common'
import { Request, Response } from 'express'

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name)

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest<Request>()

    let status = HttpStatus.INTERNAL_SERVER_ERROR
    let message = 'Internal server error'
    let error = 'Internal Server Error'

    if (exception instanceof HttpException) {
      status = exception.getStatus()
      const exceptionResponse = exception.getResponse()
      
      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse
        error = exceptionResponse
      } else if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        const responseObj = exceptionResponse as any
        message = responseObj.message || exception.message
        error = responseObj.error || exception.message
      }
    } else if (exception instanceof Error) {
      message = exception.message
      error = exception.name
      
      // Handle specific error types
      if (exception.message.includes('regex') || exception.message.includes('pattern')) {
        status = HttpStatus.BAD_REQUEST
        error = 'Invalid Regex Pattern'
      } else if (exception.message.includes('not found')) {
        status = HttpStatus.NOT_FOUND
        error = 'Not Found'
      } else if (exception.message.includes('validation')) {
        status = HttpStatus.BAD_REQUEST
        error = 'Validation Error'
      }
    }

    // Log the error
    this.logger.error(
      `${request.method} ${request.url} - ${status} - ${message}`,
      exception instanceof Error ? exception.stack : 'Unknown error',
    )

    // Create error response
    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      error,
      message,
      ...(process.env.NODE_ENV === 'development' && {
        stack: exception instanceof Error ? exception.stack : undefined,
      }),
    }

    response.status(status).json(errorResponse)
  }
} 