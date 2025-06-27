import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, MinLength } from 'class-validator';
import { Match } from 'src/common/decorators/match.decorator';

export class RegisterDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'Valid email address',
  })
  @IsEmail({}, { message: 'You must provide a valid email address.' })
  email: string;

  @ApiProperty({
    example: '123456',
    description: 'Password with at least 6 characters',
  })
  @MinLength(6, { message: 'Password must be at least 6 characters long.' })
  password: string;

  @ApiProperty({
    example: '123456',
    description: 'Password confirmation',
  })
  @MinLength(6, { message: 'Password must be at least 6 characters long.' })
  @Match('password', { message: 'Passwords do not match.' })
  confirmPassword: string;
}
