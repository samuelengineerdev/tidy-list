import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtPayload } from 'src/auth/interfaces/jwt-payload.interface';
import { User } from 'src/auth/user.decorator';
import { ResponseService } from 'src/response/response.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskService } from './task.service';
import { AuthGuard } from 'src/auth/auth.guard';

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
      example: {
        statusCode: HttpStatus.CREATED,
        message: 'Tarea creada exitosamente',
        data: {
          id: 'string',
          name: 'string',
          description: 'string',
          dueDate: 'date',
          userId: 'string',
          categoryId: 'string',
          completed: 'boolean',
          createdAt: 'date',
          updatedAt: 'date',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Ya has creado esta tarea.',
    schema: {
      example: {
        message: 'Ya has creado esta tarea.',
        error: 'Conflict',
        statusCode: HttpStatus.CONFLICT,
      },
    },
  })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Error interno del servidor.' })
  async create(@Body() createTaskDto: CreateTaskDto, @User() user: JwtPayload) {
    return this.responseService.sendSuccess(
      await this.taskService.create({ ...createTaskDto, userId: user.id })
    );
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Obtener todas las tareas', description: 'Obtiene todas las categorias por el usuario logueado.' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Tareas.',
    schema: {
      example: {
        statusCode: HttpStatus.OK,
        message: 'Tareas',
        data: [{
          id: 'string',
          name: 'string',
          description: 'string',
          dueDate: 'date',
          userId: 'string',
          categoryId: 'string',
          completed: 'boolean',
          createdAt: 'date',
          updatedAt: 'date',
        }],
      },
    },
  })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Error interno del servidor.' })
  async findAll(@User() user: JwtPayload) {
    return this.responseService.sendSuccess(
      await this.taskService.findAll(user.id)
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener tarea por id', description: 'Obtiene una tarea por su id.' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Tareas.',
    schema: {
      example: {
        statusCode: HttpStatus.OK,
        message: 'Tareas',
        data: {
          id: 'string',
          name: 'string',
          description: 'string',
          dueDate: 'date',
          userId: 'string',
          categoryId: 'string',
          completed: 'boolean',
          createdAt: 'date',
          updatedAt: 'date',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Categoria.',
    schema: {
      example: {
        statusCode: HttpStatus.NOT_FOUND,
        errors: "string",
        message: 'No se encontro esta tarea por el id: string',

      },
    },
  })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Error interno del servidor.' })
  async findOne(@Param('id') id: string) {
    return this.responseService.sendSuccess(
      await this.taskService.findOne(id)
    );
  }

  @Get('by-category/:categoryId')
  @ApiOperation({ summary: 'Obtener las tareas por categoria', description: 'Obtiene las tareas por la categoria' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Tareas.',
    schema: {
      example: {
        statusCode: HttpStatus.OK,
        message: 'Tareas',
        data: [{
          id: 'string',
          name: 'string',
          description: 'string',
          dueDate: 'date',
          userId: 'string',
          categoryId: 'string',
          completed: 'boolean',
          createdAt: 'date',
          updatedAt: 'date',
        }],
      },
    },
  })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Error interno del servidor.' })
  async findByCategory(@Param('id') id: string) {
    return this.responseService.sendSuccess(
      await this.taskService.findByCategory(id)
    );
  }

  @Patch()
  @ApiOperation({ summary: 'Actualizar tarea', description: 'Actualiza una tarea por su id' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Categorias.',
    schema: {
      example: {
        statusCode: HttpStatus.OK,
        message: 'Tarea actualizada correctamente',
        data: {
          id: 'string',
          name: 'string',
          description: 'string',
          dueDate: 'date',
          userId: 'string',
          categoryId: 'string',
          completed: 'boolean',
          createdAt: 'date',
          updatedAt: 'date',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Tarea.',
    schema: {
      example: {
        statusCode: HttpStatus.NOT_FOUND,
        errors: "string",
        message: 'No se encontro esta tarea por el id: string',

      },
    },
  })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Error interno del servidor.' })
  async update(@Body() updateTaskDto: UpdateTaskDto, @User() user: JwtPayload) {
    return this.responseService.sendSuccess(
      await this.taskService.update({ ...updateTaskDto, userId: user.id })
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar tarea', description: 'Elimina una tarea por su id' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Eliminar tarea.',
    schema: {
      example: {
        statusCode: HttpStatus.OK,
        message: 'Categoria eliminada correctamente',
        data: null,
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Categoria.',
    schema: {
      example: {
        statusCode: HttpStatus.NOT_FOUND,
        errors: "string",
        message: 'No se encontro esta tarea por el id: string',

      },
    },
  })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Error interno del servidor.' })
  async remove(@Param('id') id: string) {
    return this.responseService.sendSuccess(
      await this.taskService.remove(id)
    );
  }
}
