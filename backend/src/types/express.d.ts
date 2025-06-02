// src/types/express.d.ts
import { User } from './user.entity'; // Importa tu entidad o tipo User si es necesario

declare global {
  namespace Express {
    interface Request {
      user?: User; // Agrega la propiedad user al objeto Request
    }
  }
}
