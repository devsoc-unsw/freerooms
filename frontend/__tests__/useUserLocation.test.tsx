import "@testing-library/jest-dom";

import { act, renderHook, waitFor } from "@testing-library/react";

import useUserLocation, { type UserLocation } from "../hooks/useUserLocation";

const createPosition = (
  latitude: number,
  longitude: number
): GeolocationPosition =>
  ({
    coords: {
      latitude,
      longitude,
    },
  }) as GeolocationPosition;

const createPositionError = (code: number): GeolocationPositionError =>
  ({
    code,
    PERMISSION_DENIED: 1,
    POSITION_UNAVAILABLE: 2,
    TIMEOUT: 3,
  }) as GeolocationPositionError;

const originalGeolocationDescriptor = Object.getOwnPropertyDescriptor(
  navigator,
  "geolocation"
);

const setGeolocationMock = (getCurrentPosition: jest.Mock) => {
  Object.defineProperty(navigator, "geolocation", {
    configurable: true,
    value: {
      getCurrentPosition,
    },
  });
};

const removeGeolocation = () => {
  delete (navigator as unknown as { geolocation?: Geolocation }).geolocation;
};

const restoreGeolocation = () => {
  if (originalGeolocationDescriptor) {
    Object.defineProperty(
      navigator,
      "geolocation",
      originalGeolocationDescriptor
    );
    return;
  }

  removeGeolocation();
};

afterEach(() => {
  restoreGeolocation();
});

describe("useUserLocation", () => {
  it("gets and stores the user's location when mounted", async () => {
    const getCurrentPosition = jest.fn((success: PositionCallback) => {
      success(createPosition(-33.91767, 151.23129));
    });
    setGeolocationMock(getCurrentPosition);

    const { result } = renderHook(() => useUserLocation());

    await waitFor(() => {
      expect(result.current.location).toEqual({
        lat: -33.91767,
        lng: 151.23129,
      });
    });

    expect(result.current.userLat).toBe(-33.91767);
    expect(result.current.userLng).toBe(151.23129);
    expect(result.current.isLocating).toBe(false);
    expect(result.current.locationError).toBeNull();
    expect(getCurrentPosition).toHaveBeenCalledWith(
      expect.any(Function),
      expect.any(Function),
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 30000,
      }
    );
  });

  it("stores a readable error when location permission is denied", async () => {
    const getCurrentPosition = jest.fn(
      (_success: PositionCallback, error: PositionErrorCallback) => {
        error(createPositionError(1));
      }
    );
    setGeolocationMock(getCurrentPosition);

    const { result } = renderHook(() => useUserLocation());

    await waitFor(() => {
      expect(result.current.locationError).toBe(
        "Location permission was denied. Enable location access in your browser settings."
      );
    });

    expect(result.current.location).toBeNull();
    expect(result.current.isLocating).toBe(false);
  });

  it("refreshes the location and exposes the loading state", async () => {
    let refreshSuccess: PositionCallback | undefined;

    const getCurrentPosition = jest
      .fn()
      .mockImplementationOnce((success: PositionCallback) => {
        success(createPosition(-33.91767, 151.23129));
      })
      .mockImplementationOnce((success: PositionCallback) => {
        refreshSuccess = success;
      });
    setGeolocationMock(getCurrentPosition);

    const { result } = renderHook(() => useUserLocation());

    await waitFor(() => {
      expect(result.current.location).toEqual({
        lat: -33.91767,
        lng: 151.23129,
      });
    });

    let refreshPromise!: Promise<UserLocation>;

    act(() => {
      refreshPromise = result.current.refreshLocation();
    });

    expect(result.current.isLocating).toBe(true);
    expect(result.current.locationError).toBeNull();
    expect(refreshSuccess).toBeDefined();

    const refreshedLocation = {
      lat: -33.918,
      lng: 151.232,
    };
    let returnedLocation: UserLocation | undefined;

    await act(async () => {
      refreshSuccess?.(
        createPosition(refreshedLocation.lat, refreshedLocation.lng)
      );
      returnedLocation = await refreshPromise;
    });

    expect(returnedLocation).toEqual(refreshedLocation);
    expect(result.current.location).toEqual(refreshedLocation);
    expect(result.current.userLat).toBe(refreshedLocation.lat);
    expect(result.current.userLng).toBe(refreshedLocation.lng);
    expect(result.current.isLocating).toBe(false);
    expect(getCurrentPosition).toHaveBeenCalledTimes(2);
  });

  it("reports refresh timeouts and allows the error to be cleared", async () => {
    const getCurrentPosition = jest
      .fn()
      .mockImplementationOnce((success: PositionCallback) => {
        success(createPosition(-33.91767, 151.23129));
      })
      .mockImplementationOnce(
        (_success: PositionCallback, error: PositionErrorCallback) => {
          error(createPositionError(3));
        }
      );
    setGeolocationMock(getCurrentPosition);

    const { result } = renderHook(() => useUserLocation());

    await waitFor(() => {
      expect(result.current.location).not.toBeNull();
    });

    let refreshError: unknown;

    await act(async () => {
      try {
        await result.current.refreshLocation();
      } catch (error) {
        refreshError = error;
      }
    });

    expect(refreshError).toBeInstanceOf(Error);
    expect((refreshError as Error).message).toBe(
      "Getting your current location took too long. Please try again."
    );
    expect(result.current.locationError).toBe(
      "Getting your current location took too long. Please try again."
    );
    expect(result.current.isLocating).toBe(false);

    act(() => {
      result.current.clearLocationError();
    });

    expect(result.current.locationError).toBeNull();
  });

  it("reports when the browser does not support geolocation", async () => {
    removeGeolocation();

    const { result } = renderHook(() => useUserLocation());

    await waitFor(() => {
      expect(result.current.locationError).toBe(
        "Geolocation is not supported by your browser."
      );
    });

    expect(result.current.location).toBeNull();
    expect(result.current.isLocating).toBe(false);
  });
});
