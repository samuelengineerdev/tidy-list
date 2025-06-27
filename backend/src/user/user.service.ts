import { Injectable, NotFoundException } from '@nestjs/common';
import { UserSettings } from 'generated/prisma';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateUserSettingsDto } from './dto/update-user-settings.dto';

@Injectable()
export class UserService {
    constructor(private readonly prismaService: PrismaService) { }

    async getUserSettings(userId: number): Promise<UserSettings> {
        const userSettingsFound = await this.prismaService.userSettings.findFirst({ where: { userId } });
        if (!userSettingsFound) throw new NotFoundException(`User settings not found for userId: ${userId}`);

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
