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
  @ApiOperation({ summary: 'Create task', description: 'This endpoint creates a new task for a user.' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Task created successfully.',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number' },
        message: { type: 'string' },
        data: {
          type: 'object',
          properties: {
            id: { type: 'number' },
            name: { type: 'string' },
            description: { type: 'string' },
            dueDate: { type: 'string', format: 'date-time' },
            userId: { type: 'number' },
            categoryId: { type: 'number' },
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
      'Task created successfully.',
      HttpStatus.CREATED
    );
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all tasks', description: 'Retrieves all tasks.' })

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Tasks.',
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
              id: { type: 'number' },
              name: { type: 'string' },
              description: { type: 'string' },
              completed: { type: 'boolean' },
              dueDate: { type: 'string', format: 'date-time' },
              createdAt: { type: 'string', format: 'date-time' },
              updatedAt: { type: 'string', format: 'date-time' },
              userId: { type: 'number' },
              categoryId: { type: 'number' },
            }
          }
        }
      },
    },
  })
  @ApiDefaultResponses()
  async findAll(@User() user: JwtPayload) {
    return this.responseService.sendSuccess(
      await this.taskService.findAll(user.id),
      'Tasks'
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get task by id', description: 'Retrieves a task by its id.' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Task retrieved.',
    schema: {
      properties: {
        statusCode: { type: 'number' },
        message: { type: 'string' },
        data: {
          type: 'object',
          properties: {
            id: { type: 'number' },
            name: { type: 'string' },
            description: { type: 'string' },
            dueDate: { type: 'string', format: 'date-time' },
            userId: { type: 'number' },
            categoryId: { type: 'number' },
            completed: { type: 'boolean' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        }
      },
    },
  })
  @ApiDefaultResponses({ includeNotFound: true })
  async findOne(@Param('id') id: number) {
    return this.responseService.sendSuccess(
      await this.taskService.findOne(id),
      'Task retrieved.'
    );
  }

  @Get('by-category/:categoryId')
 @ApiOperation({ summary: 'Get tasks by category', description: 'Retrieves tasks by their categoryId' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Tasks retrieved.',
    schema: {
      properties: {
        statusCode: { type: 'number' },
        message: { type: 'string' },
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'number' },
              name: { type: 'string' },
              description: { type: 'string' },
              dueDate: { type: 'string', format: 'date-time' },
              userId: { type: 'number' },
              categoryId: { type: 'number' },
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
  async findByCategory(@Param('categoryId') categoryId: number) {
    return this.responseService.sendSuccess(
      await this.taskService.findByCategory(categoryId),
      'Tasks retrieved.'
    );
  }

  @Patch()
  @ApiOperation({ summary: 'Update task', description: 'Updates a task' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Task updated.',
    schema: {
      properties: {
        statusCode: { type: 'number' },
        message: { type: 'string' },
        data: {
          type: 'object',
          properties: {
            id: { type: 'number' },
            name: { type: 'string' },
            description: { type: 'string' },
            dueDate: { type: 'string', format: 'date-time' },
            userId: { type: 'number' },
            categoryId: { type: 'number' },
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
      await this.taskService.update({ ...updateTaskDto, userId: user.id }),
      'Task updated successfully.'
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete task', description: 'Deletes a task by its id' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Task deleted.',
    schema: {
      properties: {
        statusCode: { type: 'number' },
        message: { type: 'string' },
        data: {
          type: 'object',
          properties: {
            id: { type: 'number' },
            name: { type: 'string' },
            description: { type: 'string' },
            dueDate: { type: 'string', format: 'date-time' },
            userId: { type: 'number' },
            categoryId: { type: 'number' },
            completed: { type: 'boolean' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        }
      },
    },
  })
  @ApiDefaultResponses({ includeNotFound: true })
  async remove(@Param('id') id: number) {
    return this.responseService.sendSuccess(
      await this.taskService.remove(id),
      'Task deleted successfully.'
    );
  }
}
