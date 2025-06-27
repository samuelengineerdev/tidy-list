import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Task } from 'generated/prisma';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TaskService {
  constructor(private readonly prismaService: PrismaService) { }

  async existTask(id: number): Promise<Task> {
    const foundTask = await this.prismaService.task.findFirst({ where: { id } });
    if (!foundTask) throw new NotFoundException(`Task not found with id: ${id}`);

    return foundTask;
  }

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    const userHasTask = await this.prismaService.task.findFirst({
      where: { name: createTaskDto.name, userId: createTaskDto.userId },
    });

    const categoryExists = await this.prismaService.category.findFirst({
      where: { id: createTaskDto.categoryId },
    });

    if (userHasTask) {
      throw new ConflictException("This task has already been added");
    }

    if (!categoryExists) {
      throw new NotFoundException(`Category with id: ${createTaskDto.categoryId} was not found`);
    }

    return await this.prismaService.task.create({ data: createTaskDto });
  }

  async findAll(userId: number): Promise<Task[]> {
    return await this.prismaService.task.findMany({ where: { userId } });
  }

  async findOne(id: number): Promise<Task> {
    return await this.existTask(id);
  }

  async findByCategory(categoryId: number): Promise<Task[]> {
    return await this.prismaService.task.findMany({ where: { categoryId } });
  }

  async update(updateTaskDto: UpdateTaskDto): Promise<Task> {
    await this.existTask(updateTaskDto.id);
    const foundCategory = await this.prismaService.category.findFirst({
      where: { id: updateTaskDto.categoryId },
    });
    if (!foundCategory)
      throw new NotFoundException(`Category with id: ${updateTaskDto.categoryId} was not found`);

    return this.prismaService.task.update({
      data: updateTaskDto,
      where: { id: updateTaskDto.id },
    });
  }

  async remove(id: number): Promise<Task> {
    await this.existTask(id);
    return this.prismaService.task.delete({ where: { id } });
  }
}