import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Task } from 'generated/prisma';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TaskService {
  constructor(private readonly prismaService: PrismaService) { }

  async existTask(id: string): Promise<Task> {
    const foundTask = await this.prismaService.task.findFirst({ where: { id } });
    if (!foundTask) throw new NotFoundException(`No se encontro esta tarea por el id: ${id}`);

    return foundTask;
  }

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    const userHaveTask = await this.prismaService.task.findFirst({ where: { name: createTaskDto.name, userId: createTaskDto.userId } });

    if (userHaveTask) {
      throw new ConflictException("Esta categoria ya ha sido agregada");
    }

    return await this.prismaService.task.create({ data: createTaskDto });
  }

  async findAll(userId: string): Promise<Task[]> {
    return await this.prismaService.task.findMany({ where: { userId } });
  }

  async findOne(id: string): Promise<Task> {
    return await this.existTask(id);
  }

  async findByCategory(id: string): Promise<Task[]> {
    return await this.prismaService.task.findMany({ where: { categoryId: id } })
  }

  async update(updateTaskDto: UpdateTaskDto): Promise<Task> {
    await this.existTask(updateTaskDto.id);
    return this.prismaService.task.update({ data: updateTaskDto, where: { id: updateTaskDto.id } })
  }

  async remove(id: string): Promise<Task> {
    await this.existTask(id);
    return this.prismaService.task.delete({ where: { id } });
  }
}
