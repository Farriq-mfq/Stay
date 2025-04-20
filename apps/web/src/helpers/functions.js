export function isEmptyObject(obj) {
    for (var prop in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, prop)) {
            return false;
        }
    }

    return true
}



export function detectBrowser(userAgent) {
    if (/chrome/i.test(userAgent) && !/edg/i.test(userAgent) && !/opr/i.test(userAgent)) {
        return "Google Chrome";
    } else if (/edg/i.test(userAgent)) {
        return "Microsoft Edge";
    } else if (/firefox/i.test(userAgent)) {
        return "Mozilla Firefox";
    } else if (/safari/i.test(userAgent) && !/chrome/i.test(userAgent)) {
        return "Apple Safari";
    } else if (/opr|opera/i.test(userAgent)) {
        return "Opera";
    } else if (/msie|trident/i.test(userAgent)) {
        return "Internet Explorer";
    }
    return "Unknown Browser";
}


export function isJSON(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

