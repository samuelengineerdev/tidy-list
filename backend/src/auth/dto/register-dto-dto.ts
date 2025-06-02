import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, MinLength } from 'class-validator';
import { Match } from 'src/common/decorators/match.decorator';

export class RegisterDto {
  @ApiProperty({
    example: 'usuario@example.com',
    description: 'Correo electrónico válido',
  })
  @IsEmail({}, { message: 'Debe proporcionar un correo electrónico válido.' })
  email: string;

  @ApiProperty({
    example: '123456',
    description: 'Contraseña de al menos 6 caracteres',
  })
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres.' })
  password: string;

  @ApiProperty({
    example: '123456',
    description: 'Confirmación de la contraseña',
  })
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres.' })
  @Match('password', { message: 'Las contraseñas no coinciden.' })
  confirmPassword: string;
}
