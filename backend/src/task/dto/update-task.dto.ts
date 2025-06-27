import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateTaskDto } from './create-task.dto';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class UpdateTaskDto extends PartialType(CreateTaskDto) {
    @ApiProperty({ example: 'string' })
    @IsString({ message: 'Id must be a string' })
    @IsNotEmpty({ message: 'Id is required' })
    id: number;

    @ApiProperty({ example: true })
    @IsBoolean({ message: 'Completed must be a boolean' })
    completed: boolean;
}
