import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { JwtPayload } from 'src/auth/interfaces/jwt-payload.interface';
import { User } from 'src/auth/user.decorator';
import { ResponseService } from 'src/response/response.service';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

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
  @ApiOperation({ summary: 'Crear categoria', description: 'Este endpoint crea una nueva categoria para las tareas.' })
  @ApiBody({
    description: 'Datos de la nueva categoria',
    schema: {
      example: {
        name: 'string',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Categoria creada exitosamente.',
    schema: {
      properties: {
        statusCode: { type: 'number' },
        message: { type: 'string' },
        data: {
          type: 'object', properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
            userId: { type: 'string' },
          },
        }
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'No autorizado.',
    schema: {
      properties: {
        message: { type: 'string' },
        errors: { type: 'string' },
        statusCode: { type: 'number' },
      },
    },
  })

  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Ha ocurrido un conflicto.',
    schema: {
      properties: {
        message: { type: 'string' },
        errors: { type: 'string' },
        statusCode: { type: 'number' },
      },
    },
  })

  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Error interno del servidor.', schema: {
      properties: {
        message: { type: 'string' },
        errors: { type: 'string' },
        statusCode: { type: 'number' },
      },
    },
  })
  async create(@Body() createCategoryDto: CreateCategoryDto, @User() user: JwtPayload) {
    return this.responseService.sendSuccess(
      await this.categoryService.create({ ...createCategoryDto, userId: user.id }),
      'Categoria creada exitosamente',
      HttpStatus.CREATED
    );
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Obtener todas las categorias', description: 'Obtiene todas las categorias.' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Categorías.',
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
              createdAt: { type: 'string', format: 'date-time' },
              updatedAt: { type: 'string', format: 'date-time' },
              userId: { type: 'string' },
            },
          },
        },
      },
    },
  })

  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'No autorizado.',
    schema: {
      properties: {
        message: { type: 'string' },
        errors: { type: 'string' },
        statusCode: { type: 'number' },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Error interno del servidor.', schema: {
      properties: {
        message: { type: 'string' },
        errors: { type: 'string' },
        statusCode: { type: 'number' },
      },
    },
  })
  async findAll(@User() user: JwtPayload) {
    return this.responseService.sendSuccess(
      await this.categoryService.findAll(user.id)
    );
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Obtener categoria por id', description: 'Obtiene una categoria por su id.' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Categoría.',
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
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
            userId: { type: 'string' },
          },
        },
      },
    },
  })

  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'No autorizado.',
    schema: {
      properties: {
        message: { type: 'string' },
        errors: { type: 'string' },
        statusCode: { type: 'number' },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Categoria no encontrada.',
    schema: {
      properties: {
        message: { type: 'string' },
        errors: { type: 'string' },
        statusCode: { type: 'number' },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Error interno del servidor.', schema: {
      properties: {
        message: { type: 'string' },
        errors: { type: 'string' },
        statusCode: { type: 'number' },
      },
    },
  })
  async findOne(@Param('id') id: string) {
    return this.responseService.sendSuccess(
      await this.categoryService.findOne(id)
    );
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Actualizar categoria', description: 'Actualiza una categoria por su id' })
  @ApiBody({
    description: 'Datos de la categoria',
    schema: {
      example: {
        name: 'string',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Categoría.',
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
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
            userId: { type: 'string' },
          },
        },
      },
    },
  })

  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'No autorizado.',
    schema: {
      properties: {
        message: { type: 'string' },
        errors: { type: 'string' },
        statusCode: { type: 'number' },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Categoria no encontrada.',
    schema: {
      properties: {
        message: { type: 'string' },
        errors: { type: 'string' },
        statusCode: { type: 'number' },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Error interno del servidor.', schema: {
      properties: {
        message: { type: 'string' },
        errors: { type: 'string' },
        statusCode: { type: 'number' },
      },
    },
  })
  async update(@Param('id') id: string, @User() user: JwtPayload, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.responseService.sendSuccess(
      await this.categoryService.update(id, { ...updateCategoryDto, userId: user.id })
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Eliminar categoria', description: 'Elimina una categoria por su id y las tareas relacionadas a esta categoria' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Categoría eliminada.',
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
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
            userId: { type: 'string' },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Categoria no encontrada.',
    schema: {
      properties: {
        message: { type: 'string' },
        errors: { type: 'string' },
        statusCode: { type: 'number' },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Error interno del servidor.', schema: {
      properties: {
        message: { type: 'string' },
        errors: { type: 'string' },
        statusCode: { type: 'number' },
      },
    },
  })
  async remove(@Param('id') id: string) {
    return this.responseService.sendSuccess(
      await this.categoryService.remove(id),
      'Categoria eliminada correctamente'
    );
  }
}
