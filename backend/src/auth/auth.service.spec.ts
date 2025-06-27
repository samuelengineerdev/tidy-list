import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ConflictException, UnauthorizedException } from '@nestjs/common';

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

describe('AuthService (unit tests)', () => {
  let service: AuthService;
  let prismaMock: any;
  let jwtMock: any;

  beforeEach(async () => {
    prismaMock = {
      user: {
        findUnique: jest.fn(),
        create: jest.fn(),
      },
    };

    jwtMock = {
      sign: jest.fn(),
      signAsync: jest.fn()
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: prismaMock },
        { provide: JwtService, useValue: jwtMock },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  describe('register()', () => {
    it('debería registrar un nuevo usuario si el email no existe', async () => {
      const dto = { email: 'test@example.com', password: '123456', confirmPassword: '123456' };
      const fecha = new Date();

      prismaMock.user.findUnique.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed-password');
      prismaMock.user.create.mockResolvedValue({
        id: 'abc123',
        email: dto.email,
        createdAt: fecha,
        updatedAt: fecha,
      });

      const result = await service.register(dto);

      expect(result).toEqual(expect.objectContaining({
        id: expect.any(String),
        email: dto.email,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      }));
    });

    it('debería lanzar ConflictException si el email ya existe', async () => {
      const dto = { email: 'existing@example.com', password: '123456', confirmPassword: '123456' };
      prismaMock.user.findUnique.mockResolvedValue({ id: 'user123' });

      await expect(service.register(dto)).rejects.toThrow(ConflictException);
    });
  });

  describe('login()', () => {
    it('debería retornar un token válido si las credenciales son correctas', async () => {
      const dto = { email: 'test@example.com', password: '123456' };

      prismaMock.user.findUnique.mockResolvedValue({
        id: 'user123',
        email: dto.email,
        passwordHash: 'hashed-password',
      });

      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      jwtMock.signAsync.mockReturnValue('fake-jwt-token');

      const result = await service.login(dto);

      expect(result).toEqual(
        { user: {id: 'user123', email: dto.email}, token: 'fake-jwt-token' }
      );
    });

    it('debería lanzar UnauthorizedException si el usuario no existe', async () => {
      const dto = { email: 'unknown@example.com', password: '123456' };

      prismaMock.user.findUnique.mockResolvedValue(null);

      await expect(service.login(dto)).rejects.toThrow(UnauthorizedException);
    });

    it('debería lanzar UnauthorizedException si la contraseña es incorrecta', async () => {
      const dto = { email: 'test@example.com', password: 'wrong' };

      prismaMock.user.findUnique.mockResolvedValue({
        id: 'user123',
        email: dto.email,
        passwordHash: 'hashed-password',
      });

      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.login(dto)).rejects.toThrow(UnauthorizedException);
    });
  });
});
