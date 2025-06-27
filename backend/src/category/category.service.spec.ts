import { Test, TestingModule } from '@nestjs/testing';
import { CategoryService } from './category.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('CategoryService (unit tests)', () => {
  let service: CategoryService;
  let prismaMock: any;

  beforeEach(async () => {
    prismaMock = {
      category: {
        findFirst: jest.fn(),
        findMany: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoryService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = module.get<CategoryService>(CategoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create()', () => {
    it('debería crear una nueva categoría si no existe', async () => {
      const dto = { name: 'Trabajo', userId: 'user123' };
      prismaMock.category.findFirst.mockResolvedValue(null);
      prismaMock.category.create.mockResolvedValue({ id: 'cat1', ...dto });

      const result = await service.create(dto);

      expect(result).toEqual({ id: 'cat1', ...dto });
      expect(prismaMock.category.create).toHaveBeenCalledWith({ data: dto });
    });

    it('debería lanzar ConflictException si ya existe una categoría con el mismo nombre y usuario', async () => {
      const dto = { name: 'Trabajo', userId: 'user123' };
      prismaMock.category.findFirst.mockResolvedValue({ id: 'existing-id' });

      await expect(service.create(dto)).rejects.toThrow(ConflictException);
    });
  });

  describe('findAll()', () => {
    it('debería retornar todas las categorías del usuario', async () => {
      const userId = 'user123';
      const categories = [{ id: 'cat1', name: 'Trabajo', userId }];
      prismaMock.category.findMany.mockResolvedValue(categories);

      const result = await service.findAll(userId);
      expect(result).toEqual(categories);
    });
  });

  describe('findOne()', () => {
    it('debería retornar una categoría por ID', async () => {
      const category = { id: 'cat1', name: 'Trabajo', userId: 'user123' };
      prismaMock.category.findFirst.mockResolvedValue(category);

      const result = await service.findOne('cat1');
      expect(result).toEqual(category);
    });

    it('debería lanzar NotFoundException si no existe', async () => {
      prismaMock.category.findFirst.mockResolvedValue(null);

      await expect(service.findOne('catX')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update()', () => {
    it('debería actualizar una categoría existente', async () => {
      const category = { id: 'cat1', name: 'Viejo', userId: 'user123' };
      const updateDto = { name: 'Nuevo', userId: 'user123' };

      prismaMock.category.findFirst.mockResolvedValue(category);
      prismaMock.category.update.mockResolvedValue({ ...category, ...updateDto });

      const result = await service.update('cat1', updateDto);
      expect(result).toEqual({ ...category, ...updateDto });
    });
  });

  describe('remove()', () => {
    it('debería eliminar una categoría existente', async () => {
      const category = { id: 'cat1', name: 'Trabajo', userId: 'user123' };
      prismaMock.category.findFirst.mockResolvedValue(category);
      prismaMock.category.delete.mockResolvedValue(category);

      const result = await service.remove('cat1');
      expect(result).toEqual(category);
    });
  });
});
