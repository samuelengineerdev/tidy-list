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
  @ApiOperation({ summary: 'Crear categoria', description: 'Este endpoint crea una nueva categoria por usuario para el inventario.' })
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
      example: {
        statusCode: HttpStatus.CREATED,
        message: 'Categoria creada exitosamente',
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
    status: HttpStatus.CONFLICT,
    description: 'Ya has creado esta categoria.',
    schema: {
      example: {
        message: 'Ya has creado esta categoria.',
        error: 'Conflict',
        statusCode: HttpStatus.CONFLICT,
      },
    },
  })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Error interno del servidor.' })
  async create(@Body() createCategoryDto: CreateCategoryDto, @User() user: JwtPayload) {
    return this.responseService.sendSuccess(
      await this.categoryService.create({ ...createCategoryDto, userId: user.id }),
      'Categoria creada exitosamente'
    );
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Categorias.',
    schema: {
      example: {
        statusCode: HttpStatus.OK,
        message: 'Categorias',
        data: [{
          id: 'string',
          name: 'string',
          createdAt: 'string',
          updatedAt: 'string',
          userId: 'string',
        }],
      },
    },
  })
  @ApiOperation({ summary: 'Obtener todas las categorias', description: 'Obtiene todas las categorias por el usuario logueado.' })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Error interno del servidor.' })
  async findAll(@User() user: JwtPayload) {
    return this.responseService.sendSuccess(
      await this.categoryService.findAll(user.id)
    );
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Obtener categoria por id', description: 'Obtiene una categoria por su id.' })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Categoria.',
    schema: {
      example: {
        statusCode: HttpStatus.NOT_FOUND,
        errors: "string",
        message: 'No se encontro esta categoria por el id: string',

      },
    },
  })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Error interno del servidor.' })
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
        userId: 'string'
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Categorias.',
    schema: {
      example: {
        statusCode: HttpStatus.OK,
        message: 'Categoria actualizada correctamente',
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
    status: HttpStatus.NOT_FOUND,
    description: 'Categoria.',
    schema: {
      example: {
        statusCode: HttpStatus.NOT_FOUND,
        errors: "string",
        message: 'No se encontro esta categoria por el id: string',

      },
    },
  })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Error interno del servidor.' })
  async update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.responseService.sendSuccess(
      await this.categoryService.update(id, updateCategoryDto)
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Eliminar categoria', description: 'Elimina una categoria por su id y las tareas relacionadas a esta categoria' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Categoia eliminada',
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
        message: 'No se encontro esta categoria por el id: string',

      },
    },
  })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Error interno del servidor.' })
  async remove(@Param('id') id: string) {
    return this.responseService.sendSuccess(
      await this.categoryService.remove(id),
      'Categoria eliminada correctamente'
    );
  }
}
