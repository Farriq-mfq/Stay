import { ValidationError } from "class-validator";

export const formattedErrors = (errors: ValidationError[]) => {
    const formattedErrors = errors.reduce((acc, err) => {
        const constraints = Object.values(err.constraints);
        acc[err.property] = constraints;
        return acc;
    }, {});
    return formattedErrors;
};