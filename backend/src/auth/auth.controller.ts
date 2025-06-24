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

@ApiTags('Auth') // Agrupa los endpoints en Swagger bajo "Auth"
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly responseService: ResponseService,
  ) { }

  @Post('register')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Registrar usuario', description: 'Este endpoint crea un nuevo usuario en el sistema.' })
  @ApiBody({
    description: 'Datos del nuevo usuario',
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
    description: 'Usuario creado exitosamente.',
    schema: {
      properties: {
        statusCode: { type: 'number' },
        message: { type: 'string' },
        data: {
          type: 'object',
          properties: {
            id: { type: 'string' },
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
    description: 'Datos inválidos o error de validación.',
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
    description: 'Ha ocurrido un conflicto.',
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
    description: 'Error interno del servidor.', schema: {
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
      'Usuario registrado exitosamente',
      HttpStatus.CREATED,
    );
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe())
  @ApiOperation({
    summary: 'Iniciar sesión',
    description: 'Permite a un usuario autenticarse con email y contraseña.',
  })
  @ApiBody({
    description: 'Credenciales del usuario',
    schema: {
      example: {
        email: 'example@mail.com',
        password: '123456',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Inicio de sesión exitoso.',
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
                id: { type: 'string' },
                email: { type: 'string' },
                createdAt: { type: 'string' },
                updatedAt: { type: 'string' }
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
    description: 'Datos inválidos o error de validación.',
    schema: {
      properties: {
        message: { type: 'array', items: { type: 'string' } },
        error: { type: 'string' },
        statusCode: { type: 'number' }
      }
    }
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Credenciales inválidas.',
    schema: {
      properties: {
        message: { type: 'string' },
        error: { type: 'string' },
        statusCode: { type: 'number' }
      }
    }
  })
  @ApiResponse({
    status: 500,
    description: 'Error interno del servidor.',
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
      'Usurio logueado exitosamente!',
      HttpStatus.OK
    );
  }

  @Get('profile')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('jwt')
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: 'Obtener perfil del usuario',
    description: 'Retorna los datos del usuario autenticado.',
  })
  @ApiResponse({
    status: 200,
    description: 'Perfil del usuario.',
    schema: {
      properties: {
        statusCode: { type: 'number' },
        message: { type: 'string' },
        data: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            email: { type: 'string' },
            createdAt: { type: 'string' },
            updatedAt: { type: 'string' },
            iat: { type: 'number' }
          }
        }
      }
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Token inválido o no proporcionado.',
    schema: {
      properties: {
        message: { type: 'string' },
        error: { type: 'string' },
        statusCode: { type: 'number' }
      }
    }
  })
  getProfile(@Req() req: Request) {
    return this.responseService.sendSuccess(
      req.user,
    );
  }
}
