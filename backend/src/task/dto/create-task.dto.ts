import { ApiProperty } from "@nestjs/swagger/dist/decorators"
import { Transform, Type } from "class-transformer"
import { IsDate, IsNotEmpty, IsOptional, IsString } from "class-validator"

export class CreateTaskDto {
    @ApiProperty({ type: 'string' })
    @IsNotEmpty({ message: 'Name is required' })
    @IsString({ message: 'Name must be a string' })
    @Transform(({ value }) => value.trim())
    name: string

    @ApiProperty({ type: 'string' })
    @IsOptional()
    @IsString({ message: 'Description must be a string' })
    @Transform(({ value }) => value?.trim())
    description?: string

    @ApiProperty({ type: 'string', format: 'date-time' })
    @IsOptional()
    @Type(() => Date)
    @IsDate({ message: 'Must be a valid date' })
    dueDate?: Date

    userId: number

    @ApiProperty({ type: 'string' })
    @IsNotEmpty({ message: 'Category ID is required' })
    @IsString({ message: 'CategoryId must be a string' })
    categoryId: number
}
