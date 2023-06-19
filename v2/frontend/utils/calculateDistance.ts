/**
 * Calculate distance to the neatest metre between two points using Haversine formula
 * From https://stackoverflow.com/a/21623206
 */
export default function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) {
  const pi = 0.017453292519943295;    // Math.PI / 180
  const cos = Math.cos;
  const a = 0.5 - cos((lat2 - lat1) * pi)/2 +
    cos(lat1 * pi) * cos(lat2 * pi) *
    (1 - cos((lon2 - lon1) * pi))/2;

  return Math.round(12756320 * Math.asin(Math.sqrt(a))); // 2 * R; R = 6378160 m
}
