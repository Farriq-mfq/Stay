
import { parse, isValid, isBefore } from 'date-fns'
export function isValidDateString(dateString: string, format: string): boolean {
    if (dateString === undefined) return false
    const parsedDate = parse(dateString, format, new Date());

    return isValid(parsedDate);
}

export function isJSON(str: string): boolean {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}


export function validateDateRange(date1: string, date2: string): boolean {
    if (isValidDateString(date1, 'yyyy-MM-dd') && isValidDateString(date2, 'yyyy-MM-dd')) {
        const startDateParsed = parse(date1, "yyyy-MM-dd", new Date());
        const endDateParsed = parse(date2, "yyyy-MM-dd", new Date());
        return startDateParsed && endDateParsed && isBefore(startDateParsed, endDateParsed);

    }
    return false;
}