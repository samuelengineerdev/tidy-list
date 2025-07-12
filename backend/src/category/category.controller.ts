import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { JwtPayload } from 'src/auth/interfaces/jwt-payload.interface';
import { User } from 'src/auth/user.decorator';
import { ResponseService } from 'src/response/response.service';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ApiDefaultResponses } from 'src/common/decorators/swagger-default-responses.decorator';

@Controller('category')
@ApiBearerAuth('jwt')
@UseGuards(AuthGuard)
export class CategoryController {
  constructor(
    private readonly categoryService: CategoryService,
    private readonly responseService: ResponseService
  ) { }

  @Post()
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create category', description: 'This endpoint creates a new category for tasks.' })
  @ApiBody({
    description: 'New category data',
    schema: {
      example: {
        name: 'string',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Category created successfully.',
    schema: {
      properties: {
        statusCode: { type: 'number' },
        message: { type: 'string' },
        data: {
          type: 'object', properties: {
            id: { type: 'number' },
            name: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
            userId: { type: 'number' },
          },
        }
      },
    },
  })

  @ApiDefaultResponses({ includeConflict: true })
  async create(@Body() createCategoryDto: CreateCategoryDto, @User() user: JwtPayload) {
    return this.responseService.sendSuccess(
      await this.categoryService.create({ ...createCategoryDto, userId: user.id }),
      'Category created successfully.',
      HttpStatus.CREATED
    );
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all categories', description: 'Retrieves all categories.' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Categories.',
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
              createdAt: { type: 'string', format: 'date-time' },
              updatedAt: { type: 'string', format: 'date-time' },
              userId: { type: 'number' },
            },
          },
        },
      },
    },
  })

  @ApiDefaultResponses()
  async findAll(@User() user: JwtPayload) {
    return this.responseService.sendSuccess(
      await this.categoryService.findAll(user.id),
      'Categories'
    );
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get category by id', description: 'Retrieves a category by its id.' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Category.',
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
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
            userId: { type: 'number' },
          },
        },
      },
    },
  })

  @ApiDefaultResponses({ includeNotFound: true })
  async findOne(@User() user: JwtPayload, @Param('id') id: number) {
    return this.responseService.sendSuccess(
      await this.categoryService.findOne(user.id, id),
      'Category retrieved.'
    );
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update category', description: 'Updates a category by its id' })
  @ApiBody({
    description: 'Category data',
    schema: {
      example: {
        name: 'string',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Category.',
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
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
            userId: { type: 'number' },
          },
        },
      },
    },
  })

  @ApiDefaultResponses({ includeNotFound: true })
  async update(@Param('id') id: number, @User() user: JwtPayload, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.responseService.sendSuccess(
      await this.categoryService.update(user.id, id, { ...updateCategoryDto, userId: user.id }),
      'Category updated successfully.'
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete category', description: 'Deletes a category by its id and the tasks related to this category' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Category deleted.',
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
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
            userId: { type: 'number' },
          },
        },
      },
    },
  })
  @ApiDefaultResponses({ includeNotFound: true })
  async remove(@User() user: JwtPayload, @Param('id') id: number) {
    return this.responseService.sendSuccess(
      await this.categoryService.remove(user.id, id),
      'Category deleted successfully.'
    );
  }
}
