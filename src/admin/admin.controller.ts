import { Body, Controller, Post } from '@nestjs/common';
import { AdminService } from './admin.service';
import { UpdateSettingsDto } from './admin.dto';
import { settings } from '.prisma/client';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('/settings')
  updateSettings(
    @Body() updateSettingsDto: UpdateSettingsDto,
  ): Promise<settings> {
    return this.adminService.updateSettings(updateSettingsDto);
  }
}
