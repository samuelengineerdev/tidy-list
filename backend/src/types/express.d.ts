// src/types/express.d.ts
import { ResponseUserDto } from 'src/user/dto/response-user-dto';
import { User } from './user.entity'; // Importa tu entidad o tipo User si es necesario

declare global {
  namespace Express {
    interface Request {
      user?: ResponseUserDto & { iat: number }; // Agrega la propiedad user al objeto Request
    }
  }
}
