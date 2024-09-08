import { Allow, IsDefined, IsIn, IsOptional, IsString } from 'class-validator';
import { ValidateSettingsValue } from './validateSettingsValue';
import { SETTING_KEY } from './enums';

export class UpdateSettingsDto {
  @IsDefined()
  @IsString()
  @IsIn(Object.values(SETTING_KEY))
  key: string;

  @IsDefined()
  @ValidateSettingsValue('key')
  value: string;
}
