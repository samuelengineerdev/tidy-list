import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('UserService (unit tests)', () => {
  let service: UserService;
  let prismaMock: any;

  beforeEach(async () => {
    prismaMock = {
      userSettings: {
        findFirst: jest.fn(),
        update: jest.fn(),
        create: jest.fn(),
      }
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getUserSettings', () => {
    it('debería retornar las configuraciones del usuario si existen', async () => {
      const userId = 'user123';
      const mockSettings = { id: 'settings1', userId };

      prismaMock.userSettings.findFirst.mockResolvedValueOnce(mockSettings);

      const result = await service.getUserSettings(userId);
      expect(result).toEqual(mockSettings);
    });

    it('debería lanzar NotFoundException si no existen configuraciones del usuario', async () => {
      prismaMock.userSettings.findFirst.mockResolvedValueOnce(null);

      await expect(service.getUserSettings('user123')).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateUserSettings', () => {
    it('debería actualizar las configuraciones si existen', async () => {
      const dto = { darkMode: true, userId: 'user123' };

      prismaMock.userSettings.findFirst.mockResolvedValueOnce({ id: 'settings1', userId: 'user123' });
      prismaMock.userSettings.update.mockResolvedValueOnce({ id: 'settings1', ...dto });

      const result = await service.updateUserSettings(dto);
      expect(result).toEqual({ id: 'settings1', ...dto });
      expect(prismaMock.userSettings.update).toHaveBeenCalledWith({
        data: dto,
        where: { userId: dto.userId }
      });
    });

    it('debería crear nuevas configuraciones si no existen', async () => {
      const dto = { darkMode: true, userId: 'user123' };

      prismaMock.userSettings.findFirst.mockResolvedValueOnce(null);
      prismaMock.userSettings.create.mockResolvedValueOnce({ id: 'settings2', ...dto });

      const result = await service.updateUserSettings(dto);
      expect(result).toEqual({ id: 'settings2', ...dto });
      expect(prismaMock.userSettings.create).toHaveBeenCalledWith({ data: dto });
    });
  });
});
