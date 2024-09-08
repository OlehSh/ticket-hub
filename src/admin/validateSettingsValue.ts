import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { SETTING_KEY } from './enums';
const errorMessages = {
  [SETTING_KEY.SERVICE_FEE_RATE]: 'Service fee rate should be between 0 and 100',
  [SETTING_KEY.MINIMUM_FEE]: 'Minimum fee should be between 0 and 50',
}
export function ValidateSettingsValue(property: string, options?: ValidationOptions) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: {
        message: (args: ValidationArguments) => {
          return errorMessages[(args.object as any)[property]];
        },
        ...options,
      },
      constraints: [property],
      validator: ValidateKeyValue,
    });
  };
}

@ValidatorConstraint({ name: 'ValidateSettingsValue' })
export class ValidateKeyValue implements ValidatorConstraintInterface {
  validate(value: any, args?: ValidationArguments): boolean {
    const [relatedPropertyName] = args.constraints;
    const relatedValue = (args.object as any)[relatedPropertyName];
    switch (relatedValue) {
      case SETTING_KEY.SERVICE_FEE_RATE:
        if (isNaN(value)) {
          return false;
        }
        return !(parseFloat(value) < 0 || parseFloat(value) > 100);
      case SETTING_KEY.MINIMUM_FEE:
        if (isNaN(value)) {
          return false;
        }
        return parseFloat(value) >= 0 && parseFloat(value) <= 50;
      default:
        return false;
    }
  }
}