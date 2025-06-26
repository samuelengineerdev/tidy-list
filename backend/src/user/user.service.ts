import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { UserSettings } from 'generated/prisma';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserSettingsDto } from './dto/create-user-settings.dto';
import { UpdateUserSettingsDto } from './dto/update-user-settings.dto';

@Injectable()
export class UserService {
    constructor(private readonly prismaService: PrismaService) { }

    async getUserSettings(userId: string): Promise<UserSettings> {
        const userSettingsFound = await this.prismaService.userSettings.findFirst({ where: { userId } });
        if (!userSettingsFound) throw new NotFoundException(`El userSetting no fue encontrado por el userId: ${userId}`);

        return userSettingsFound;
    }

    async updateUserSettings(updateUserSettingsDto: UpdateUserSettingsDto): Promise<UserSettings> {
        const userSettingsFound = await this.prismaService.userSettings.findFirst({ where: { userId: updateUserSettingsDto.userId } });

        if (userSettingsFound) {
            return this.prismaService.userSettings.update({ data: updateUserSettingsDto, where: { userId: updateUserSettingsDto.userId } })
        } else {
            return this.prismaService.userSettings.create({ data: updateUserSettingsDto })
        }
    }
}
