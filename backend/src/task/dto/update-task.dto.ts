import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateTaskDto } from './create-task.dto';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class UpdateTaskDto extends PartialType(CreateTaskDto) {
    @ApiProperty({ example: 'string' })
    @IsString({ message: 'El id debe ser un string' })
    @IsNotEmpty({ message: 'El id es obligatorio' })
    id: string

    @ApiProperty({ example: 'boolean' })
    @IsBoolean({ message: 'Completed debe ser un booleano' })
    completed: boolean
}
