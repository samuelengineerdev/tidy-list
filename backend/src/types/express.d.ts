import { ResponseUserDto } from 'src/user/dto/response-user-dto';
import { User } from './user.entity'; 

declare global {
  namespace Express {
    interface Request {
      user?: ResponseUserDto & { iat: number }; 
    }
  }
}
