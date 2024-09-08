import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateSettingsDto } from './admin.dto';
import { Settings } from '.prisma/client';
import { SETTING_KEY } from './enums';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  public updateSettings(
    updateSettingsDto: UpdateSettingsDto,
  ): Promise<Settings> {
    return this.prisma.settings.upsert({
      where: { key: updateSettingsDto.key },
      create: {
        key: updateSettingsDto.key,
        numeric_value:
          updateSettingsDto.key === SETTING_KEY.MINIMUM_FEE
            ? updateSettingsDto.value
            : null,
        percentage_value:
          updateSettingsDto.key === SETTING_KEY.SERVICE_FEE_RATE
            ? Number(updateSettingsDto.value)
            : null,
      },
      update: {
        key: updateSettingsDto.key,
        numeric_value:
          updateSettingsDto.key === SETTING_KEY.MINIMUM_FEE
            ? updateSettingsDto.value
            : null,
        percentage_value:
          updateSettingsDto.key === SETTING_KEY.SERVICE_FEE_RATE
            ? Number(updateSettingsDto.value)
            : null,
      },
    });
  }
}
