import {
  formatDistanceRange,
  formatDurationRange,
  formatWalkingDistance,
  formatWalkingDuration,
  getDistanceRange,
  getDurationRange,
} from "@frontend/utils/walkingRange";

import walkingRoutes from "./fixtures/walkingRoutes.json";

describe("walking ranges", () => {
  describe("getDurationRange", () => {
    it("gives close buildings a narrow range", () => {
      expect(getDurationRange(30)).toEqual({ min: 1, max: 2 });
      expect(getDurationRange(90)).toEqual({ min: 1, max: 3 });
    });

    it("widens the range as the walk gets longer", () => {
      const widths = [120, 300, 480, 720, 900].map((seconds) => {
        const { min, max } = getDurationRange(seconds);
        return max - min;
      });

      widths.slice(1).forEach((width, i) => {
        expect(width).toBeGreaterThanOrEqual(widths[i]);
      });
      expect(widths[widths.length - 1]).toBeGreaterThan(widths[0]);
    });

    it("never shows less than 1 minute or an empty range", () => {
      expect(getDurationRange(0)).toEqual({ min: 1, max: 2 });
      expect(getDurationRange(5).max).toBeGreaterThan(getDurationRange(5).min);
    });
  });

  describe("getDistanceRange", () => {
    it("rounds to 50 m steps", () => {
      const { min, max } = getDistanceRange(668);
      expect(min % 50).toBe(0);
      expect(max % 50).toBe(0);
    });

    it("widens the range as the walk gets longer", () => {
      const near = getDistanceRange(180);
      const far = getDistanceRange(1250);
      expect(far.max - far.min).toBeGreaterThan(near.max - near.min);
    });

    it("always spans at least 50 m", () => {
      const { min, max } = getDistanceRange(10);
      expect(max - min).toBeGreaterThanOrEqual(50);
    });
  });

  describe("formatting", () => {
    it("formats ranges", () => {
      expect(formatDurationRange({ min: 7, max: 12 })).toBe("7–12 min");
      expect(formatDistanceRange({ min: 600, max: 950 })).toBe("600–950 m");
      expect(formatDistanceRange({ min: 1100, max: 1900 })).toBe("1100–1900 m");
    });

    it("shows a range for Matrix estimates", () => {
      expect(formatWalkingDuration(480, false)).toBe("7–12 min");
      expect(formatWalkingDistance(668, false)).toBe("600–1050 m");
    });

    it("shows exact numbers for a loaded route", () => {
      expect(formatWalkingDuration(578, true)).toBe("9 min");
      expect(formatWalkingDuration(40, true)).toBe("< 1 min");
      expect(formatWalkingDistance(711.3, true)).toBe("711 m");
    });
  });

  // The Matrix API and the Directions API disagree for the same trip
  // The card shows an estimated range for time and distance
  describe("Matrix vs Directions discrepancy (real campus data)", () => {
    const { trips } = walkingRoutes;

    it("has a meaningful sample", () => {
      expect(trips.length).toBeGreaterThanOrEqual(100);
    });

    it("documents that the APIs disagree", () => {
      const longest = Math.max(
        ...trips.map((trip) => trip.routeDuration - trip.matrixDuration)
      );
      // Directions was more than 5 minutes slower for some trips
      expect(longest).toBeGreaterThan(5 * 60);
    });

    it.each(trips)(
      "route time from $origin to $buildingId is inside the card's range",
      ({ matrixDuration, routeDuration }) => {
        const { min, max } = getDurationRange(matrixDuration);
        const routeMinutes = Math.max(1, Math.floor(routeDuration / 60));

        expect(routeMinutes).toBeGreaterThanOrEqual(min);
        expect(routeMinutes).toBeLessThanOrEqual(max);
      }
    );

    it.each(trips)(
      "route distance from $origin to $buildingId is inside the card's range",
      ({ matrixDistance, routeDistance }) => {
        const { min, max } = getDistanceRange(matrixDistance);

        expect(routeDistance).toBeGreaterThanOrEqual(min);
        expect(routeDistance).toBeLessThanOrEqual(max);
      }
    );
  });
});
