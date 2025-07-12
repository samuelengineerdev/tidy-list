import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Task } from 'generated/prisma';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TaskService {
  constructor(private readonly prismaService: PrismaService) { }

  async existTask(userId: number, id: number): Promise<Task> {
    const foundTask = await this.prismaService.task.findFirst({ where: { userId, id } });
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

  async findOne(userId: number, id: number): Promise<Task> {
    return await this.existTask(userId, id);
  }

  async findByCategory(userId: number, categoryId: number): Promise<Task[]> {
    return await this.prismaService.task.findMany({ where: { userId, categoryId } });
  }

  async update(userId: number, updateTaskDto: UpdateTaskDto): Promise<Task> {
    await this.existTask(userId, updateTaskDto.id);
    const foundCategory = await this.prismaService.category.findFirst({
      where: { userId, id: updateTaskDto.categoryId },
    });
    if (!foundCategory)
      throw new NotFoundException(`Category with id: ${updateTaskDto.categoryId} was not found`);

    return this.prismaService.task.update({
      data: updateTaskDto,
      where: { id: updateTaskDto.id },
    });
  }

  async remove(userId: number, id: number): Promise<Task> {
    await this.existTask(userId, id);
    return this.prismaService.task.delete({ where: { userId, id } });
  }
}