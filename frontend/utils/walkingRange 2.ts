/**
 * Walking time/distance ranges for Mapbox Matrix estimates.
 *
 * Matrix numbers are quicker to fetch than a Directions route but don't match
 * it exactly: across 132 sampled campus trips the actual route was up to 60%
 * longer (and occasionally ~15% shorter). These ranges cover all of those
 * samples, see __tests__/map/walkingRange.test.tsx.
 */

export type WalkingRange = { min: number; max: number };

const DURATION_LOWER = 0.9;
const DURATION_UPPER = 1.4;
const DISTANCE_LOWER = 0.9;
const DISTANCE_UPPER = 1.5;
const DISTANCE_STEP = 50;

// Minutes, widening as the walk gets longer (e.g. 2 min -> 1-3, 15 min -> 13-21)
export const getDurationRange = (durationSeconds: number): WalkingRange => {
  const minutes = durationSeconds / 60;
  const min = Math.max(1, Math.floor(minutes * DURATION_LOWER));
  const max = Math.max(min + 1, Math.ceil(minutes * DURATION_UPPER));

  return { min, max };
};

// Metres rounded to 50 m, widening as the walk gets longer
export const getDistanceRange = (distanceMeters: number): WalkingRange => {
  const min =
    Math.floor((distanceMeters * DISTANCE_LOWER) / DISTANCE_STEP) *
    DISTANCE_STEP;
  const max = Math.max(
    min + DISTANCE_STEP,
    Math.ceil((distanceMeters * DISTANCE_UPPER) / DISTANCE_STEP) * DISTANCE_STEP
  );

  return { min, max };
};

export const formatDurationRange = ({ min, max }: WalkingRange): string =>
  `${min}–${max} min`;

export const formatDistanceRange = ({ min, max }: WalkingRange): string =>
  `${min}–${max} m`;

// Exact values, used once a Directions route has loaded
export const formatExactDuration = (durationSeconds: number): string => {
  const minutes = Math.floor(durationSeconds / 60);
  return minutes < 1 ? "< 1 min" : `${minutes} min`;
};

export const formatExactDistance = (distanceMeters: number): string =>
  `${Math.round(distanceMeters)} m`;

// Range for a Matrix estimate, exact text for a loaded route
export const formatWalkingDuration = (
  durationSeconds: number,
  isExact: boolean
): string =>
  isExact
    ? formatExactDuration(durationSeconds)
    : formatDurationRange(getDurationRange(durationSeconds));

export const formatWalkingDistance = (
  distanceMeters: number,
  isExact: boolean
): string =>
  isExact
    ? formatExactDistance(distanceMeters)
    : formatDistanceRange(getDistanceRange(distanceMeters));
