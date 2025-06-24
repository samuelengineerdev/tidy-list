import { User } from 'generated/prisma';

export type ResponseUserDto = Omit<User, 'passwordHash'>