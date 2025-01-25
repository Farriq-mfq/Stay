import {
    registerDecorator,
    ValidationArguments,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator';
import { format, isAfter } from 'date-fns';

@ValidatorConstraint({ async: false })
export class IsRangeTimeConstraint implements ValidatorConstraintInterface {
    validate(value: string, args: ValidationArguments): boolean {
        const relatedValue = (args.object as any)["start_time"];
        const referenceDate = format(Date.now(), 'yyyy-MM-dd'); // Same reference date
        const parsedStartTime = format(`${referenceDate} ${value}`, 'yyyy-MM-dd HH:mm:ss');
        const parsedEndTime = format(`${referenceDate} ${relatedValue}`, 'yyyy-MM-dd HH:mm:ss');

        return !isAfter(parsedEndTime, parsedStartTime);
    }

    defaultMessage(): string {
        return 'End time must be after start time';
    }
}

export function IsRangeTime(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsRangeTimeConstraint,
        });
    };
}
