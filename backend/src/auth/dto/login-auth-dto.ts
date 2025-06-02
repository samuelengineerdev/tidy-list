import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: 'usuario@example.com',
    description: 'Correo electrónico válido',
  })
  @IsEmail()
  email: string;


  @ApiProperty({
    example: '123456',
    description: 'Contraseña de al menos 6 caracteres',
  })
  @MinLength(6)
  password: string;
}
