import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateTaskDto } from './create-task.dto';
import { IsBoolean, IsInt, IsNotEmpty, IsString } from 'class-validator';

export class UpdateTaskDto extends PartialType(CreateTaskDto) {
    @ApiProperty({ type: 'number' })
    @IsInt({ message: 'Id must be a number' })
    @IsNotEmpty({ message: 'Id is required' })
    id: number;

    @ApiProperty({ type: 'boolean' })
    @IsBoolean({ message: 'Completed must be a boolean' })
    completed: boolean;
}
