function calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
): number {
    const R = 6371e3; // Earth's radius in meters
    const toRad = (deg: number): number => (deg * Math.PI) / 180;

    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
}

export type GeoPoint = {
    latitude: number;
    longitude: number;
};

export function isWithinRange(
    referencePoint: GeoPoint,
    targetPoint: GeoPoint,
    rangeInMeters: number = 100
): boolean {
    const distance = calculateDistance(
        referencePoint.latitude,
        referencePoint.longitude,
        targetPoint.latitude,
        targetPoint.longitude
    );

    return distance <= rangeInMeters;
}
