import { ApiProperty } from "@nestjs/swagger"
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from "class-validator"

export class CreateUserSettingsDto {
    @ApiProperty({ example: 'boolean' })
   @IsBoolean({ message: 'darkMode must be a boolean' })
    @IsOptional()
    darkMode: boolean

    userId: number
}