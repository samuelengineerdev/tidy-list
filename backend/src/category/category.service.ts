import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Category } from 'generated/prisma';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {

  constructor(private readonly prismaService: PrismaService) { }

  async existCategory(userId: number, id: number): Promise<Category> {
    const foundCategory = await this.prismaService.category.findFirst({ where: { userId, id } });
    if (!foundCategory) throw new NotFoundException(`Category not found with id: ${id}`);

    return foundCategory;
  }

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const userHaveCategory = await this.prismaService.category.findFirst({ where: { name: createCategoryDto.name, userId: createCategoryDto.userId } });

    if (userHaveCategory) {
      throw new ConflictException("This category has already been added");
    }

    const category = await this.prismaService.category.create({ data: createCategoryDto });
    return category;
  }

  async findAll(userId: number): Promise<Category[]> {
    return await this.prismaService.category.findMany({ where: { userId } });
  }

  async findOne(userId: number, id: number): Promise<Category> {
    const foundCategory = await this.existCategory(userId, id);

    return foundCategory;
  }

  async update(userId: number, id: number, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
    await this.existCategory(userId, id);
    return await this.prismaService.category.update({ data: updateCategoryDto, where: { userId, id } })
  }

  async remove(userId: number, id: number): Promise<Category> {
    await this.existCategory(userId, id);
    return await this.prismaService.category.delete({ where: { userId, id } });
  }
}
