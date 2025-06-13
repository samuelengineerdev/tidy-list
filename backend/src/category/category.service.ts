import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Category } from 'generated/prisma';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {

  constructor(private readonly prismaService: PrismaService) { }

  async existCategory(id: string): Promise<Category> {
    const foundCategory = await this.prismaService.category.findFirst({ where: { id } });
    if (!foundCategory) throw new NotFoundException(`No se encontro esta categoria por el id: ${id}`);

    return foundCategory;
  }

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const userHaveCategory = await this.prismaService.category.findFirst({ where: { name: createCategoryDto.name, userId: createCategoryDto.userId } });

    if (userHaveCategory) {
      throw new ConflictException("Esta categoria ya ha sido agregada");
    }

    const category = await this.prismaService.category.create({ data: createCategoryDto });
    return category;
  }

  async findAll(userId: string): Promise<Category[]> {
    return await this.prismaService.category.findMany({ where: { userId } });
  }

  async findOne(id: string): Promise<Category> {
    const foundCategory = await this.existCategory(id);

    return foundCategory;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
    await this.existCategory(id);
    return await this.prismaService.category.update({ data: updateCategoryDto, where: { id } })
  }

  async remove(id: string): Promise<Category> {
    await this.existCategory(id);
    return await this.prismaService.category.delete({ where: { id } });
  }
}
