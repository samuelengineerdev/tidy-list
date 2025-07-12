import { Test, TestingModule } from '@nestjs/testing';
import { TaskService } from './task.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('TaskService (unit tests)', () => {
  let service: TaskService;
  let prismaMock: any;

  beforeEach(async () => {
    prismaMock = {
      task: {
        findFirst: jest.fn(),
        findMany: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
      category: {
        findFirst: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = module.get<TaskService>(TaskService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new task if it does not exist and the category exists', async () => {
      const dto = {
        name: 'Task 1',
        description: 'Description',
        dueDate: new Date(),
        userId: 1,
        categoryId: 1,
      };

      prismaMock.task.findFirst.mockResolvedValueOnce(null); // no existing task with that name
      prismaMock.category.findFirst.mockResolvedValueOnce({ id: 1 });
      prismaMock.task.create.mockResolvedValueOnce({ id: 1, ...dto });

      const result = await service.create(dto);
      expect(result).toEqual({ id: 1, ...dto });
    });

    it('should throw ConflictException if a task with the same name and user already exists', async () => {
      const dto = {
        name: 'Task 1',
        description: '',
        dueDate: new Date(),
        userId: 1,
        categoryId: 1,
      };

      prismaMock.task.findFirst.mockResolvedValueOnce({ id: 'existingTask' });

      await expect(service.create(dto)).rejects.toThrow(ConflictException);
    });

    it('should throw NotFoundException if the category does not exist', async () => {
      const dto = {
        name: 'Task 1',
        description: '',
        dueDate: new Date(),
        userId: 1,
        categoryId: 1,
      };

      prismaMock.task.findFirst.mockResolvedValueOnce(null);
      prismaMock.category.findFirst.mockResolvedValueOnce(null);

      await expect(service.create(dto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('should return all tasks for the user', async () => {
      const userId = 1;
      const mockTasks = [{ id: 1, userId }, { id: 2, userId }];
      prismaMock.task.findMany.mockResolvedValueOnce(mockTasks);

      const result = await service.findAll(userId);
      expect(result).toEqual(mockTasks);
      expect(prismaMock.task.findMany).toHaveBeenCalledWith({ where: { userId } });
    });
  });

  describe('findOne', () => {
    it('should return the task if it exists and belongs to the user', async () => {
      const userId = 1;
      const taskId = 1;
      const mockTask = { id: taskId, userId };
      prismaMock.task.findFirst.mockResolvedValueOnce(mockTask);

      const result = await service.findOne(userId, taskId);
      expect(result).toEqual(mockTask);
    });

    it('should throw NotFoundException if the task is not found', async () => {
      const userId = 1;
      const taskId = 1;
      prismaMock.task.findFirst.mockResolvedValueOnce(null);

      await expect(service.findOne(userId, taskId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByCategory', () => {
    it('should return tasks by category', async () => {
      const userId = 1;
      const categoryId = 1;
      const mockTasks = [{ id: 1, categoryId, userId }, { id: 2, categoryId, userId }];
      prismaMock.task.findMany.mockResolvedValueOnce(mockTasks);

      const result = await service.findByCategory(userId, categoryId);
      expect(result).toEqual(mockTasks);
    });
  });

  describe('update', () => {
    it('should update a task if it exists and the category is valid', async () => {
      const userId = 1;
      const dto = {
        id: 1,
        name: 'Updated',
        completed: true,
        categoryId: 1,
      };

      prismaMock.task.findFirst.mockResolvedValueOnce({ id: dto.id, userId });
      prismaMock.category.findFirst.mockResolvedValueOnce({ id: dto.categoryId, userId });
      prismaMock.task.update.mockResolvedValueOnce({ ...dto, userId });

      const result = await service.update(userId, dto);
      expect(result).toEqual({ ...dto, userId });
    });

    it('should throw NotFoundException if the category does not exist', async () => {
      const userId = 1;
      const dto = {
        id: 1,
        name: 'Updated',
        completed: true,
        categoryId: 1,
      };

      prismaMock.task.findFirst.mockResolvedValueOnce({ id: dto.id, userId });
      prismaMock.category.findFirst.mockResolvedValueOnce(null);

      await expect(service.update(userId, dto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete a task if it exists and belongs to the user', async () => {
      const userId = 1;
      const taskId = 1;
      const mockTask = { id: taskId, userId };
      prismaMock.task.findFirst.mockResolvedValueOnce(mockTask);
      prismaMock.task.delete.mockResolvedValueOnce(mockTask);

      const result = await service.remove(userId, taskId);
      expect(result).toEqual(mockTask);
    });

    it('should throw NotFoundException if the task is not found', async () => {
      const userId = 1;
      const taskId = 1;
      prismaMock.task.findFirst.mockResolvedValueOnce(null);

      await expect(service.remove(userId, taskId)).rejects.toThrow(NotFoundException);
    });
  });
});
