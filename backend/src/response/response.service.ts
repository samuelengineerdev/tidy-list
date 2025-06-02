import { Injectable } from '@nestjs/common';
import { ResponseFormat } from './response.interface';

@Injectable()
export class ResponseService {
  sendSuccess<T>(
    data: T,
    message: string = 'Operación exitosa',
    statusCode: number = 200,
  ): ResponseFormat<T> {
    return {
      statusCode,
      message,
      data,
    };
  }

  sendError(
    message: string,
    statusCode: number = 500,
    errors: string | [] | null = null,
  ): ResponseFormat<any> {
    return {
      statusCode,
      message,
      errors,
    };
  }
}
