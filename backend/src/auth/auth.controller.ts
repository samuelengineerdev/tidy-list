import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';
import { ResponseService } from 'src/response/response.service';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login-auth-dto';
import { RegisterDto } from './dto/register-dto-dto';
import { ResponseUserDto } from 'src/user/dto/response-user-dto';
import { ResponseFormat } from 'src/response/response.interface';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly responseService: ResponseService,
  ) { }

  @Post('register')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register user', description: 'This endpoint creates a new user in the system.' })
  @ApiBody({
    description: 'New user data',
    schema: {
      properties: {
        email: { type: 'string' },
        password: { type: 'string' },
        confirmPassword: { type: 'string' }
      }
    },
  })
  @ApiResponse({
    status: 201,
    description: 'User created successfully.',
    schema: {
      properties: {
        statusCode: { type: 'number' },
        message: { type: 'string' },
        data: {
          type: 'object',
          properties: {
            id: { type: 'number' },
            email: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
      },
    },
  })

  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid data or validation error.',
    schema: {
      properties: {
        message: { type: 'array', items: { type: 'string' } },
        error: { type: 'string', nullable: true },
        statusCode: { type: 'number' }
      }
    }
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'A conflict has occurred.',
    schema: {
      properties: {
        message: { type: 'string' },
        error: { type: 'string', nullable: true },
        statusCode: { type: 'number' },
      }
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error.', schema: {
      properties: {
        message: { type: 'string' },
        error: { type: 'string', nullable: true },
        statusCode: { type: 'number' },
      }
    },
  })
  async register(@Body() registerDto: RegisterDto): Promise<ResponseFormat<ResponseUserDto>> {
    return this.responseService.sendSuccess(
      await this.authService.register(registerDto),
      'User registered successfully.',
      HttpStatus.CREATED,
    );
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe())
  @ApiOperation({
    summary: 'Log in',
    description: 'Allows a user to authenticate using email and password.',
  })
  @ApiBody({
    description: 'User credentials.',
    schema: {
      example: {
        email: 'example@mail.com',
        password: '123456',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Login successful.',
    schema: {
      properties: {
        statusCode: { type: 'number' },
        message: { type: 'string' },
        data: {
          type: 'object',
          properties: {
            user: {
              type: 'object',
              properties: {
                id: { type: 'number' },
                email: { type: 'string' },
                createdAt: { type: 'string', format: 'date-time' },
                updatedAt: { type: 'string', format: 'date-time' },
              }
            },
            token: { type: 'string' }
          }
        }
      }
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid data or validation error.',
    schema: {
      properties: {
        message: { type: 'array', items: { type: 'string' } },
        errors: { type: 'string' },
        statusCode: { type: 'number' }
      }
    }
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Invalid credentials.',
    schema: {
      properties: {
        message: { type: 'string' },
        errors: { type: 'string' },
        statusCode: { type: 'number' }
      }
    }
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error.',
    schema: {
      properties: {
        message: { type: 'string' },
        error: { type: 'string', nullable: true },
        statusCode: { type: 'number' },
      }
    },
  })
  async login(@Body() loginDto: LoginDto) {
    return this.responseService.sendSuccess(
      await this.authService.login(loginDto),
      'User logged in successfully!',
      HttpStatus.OK
    );
  }

  @Get('profile')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('jwt')
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: 'Get user profile',
    description: 'Returns the authenticated user’s data.',
  })
  @ApiResponse({
    status: 200,
    description: 'User profile.',
    schema: {
      properties: {
        statusCode: { type: 'number' },
        message: { type: 'string' },
        data: {
          type: 'object',
          properties: {
            id: { type: 'number' },
            email: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
            iat: { type: 'number' }
          }
        }
      }
    },
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'No authorized.',
    schema: {
      properties: {
        message: { type: 'string' },
        errors: { type: 'string' },
        statusCode: { type: 'number' }
      }
    }
  })
  getProfile(@Req() req: Request) {
    return this.responseService.sendSuccess(
      req.user,
      'User profile'
    );
  }
}
