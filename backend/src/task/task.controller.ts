import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { JwtPayload } from 'src/auth/interfaces/jwt-payload.interface';
import { User } from 'src/auth/user.decorator';
import { ResponseService } from 'src/response/response.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskService } from './task.service';
import { ApiDefaultResponses } from '../common/decorators/swagger-default-responses.decorator'

@Controller('task')
@ApiBearerAuth('jwt')
@UseGuards(AuthGuard)
export class TaskController {
  constructor(
    private readonly taskService: TaskService,
    private readonly responseService: ResponseService
  ) { }

  @Post()
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear tarea', description: 'Este endpoint crea una nueva tarea por usuario.' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Tarea creada exitosamente.',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number' },
        message: { type: 'string' },
        data: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            description: { type: 'string' },
            dueDate: { type: 'string', format: 'date-time' },
            userId: { type: 'string' },
            categoryId: { type: 'string' },
            completed: { type: 'boolean' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        }
      },
    },
  })
  @ApiDefaultResponses({ includeConflict: true, includeNotFound: true })
  async create(@Body() createTaskDto: CreateTaskDto, @User() user: JwtPayload) {
    return this.responseService.sendSuccess(
      await this.taskService.create({ ...createTaskDto, userId: user.id }),
      'Tarea creada exitosamente',
      HttpStatus.CREATED
    );
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Obtener todas las tareas', description: 'Obtiene todas las tareas.' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Tareas.',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number' },
        message: { type: 'string' },
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              name: { type: 'string' },
              description: { type: 'string' },
              completed: { type: 'boolean' },
              dueDate: { type: 'string', format: 'date-time' },
              createdAt: { type: 'string', format: 'date-time' },
              updatedAt: { type: 'string', format: 'date-time' },
              userId: { type: 'string' },
              categoryId: { type: 'string' },
            }
          }
        }
      },
    },
  })
  @ApiDefaultResponses()
  async findAll(@User() user: JwtPayload) {
    return this.responseService.sendSuccess(
      await this.taskService.findAll(user.id)
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener tarea por id', description: 'Obtiene una tarea por su id.' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Tarea obtenida.',
    schema: {
      properties: {
        statusCode: { type: 'number' },
        message: { type: 'string' },
        data: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            description: { type: 'string' },
            dueDate: { type: 'string', format: 'date-time' },
            userId: { type: 'string' },
            categoryId: { type: 'string' },
            completed: { type: 'boolean' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        }
      },
    },
  })
  @ApiDefaultResponses({ includeNotFound: true })
  async findOne(@Param('id') id: string) {
    return this.responseService.sendSuccess(
      await this.taskService.findOne(id)
    );
  }

  @Get('by-category/:categoryId')
  @ApiOperation({ summary: 'Obtener tareas por categoria', description: 'Obtiene las tarea por su categoryId' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Tareas obtenidas.',
    schema: {
      properties: {
        statusCode: { type: 'number' },
        message: { type: 'string' },
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              name: { type: 'string' },
              description: { type: 'string' },
              dueDate: { type: 'string', format: 'date-time' },
              userId: { type: 'string' },
              categoryId: { type: 'string' },
              completed: { type: 'boolean' },
              createdAt: { type: 'string', format: 'date-time' },
              updatedAt: { type: 'string', format: 'date-time' },
            },
          }
        }
      },
    },
  })
  @ApiDefaultResponses()
  async findByCategory(@Param('categoryId') categoryId: string) {
    return this.responseService.sendSuccess(
      await this.taskService.findByCategory(categoryId)
    );
  }

  @Patch()
  @ApiOperation({ summary: 'Actualizar tarea', description: 'Actualiza una tarea' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Tarea actualizada.',
    schema: {
      properties: {
        statusCode: { type: 'number' },
        message: { type: 'string' },
        data: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            description: { type: 'string' },
            dueDate: { type: 'string', format: 'date-time' },
            userId: { type: 'string' },
            categoryId: { type: 'string' },
            completed: { type: 'boolean' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          }
        },
      },
    },
  })
  @ApiDefaultResponses({ includeNotFound: true })
  async update(@Body() updateTaskDto: UpdateTaskDto, @User() user: JwtPayload) {
    return this.responseService.sendSuccess(
      await this.taskService.update({ ...updateTaskDto, userId: user.id })
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar tarea', description: 'Elimina una tarea por su id' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Tarea eliminada.',
    schema: {
      properties: {
        statusCode: { type: 'number' },
        message: { type: 'string' },
        data: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            description: { type: 'string' },
            dueDate: { type: 'string', format: 'date-time' },
            userId: { type: 'string' },
            categoryId: { type: 'string' },
            completed: { type: 'boolean' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        }
      },
    },
  })
  @ApiDefaultResponses({ includeNotFound: true })
  async remove(@Param('id') id: string) {
    return this.responseService.sendSuccess(
      await this.taskService.remove(id)
    );
  }
}
