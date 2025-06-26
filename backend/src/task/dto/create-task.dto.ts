import { ApiProperty } from "@nestjs/swagger/dist/decorators"
import { Transform, Type } from "class-transformer"
import { IsDate, IsNotEmpty, IsOptional, IsString } from "class-validator"

export class CreateTaskDto {
    @ApiProperty({ type: 'string' })
    @IsNotEmpty({ message: 'El nombre es obligatorio' })
    @IsString({ message: 'El nombre debe ser un texto' })
    @Transform(({ value }) => value.trim())
    name: string

    @ApiProperty({ type: 'string' })
    @IsOptional()
    @IsString({ message: 'La descripción debe ser un texto' })
    @Transform(({ value }) => value?.trim())
    description?: string

    @ApiProperty({ type: 'string', format: 'date-time' })
    @IsOptional()
    @Type(() => Date)
    @IsDate({ message: 'Debe ser una fecha valida' })
    dueDate?: Date

    userId: string

    @ApiProperty({ type: 'string' })
    @IsNotEmpty({ message: 'El nombre es obligatorio' })
    @IsString({ message: 'El categoryId debe ser un texto' })
    categoryId: string
} 
