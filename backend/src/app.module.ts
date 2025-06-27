import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { CategoryModule } from './category/category.module';
import { PrismaService } from './prisma/prisma.service';
import { ResponseService } from './response/response.service';
import { TaskModule } from './task/task.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [AuthModule, CategoryModule, TaskModule, UserModule],
  providers: [PrismaService, ResponseService],
})
export class AppModule { }
