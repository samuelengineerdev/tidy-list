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
    it('should create a new category if it does not exist', async () => {
      const dto = { name: 'Work', userId: 1 };
      prismaMock.category.findFirst.mockResolvedValue(null);
      prismaMock.category.create.mockResolvedValue({ id: 1, ...dto });

      const result = await service.create(dto);

      expect(result).toEqual({ id: 1, ...dto });
      expect(prismaMock.category.create).toHaveBeenCalledWith({ data: dto });
    });

    it('should throw ConflictException if a category with the same name and user already exists', async () => {
      const dto = { name: 'Work', userId: 1 };
      prismaMock.category.findFirst.mockResolvedValue({ id: 'existing-id' });

      await expect(service.create(dto)).rejects.toThrow(ConflictException);
    });
  });

  describe('findAll()', () => {
    it('should return all categories for the user', async () => {
      const userId = 1;
      const categories = [{ id: 1, name: 'Work', userId }];
      prismaMock.category.findMany.mockResolvedValue(categories);

      const result = await service.findAll(userId);
      expect(result).toEqual(categories);
    });
  });

  describe('findOne()', () => {
    it('should return a category by ID and userId', async () => {
      const userId = 1;
      const categoryId = 1;
      const category = { id: categoryId, name: 'Work', userId };
      prismaMock.category.findFirst.mockResolvedValue(category);

      const result = await service.findOne(userId, categoryId);
      expect(result).toEqual(category);
    });

    it('should throw NotFoundException if it does not exist', async () => {
      const userId = 1;
      const categoryId = 999;
      prismaMock.category.findFirst.mockResolvedValue(null);

      await expect(service.findOne(userId, categoryId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update()', () => {
    it('should update an existing category', async () => {
      const userId = 1;
      const categoryId = 1;
      const updateDto = { name: 'New name' };
      const existingCategory = { id: categoryId, name: 'Old name', userId };

      prismaMock.category.findFirst.mockResolvedValue(existingCategory);
      prismaMock.category.update.mockResolvedValue({ ...existingCategory, ...updateDto });

      const result = await service.update(userId, categoryId, updateDto);
      expect(result).toEqual({ ...existingCategory, ...updateDto });
    });

    it('should throw NotFoundException if the category does not exist', async () => {
      const userId = 1;
      const categoryId = 1;
      const updateDto = { name: 'New name' };

      prismaMock.category.findFirst.mockResolvedValue(null);

      await expect(service.update(userId, categoryId, updateDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove()', () => {
    it('should remove an existing category', async () => {
      const userId = 1;
      const categoryId = 1;
      const category = { id: categoryId, name: 'Work', userId };

      prismaMock.category.findFirst.mockResolvedValue(category);
      prismaMock.category.delete.mockResolvedValue(category);

      const result = await service.remove(userId, categoryId);
      expect(result).toEqual(category);
    });

    it('should throw NotFoundException if the category does not exist', async () => {
      const userId = 1;
      const categoryId = 1;

      prismaMock.category.findFirst.mockResolvedValue(null);

      await expect(service.remove(userId, categoryId)).rejects.toThrow(NotFoundException);
    });
  });
});
