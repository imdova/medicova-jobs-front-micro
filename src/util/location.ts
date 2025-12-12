import { Country } from "@/types";

function haversine(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const R = 6371; // Radius of Earth in km
  const toRad = (value: number) => (value * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

export function getClosestCountries(
  myLat: number,
  myLon: number,
  countries: Country[],
  count: number = 20,
): Country[] {
  const distances = countries.map((country) => ({
    ...country,
    distance: haversine(
      myLat,
      myLon,
      Number(country.latitude),
      Number(country.longitude),
    ),
  }));

  return distances.sort((a, b) => a.distance - b.distance).slice(0, count);
}
