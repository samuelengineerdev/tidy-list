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
    it('debería crear una nueva tarea si no existe y si la categoría existe', async () => {
      const dto = {
        name: 'Tarea 1',
        description: 'Descripción',
        dueDate: new Date(),
        userId: 'user123',
        categoryId: 'cat123',
      };

      prismaMock.task.findFirst.mockResolvedValueOnce(null); // no hay tarea con ese nombre
      prismaMock.category.findFirst.mockResolvedValueOnce({ id: 'cat123' });
      prismaMock.task.create.mockResolvedValueOnce({ id: 'task1', ...dto });

      const result = await service.create(dto);
      expect(result).toEqual({ id: 'task1', ...dto });
    });

    it('debería lanzar ConflictException si ya existe una tarea con el mismo nombre y usuario', async () => {
      const dto = {
        name: 'Tarea 1',
        description: '',
        dueDate: new Date(),
        userId: 'user123',
        categoryId: 'cat123',
      };

      prismaMock.task.findFirst.mockResolvedValueOnce({ id: 'existingTask' });

      await expect(service.create(dto)).rejects.toThrow(ConflictException);
    });

    it('debería lanzar NotFoundException si no existe la categoría', async () => {
      const dto = {
        name: 'Tarea 1',
        description: '',
        dueDate: new Date(),
        userId: 'user123',
        categoryId: 'cat123',
      };

      prismaMock.task.findFirst.mockResolvedValueOnce(null);
      prismaMock.category.findFirst.mockResolvedValueOnce(null);

      await expect(service.create(dto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('debería retornar todas las tareas del usuario', async () => {
      const userId = 'user123';
      const mockTasks = [{ id: 'task1' }, { id: 'task2' }];
      prismaMock.task.findMany.mockResolvedValueOnce(mockTasks);

      const result = await service.findAll(userId);
      expect(result).toEqual(mockTasks);
      expect(prismaMock.task.findMany).toHaveBeenCalledWith({ where: { userId } });
    });
  });

  describe('findOne', () => {
    it('debería retornar la tarea si existe', async () => {
      const taskId = 'task123';
      const mockTask = { id: taskId };
      prismaMock.task.findFirst.mockResolvedValueOnce(mockTask);

      const result = await service.findOne(taskId);
      expect(result).toEqual(mockTask);
    });

    it('debería lanzar NotFoundException si no se encuentra la tarea', async () => {
      const taskId = 'task123';
      prismaMock.task.findFirst.mockResolvedValueOnce(null);

      await expect(service.findOne(taskId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByCategory', () => {
    it('debería retornar tareas por categoría', async () => {
      const categoryId = 'cat123';
      const mockTasks = [{ id: 'task1' }, { id: 'task2' }];
      prismaMock.task.findMany.mockResolvedValueOnce(mockTasks);

      const result = await service.findByCategory(categoryId);
      expect(result).toEqual(mockTasks);
    });
  });

  describe('update', () => {
    it('debería actualizar una tarea si existe y la categoría es válida', async () => {
      const dto = {
        id: 'task1',
        name: 'Actualizada',
        completed: true,
        userId: 'user123',
        categoryId: 'cat123',
      };

      prismaMock.task.findFirst.mockResolvedValueOnce({ id: 'task1' });
      prismaMock.category.findFirst.mockResolvedValueOnce({ id: 'cat123' });
      prismaMock.task.update.mockResolvedValueOnce({ ...dto });

      const result = await service.update(dto);
      expect(result).toEqual({ ...dto });
    });

    it('debería lanzar NotFoundException si la categoría no existe', async () => {
      const dto = {
        id: 'task1',
        name: 'Actualizada',
        completed: true,
        userId: 'user123',
        categoryId: 'cat123',
      };

      prismaMock.task.findFirst.mockResolvedValueOnce({ id: 'task1' });
      prismaMock.category.findFirst.mockResolvedValueOnce(null);

      await expect(service.update(dto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('debería eliminar una tarea si existe', async () => {
      const taskId = 'task1';
      const mockTask = { id: taskId };
      prismaMock.task.findFirst.mockResolvedValueOnce(mockTask);
      prismaMock.task.delete.mockResolvedValueOnce(mockTask);

      const result = await service.remove(taskId);
      expect(result).toEqual(mockTask);
    });

    it('debería lanzar NotFoundException si no se encuentra la tarea', async () => {
      const taskId = 'task1';
      prismaMock.task.findFirst.mockResolvedValueOnce(null);

      await expect(service.remove(taskId)).rejects.toThrow(NotFoundException);
    });
  });
});
