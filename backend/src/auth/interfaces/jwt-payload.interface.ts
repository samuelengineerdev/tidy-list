import { User } from "generated/prisma";

export interface JwtPayload extends Omit<User, | 'passwordHash' | 'createdAt' | 'updatedAt'> {
    sub: string;
}
