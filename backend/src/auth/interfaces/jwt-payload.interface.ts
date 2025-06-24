import { User } from "generated/prisma";

export interface JwtPayload extends Omit<User, | 'passwordHash'> {
    sub: string;
    iat: number;
}
