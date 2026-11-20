import calculateDistance from "@frontend/utils/calculateDistance";
import {
  CAMPUS_CENTRE,
  CAMPUS_RADIUS_METRES,
  isOnCampus,
} from "@frontend/utils/campus";

const eastOfCentre = (metres: number) => {
  const metresPerDegreeLng =
    111320 * Math.cos((CAMPUS_CENTRE.lat * Math.PI) / 180);
  return {
    lat: CAMPUS_CENTRE.lat,
    lng: CAMPUS_CENTRE.lng + metres / metresPerDegreeLng,
  };
};

describe("isOnCampus", () => {
  it("includes the campus centre", () => {
    expect(isOnCampus(CAMPUS_CENTRE.lat, CAMPUS_CENTRE.lng)).toBe(true);
  });

  it("includes the start points used for the walking data", () => {
    // mock, west and east origins from the fixture
    expect(isOnCampus(-33.9179, 151.2298)).toBe(true);
    expect(isOnCampus(-33.917, 151.2262)).toBe(true);
    expect(isOnCampus(-33.9195, 151.235)).toBe(true);
  });

  it("includes points just inside the radius", () => {
    const { lat, lng } = eastOfCentre(CAMPUS_RADIUS_METRES - 50);
    expect(isOnCampus(lat, lng)).toBe(true);
  });

  it("excludes points outside the radius", () => {
    const { lat, lng } = eastOfCentre(1000);
    expect(
      calculateDistance(lat, lng, CAMPUS_CENTRE.lat, CAMPUS_CENTRE.lng)
    ).toBeGreaterThan(CAMPUS_RADIUS_METRES);
    expect(isOnCampus(lat, lng)).toBe(false);
  });

  it("excludes the Sydney CBD", () => {
    expect(isOnCampus(-33.8688, 151.2093)).toBe(false);
  });

  it("excludes missing or invalid coordinates", () => {
    expect(isOnCampus(undefined, undefined)).toBe(false);
    expect(isOnCampus(CAMPUS_CENTRE.lat, undefined)).toBe(false);
    expect(isOnCampus(Number.NaN, CAMPUS_CENTRE.lng)).toBe(false);
  });

  it("includes the buildings farthest from the centre", () => {
    // From /api/buildings; the farthest is ~570 m from the centre
    const farthestBuildings = [
      { id: "K-F31", lat: -33.91824916141684, lng: 151.23740997626882 },
      { id: "K-C29", lat: -33.916883931643184, lng: 151.23675216452733 },
      { id: "K-E4", lat: -33.916185, lng: 151.226284 },
    ];

    farthestBuildings.forEach(({ lat, lng }) => {
      expect(isOnCampus(lat, lng)).toBe(true);
    });
  });
});
