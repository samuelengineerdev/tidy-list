import { ApiProperty } from "@nestjs/swagger/dist/decorators"
import { Transform } from "class-transformer"
import { IsDate, IsNotEmpty, IsOptional, IsString } from "class-validator"

export class CreateTaskDto {
    @ApiProperty({ example: 'string' })
    @IsNotEmpty({ message: 'El nombre es obligatorio' })
    @IsString({ message: 'El nombre debe ser un texto' })
    @Transform(({ value }) => value.trim())
    name: string

    @ApiProperty({ example: 'string' })
    description: string

    @ApiProperty({ example: 'date' })
    @IsOptional()
    @IsDate({ message: 'Debe ser una fecha valida' })
    dueDate?: Date
    
    userId: string

    @ApiProperty({ example: 'string' })
    @IsNotEmpty({ message: 'El nombre es obligatorio' })
    @IsString({ message: 'El categoryId debe ser un texto' })
    categoryId: string
} 
