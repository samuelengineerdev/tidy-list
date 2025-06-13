import { Body, Controller, Get, HttpStatus, Patch, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { JwtPayload } from 'src/auth/interfaces/jwt-payload.interface';
import { User } from 'src/auth/user.decorator';
import { ResponseService } from 'src/response/response.service';
import { CreateUserSettingsDto } from './dto/create-user-settings.dto';
import { UpdateUserSettingsDto } from './dto/update-user-settings.dto';
import { UserService } from './user.service';

@Controller('user')
@ApiBearerAuth('jwt')
@UseGuards(AuthGuard)
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly responseService: ResponseService
  ) { }

  @Post('user-settings')
  @UsePipes(new ValidationPipe())
  @ApiOperation({ summary: 'Crear configuracion de usuario', description: 'Este endpoint crea una nueva configuracion de usuario.' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Configuracion creada exitosamente.',
    schema: {
      example: {
        statusCode: HttpStatus.CREATED,
        message: 'Configuracion creada exitosamente',
        data: {
          id: 'string',
          darkMode: 'boolean',
          userId: 'string',
          createdAt: 'date',
          updatedAt: 'date',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Se ha producido un conflicto.',
    schema: {
      example: {
        message: 'string.',
        error: 'string',
        statusCode: HttpStatus.CONFLICT,
      },
    },
  })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Error interno del servidor.' })
  async createUserSettings(@Body() createUserSettingsDto: CreateUserSettingsDto, @User() user: JwtPayload) {
    return this.responseService.sendSuccess(
      await this.userService.createUserSettings({ ...createUserSettingsDto, userId: user.id })
    );
  }

  @Get('user-settings')
  @ApiOperation({ summary: 'Obtener la configuracion del usuario', description: 'Obtiene la configuracion del usuario logueado.' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Configuracion',
    schema: {
      example: {
        statusCode: HttpStatus.OK,
        message: 'configuraciones',
        data: {
          id: 'string',
          darkMode: 'boolean',
          userId: 'string',
          createdAt: 'date',
          updatedAt: 'date',
        },
      },
    },
  })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Error interno del servidor.' })
  async getUserSettings(@User() user: JwtPayload) {
    return this.responseService.sendSuccess(
      await this.userService.getUserSettings(user.id)
    );
  }

  @Patch('user-settings')
  @ApiOperation({ summary: 'Actualizar la configuracion del usuario', description: 'Actualiza la configuracion del usuario logueado.' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Configuracion actualizada',
    schema: {
      example: {
        statusCode: HttpStatus.OK,
        message: 'configuracion actualizada',
        data: [{
          id: 'string',
          darkMode: 'boolean',
          userId: 'string',
          createdAt: 'date',
          updatedAt: 'date',
        }],
      },
    },
  })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Error interno del servidor.' })
  async updateUserSettings(@User() user: JwtPayload, @Body() updateUserSettingsDto: UpdateUserSettingsDto) {
    return this.responseService.sendSuccess(
      await this.userService.updateUserSettings({ ...updateUserSettingsDto, userId: user.id })
    );
  }
}
