import { Body, Controller, Get, HttpStatus, Patch, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { JwtPayload } from 'src/auth/interfaces/jwt-payload.interface';
import { User } from 'src/auth/user.decorator';
import { ApiDefaultResponses } from 'src/common/decorators/swagger-default-responses.decorator';
import { ResponseService } from 'src/response/response.service';
import { UpdateUserSettingsDto } from './dto/update-user-settings.dto';
import { UserService } from './user.service';

@Controller('user')
@ApiBearerAuth('jwt')
@UseGuards(AuthGuard)
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly responseService: ResponseService
  ) {}

  @Get('user-settings')
  @ApiOperation({ summary: 'Get user settings', description: 'Retrieves the user settings.' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Settings retrieved.',
    schema: {
      properties: {
        statusCode: { type: 'number' },
        message: { type: 'string' },
        data: {
          type: 'object',
          properties: {
            id: { type: 'number' },
            darkMode: { type: 'boolean' },
            userId: { type: 'number' },
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
      await this.userService.getUserSettings(user.id),
      'Settings retrieved.'
    );
  }

  @Patch('user-settings')
  @ApiOperation({ summary: 'Create or update user settings', description: 'Creates or updates the user settings.' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Settings created or updated.',
    schema: {
      properties: {
        statusCode: { type: 'number' },
        message: { type: 'string' },
        data: {
          type: 'object',
          properties: {
            id: { type: 'number' },
            darkMode: { type: 'boolean' },
            userId: { type: 'number' },
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
      await this.userService.updateUserSettings({ ...updateUserSettingsDto, userId: user.id }),
      'Settings created or updated.'
    );
  }
}
