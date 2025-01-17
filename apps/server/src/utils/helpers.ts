
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


export const parseDatabaseUrl = (dbUrl) => {
    const regex =
        /^(?<protocol>postgres(?:ql)?):\/\/(?<username>[^:]+):(?<password>[^@]*)@(?<host>[^:\/]+)(?::(?<port>\d+))?\/(?<database>[\w\-]+)(?:\?(?<params>.+))?$/;

    const match = dbUrl.match(regex);

    if (!match || !match.groups) {
        throw new Error(
            "Invalid database URL format. Expected format: postgresql://username:password@host:port/database?params"
        );
    }

    // Parse query parameters (if any)
    const queryParams = {};
    if (match.groups.params) {
        match.groups.params.split("&").forEach((param) => {
            const [key, value] = param.split("=");
            queryParams[key] = value;
        });
    }

    return {
        protocol: match.groups.protocol,
        username: match.groups.username,
        password: match.groups.password || null,
        host: match.groups.host,
        port: match.groups.port ? parseInt(match.groups.port, 10) : 5432, // Default port
        database: match.groups.database,
        queryParams,
    };
};
