import {
    registerDecorator,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator';
import { isValid, parse } from 'date-fns';

@ValidatorConstraint({ async: false })
export class IsTimeConstraint implements ValidatorConstraintInterface {
    validate(value: string): boolean {
        const timeRegex = /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/;
        const parseTime = parse(value, 'HH:mm:ss', new Date());
        return typeof value === 'string' && timeRegex.test(value) && isValid(parseTime);
    }

    defaultMessage(): string {
        return 'Time must be in the format HH:mm:ss';
    }
}

export function IsTime(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsTimeConstraint,
        });
    };
}
