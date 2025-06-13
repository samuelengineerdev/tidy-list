import { ApiProperty } from "@nestjs/swagger"
import { Transform } from "class-transformer"
import { IsBoolean, IsNotEmpty, IsString } from "class-validator"
import { CreateUserSettingsDto } from "./create-user-settings.dto"

export class UpdateUserSettingsDto extends CreateUserSettingsDto {
    @ApiProperty({ example: 'string' })
    @IsNotEmpty({ message: 'El id es obligatorio' })
    @IsString({ message: 'El id debe ser string' })
    id: string
}