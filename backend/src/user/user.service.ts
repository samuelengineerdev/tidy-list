import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { UserSettings } from 'generated/prisma';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserSettingsDto } from './dto/create-user-settings.dto';
import { UpdateUserSettingsDto } from './dto/update-user-settings.dto';

@Injectable()
export class UserService {
    constructor(private readonly prismaService: PrismaService) { }

    async existUserSettings(userId: string): Promise<UserSettings> {
        const userSettingsFound = await this.prismaService.userSettings.findFirst({ where: { userId } });
        if (!userSettingsFound) throw new NotFoundException(`El userSetting no fue encontrado por el userId: ${userId}`);

        return userSettingsFound;
    }

    async createUserSettings(createUserSettingsDto: CreateUserSettingsDto) {
        const userSettingsFound = await this.prismaService.userSettings.findFirst({ where: { userId: createUserSettingsDto.userId } });
        if (userSettingsFound) throw new ConflictException(`Este usuario ya tiene una configuracion creada`);

        return await this.prismaService.userSettings.create({ data: createUserSettingsDto });
    }

    async getUserSettings(userId: string): Promise<UserSettings> {
        return await this.existUserSettings(userId);
    }

    async updateUserSettings(updateUserSettingsDto: UpdateUserSettingsDto): Promise<UserSettings> {
        await this.existUserSettings(updateUserSettingsDto.userId);

        return this.prismaService.userSettings.update({ data: updateUserSettingsDto, where: { userId: updateUserSettingsDto.userId } })
    }
}
