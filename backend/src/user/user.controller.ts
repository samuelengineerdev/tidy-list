import { Body, Controller, Get, HttpStatus, Patch, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { JwtPayload } from 'src/auth/interfaces/jwt-payload.interface';
import { User } from 'src/auth/user.decorator';
import { ApiDefaultResponses } from 'src/common/decorators/swagger-default-responses.decorator';
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

  @Get('user-settings')
  @ApiOperation({ summary: 'Obtener la configuracion del usuario', description: 'Obtiene la configuracion del usuario.' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Configuracion obtenida.',
    schema: {
      properties: {
        statusCode: { type: 'number' },
        message: { type: 'string' },
        data: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            darkMode: { type: 'boolean' },
            userId: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        }
      },
    },
  })
  @ApiDefaultResponses({ includeNotFound: true })
  async getUserSettings(@User() user: JwtPayload) {
    return this.responseService.sendSuccess(
      await this.userService.getUserSettings(user.id)
    );
  }

  @Patch('user-settings')
  @ApiOperation({ summary: 'Crear o actualizar la configuracion del usuario', description: 'Crea o actualiza la configuracion del usuario.' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Configuracion creada o actualizada.',
    schema: {
      properties: {
        statusCode: { type: 'number' },
        message: { type: 'string' },
        data: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            darkMode: { type: 'boolean' },
            userId: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        }
      },
    },
  })
  @ApiDefaultResponses()
  async updateUserSettings(@User() user: JwtPayload, @Body() updateUserSettingsDto: UpdateUserSettingsDto) {
    return this.responseService.sendSuccess(
      await this.userService.updateUserSettings({ ...updateUserSettingsDto, userId: user.id })
    );
  }
}
