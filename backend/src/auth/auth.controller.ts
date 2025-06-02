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
      example: {
        email: 'string',
        password: 'string',
        confirmPassword: 'string',
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Usuario creado exitosamente.',
    schema: {
      example: {
        statusCode: 201,
        message: 'Usuario registrado exitosamente',
        data: {
          id: 'string',
          email: 'string',
          createdAt: 'string',
          updatedAt: 'string',
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
        error: { type: 'string', example: 'Bad Request' },
        statusCode: { type: 'number', example: HttpStatus.BAD_REQUEST }
      }
    }
  })
  @ApiResponse({
    status: 409,
    description: 'El email ya está en uso.',
    schema: {
      example: {
        message: 'Este email ya esta en uso',
        error: 'Conflict',
        statusCode: 409,
      },
    },
  })
  @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
  async register(@Body() registerDto: RegisterDto) {
    return this.responseService.sendSuccess(
      await this.authService.register(registerDto),
      'Usuario registrado exitosamente',
      HttpStatus.CREATED,
    );
  }

  @Post('login')
  @UsePipes(new ValidationPipe())
  @ApiOperation({
    summary: 'Iniciar sesión',
    description: 'Permite a un usuario autenticarse con email y contraseña.',
  })
  @ApiBody({
    description: 'Credenciales del usuario',
    schema: {
      example: {
        email: 'string',
        password: 'string',
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Inicio de sesión exitoso.',
    schema: {
      example: {
        statusCode: 200,
        message: 'Operación exitosa',
        data: {
          user: {
            id: 'string',
            email: 'string',
            createdAt: 'string',
            updatedAt: 'string',
          },
          token: 'string',
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
        error: { type: 'string', example: 'Bad Request' },
        statusCode: { type: 'number', example: HttpStatus.BAD_REQUEST }
      }
    }
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Credenciales inválidas.',
    schema: {
      example: {
        "message": "Credenciales inválidas",
        "errors": null,
        "statusCode": HttpStatus.UNAUTHORIZED,
      }
    }
  })
  @ApiResponse({
    status: 500,
    description: 'Error interno del servidor.',
  })
  async login(@Body() loginDto: LoginDto) {
    return this.responseService.sendSuccess(
      await this.authService.login(loginDto),
    );
  }

  @Get('profile')
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
      example: {
        statusCode: 200,
        message: 'Perfil del usuario',
        data: {
          id: 'string',
          email: 'string',
          createdAt: 'string',
          updatedAt: 'string',
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Token inválido o no proporcionado.',
    schema: {
      example: {
        statusCode: 401,
        message: 'Sesión expirada',
        error: 'Unauthorized'
      }
    }
  })
  async getProfile(@Req() req: Request) {
    return this.responseService.sendSuccess(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      await req.user,
    );
  }
}
