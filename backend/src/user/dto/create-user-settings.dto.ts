import { ApiProperty } from "@nestjs/swagger"
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from "class-validator"

export class CreateUserSettingsDto {
    @ApiProperty({ example: 'boolean' })
    @IsBoolean({ message: 'El darkMode debe ser string' })
    @IsOptional()
    darkMode: boolean

    userId: string
}