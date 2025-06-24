import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ConflictException } from '@nestjs/common';

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
}));

describe('AuthService - register (unit test)', () => {
  let service: AuthService;
  let prismaMock: {
    user: {
      findUnique: jest.Mock;
      create: jest.Mock;
    };
  };

  let jwtServiceMock: {
    sign: jest.Mock;
    verify: jest.Mock;
  }


  beforeEach(async () => {
    prismaMock = {
      user: {
        findUnique: jest.fn(),
        create: jest.fn(),
      },
    };

    jwtServiceMock = {
      sign: jest.fn(),
      verify: jest.fn(),
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
        {
          provide: JwtService,
          useValue: jwtServiceMock,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('debería registrar un nuevo usuario si el email no existe', async () => {
    const dto = {
      email: 'test12@example.com',
      password: '123456',
      confirmPassword: '123456',
    };

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

    expect(result).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        email: dto.email,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      }),
    );
  });

  it('debería lanzar ConflictException si el email ya existe', async () => {
    const dto = {
      email: 'existing@example.com',
      password: '123456',
      confirmPassword: '123456',
    };

    prismaMock.user.findUnique.mockResolvedValue({ id: 'user123' });

    await expect(service.register(dto)).rejects.toThrow(ConflictException);
  });
});
