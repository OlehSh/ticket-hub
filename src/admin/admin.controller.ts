import { Body, Controller, Post } from '@nestjs/common';
import { AdminService } from './admin.service';
import { UpdateSettingsDto } from './admin.dto';
import { Settings } from '.prisma/client';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  //TODO add guards to validate access only for admins
  @Post('/settings')
  updateSettings(
    @Body() updateSettingsDto: UpdateSettingsDto,
  ): Promise<Settings> {
    return this.adminService.updateSettings(updateSettingsDto);
  }
}
