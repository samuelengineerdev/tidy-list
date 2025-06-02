import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login-auth-dto';
import { RegisterDto } from './dto/register-dto-dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) { }

  async register(registerDto: RegisterDto) {
    try {
      const { email, password } = registerDto;

      const existingEmail = await this.prisma.user.findUnique({
        where: { email },
      });

      if (existingEmail) throw new ConflictException('Este email ya esta en uso');

      const hashedPassword = await bcrypt.hash(password, 10);

      const createdUser = await this.prisma.user.create({
        data: { email, passwordHash: hashedPassword },
        select: {
          id: true,
          email: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return createdUser;
    } catch (error) {
      console.log(error);
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException("Ha ocurrido un error al registrarse, por favor intentar de nuevo.");
    }
  }

  async login(loginDto: LoginDto) {

    const { email, password } = loginDto;
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const { passwordHash, ...userToResponse } = user;

    const payload = userToResponse;

    const token = await this.jwtService.signAsync(payload);

    return { user: userToResponse, token };

  }
}
