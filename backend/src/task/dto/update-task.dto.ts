import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateTaskDto } from './create-task.dto';
import { IsBoolean, IsInt, IsNotEmpty, IsString } from 'class-validator';

export class UpdateTaskDto extends PartialType(CreateTaskDto) {
    @ApiProperty({ example: 'string' })
    @IsInt({ message: 'Id must be a number' })
    @IsNotEmpty({ message: 'Id is required' })
    id: number;

    @ApiProperty({ example: true })
    @IsBoolean({ message: 'Completed must be a boolean' })
    completed: boolean;
}
