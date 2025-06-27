import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { ResponseFormat } from 'src/response/response.interface';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'An unexpected error occurred';
    let errors: string | object | [] | null = null;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const responseMessage = exception.getResponse() as {
        message: string;
        errors?: string | object | [] | null;
      };

      message = responseMessage.message || message;
      errors = responseMessage.errors || null;
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    const result: ResponseFormat<any> = {
      message,
      errors,
      statusCode: status,
    };

    response.status(status).json(result);
  }
}
