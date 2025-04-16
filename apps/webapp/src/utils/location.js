export async function getDetailLocation(lat, lon) {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error('Gagal mengambil data lokasi');
    }

    const data = await response.json()
    return data
}

function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371e3;
    const toRad = (deg) => deg * Math.PI / 180;

    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
}

export function isWithinRange(referencePoint, targetPoint, rangeInMeters = 100) {
    const distance = calculateDistance(
        referencePoint.latitude,
        referencePoint.longitude,
        targetPoint.latitude,
        targetPoint.longitude
    );

    return distance.toFixed(2) <= rangeInMeters;
}
