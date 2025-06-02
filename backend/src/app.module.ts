import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from './prisma/prisma.service';
import { ResponseService } from './response/response.service';

@Module({
  imports: [AuthModule],
  providers: [PrismaService, ResponseService],
})
export class AppModule { }
