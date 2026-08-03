import "@testing-library/jest-dom";

import type { Building } from "@common/types";
import { act, renderHook } from "@testing-library/react";

import useMapboxRoute, { type RouteGeometry } from "../hooks/useMapboxRoute";

jest.mock("../config", () => ({
  MAPBOX_ACCESS_TOKEN: "pk.test-token",
}));

const origin = {
  lat: -33.9171,
  lng: 151.2302,
};

const destinationBuilding: Building = {
  id: "K17",
  name: "Electrical Engineering Building",
  lat: -33.9181,
  long: 151.2314,
  aliases: [],
};

const routeGeometry: RouteGeometry = {
  type: "LineString",
  coordinates: [
    [origin.lng, origin.lat],
    [destinationBuilding.long, destinationBuilding.lat],
  ],
};

const successfulResponseBody = {
  code: "Ok",
  routes: [
    {
      distance: 735,
      duration: 542,
      geometry: routeGeometry,
    },
  ],
};

const createResponse = (body: unknown, ok = true): Response =>
  ({
    ok,
    json: jest.fn().mockResolvedValue(body),
  }) as unknown as Response;

const createDeferred = <T,>() => {
  let resolve!: (value: T) => void;
  let reject!: (reason?: unknown) => void;

  const promise = new Promise<T>((promiseResolve, promiseReject) => {
    resolve = promiseResolve;
    reject = promiseReject;
  });

  return { promise, resolve, reject };
};

describe("useMapboxRoute", () => {
  const fetchMock = jest.fn<
    ReturnType<typeof fetch>,
    Parameters<typeof fetch>
  >();
  const originalFetch = global.fetch;

  beforeEach(() => {
    fetchMock.mockReset();
    global.fetch = fetchMock;
  });

  afterAll(() => {
    global.fetch = originalFetch;
  });

  it("starts without a route, summary, loading state, or error", () => {
    const { result } = renderHook(() => useMapboxRoute());

    expect(result.current.route).toBeNull();
    expect(result.current.routeSummary).toBeNull();
    expect(result.current.isRouteLoading).toBe(false);
    expect(result.current.routeError).toBeNull();
  });

  it("requests and stores a walking route", async () => {
    fetchMock.mockResolvedValue(createResponse(successfulResponseBody));

    const { result } = renderHook(() => useMapboxRoute());
    let routeWasCreated = false;

    await act(async () => {
      routeWasCreated = await result.current.calculateRoute({
        origin,
        destinationBuilding,
      });
    });

    expect(routeWasCreated).toBe(true);
    expect(fetchMock).toHaveBeenCalledTimes(1);

    const [requestUrl, requestOptions] = fetchMock.mock.calls[0];
    const url = new URL(requestUrl.toString());

    expect(url.pathname).toBe(
      `/directions/v5/mapbox/walking/${origin.lng},${origin.lat};${destinationBuilding.long},${destinationBuilding.lat}`
    );
    expect(url.searchParams.get("access_token")).toBe("pk.test-token");
    expect(url.searchParams.get("geometries")).toBe("geojson");
    expect(url.searchParams.get("overview")).toBe("full");
    expect(url.searchParams.get("steps")).toBe("false");
    expect(requestOptions?.method).toBe("GET");
    expect(requestOptions?.signal).toBeInstanceOf(AbortSignal);

    expect(result.current.route).toEqual({
      type: "Feature",
      properties: {},
      geometry: routeGeometry,
    });
    expect(result.current.routeSummary).toEqual({
      destinationBuildingId: destinationBuilding.id,
      destinationName: destinationBuilding.name,
      distanceMeters: 735,
      durationSeconds: 542,
    });
    expect(result.current.isRouteLoading).toBe(false);
    expect(result.current.routeError).toBeNull();
  });

  it("sets the loading state while the request is pending", async () => {
    const deferredResponse = createDeferred<Response>();
    fetchMock.mockReturnValue(deferredResponse.promise);

    const { result } = renderHook(() => useMapboxRoute());
    let routePromise!: Promise<boolean>;

    act(() => {
      routePromise = result.current.calculateRoute({
        origin,
        destinationBuilding,
      });
    });

    expect(result.current.isRouteLoading).toBe(true);

    await act(async () => {
      deferredResponse.resolve(createResponse(successfulResponseBody));
      await routePromise;
    });

    expect(result.current.isRouteLoading).toBe(false);
  });

  it("does not fetch when a coordinate is invalid", async () => {
    const { result } = renderHook(() => useMapboxRoute());
    let routeWasCreated = true;

    await act(async () => {
      routeWasCreated = await result.current.calculateRoute({
        origin: {
          lat: Number.NaN,
          lng: origin.lng,
        },
        destinationBuilding,
      });
    });

    expect(routeWasCreated).toBe(false);
    expect(fetchMock).not.toHaveBeenCalled();
    expect(result.current.routeError).toBe(
      "Directions could not be calculated because one or more coordinates are invalid."
    );
  });

  it("stores the error returned by Mapbox", async () => {
    fetchMock.mockResolvedValue(
      createResponse(
        {
          code: "InvalidInput",
          message: "No walking route was found.",
        },
        false
      )
    );

    const { result } = renderHook(() => useMapboxRoute());
    let routeWasCreated = true;

    await act(async () => {
      routeWasCreated = await result.current.calculateRoute({
        origin,
        destinationBuilding,
      });
    });

    expect(routeWasCreated).toBe(false);
    expect(result.current.route).toBeNull();
    expect(result.current.routeSummary).toBeNull();
    expect(result.current.routeError).toBe("No walking route was found.");
    expect(result.current.isRouteLoading).toBe(false);
  });

  it("rejects a response without a usable route", async () => {
    fetchMock.mockResolvedValue(
      createResponse({
        code: "Ok",
        routes: [],
      })
    );

    const { result } = renderHook(() => useMapboxRoute());
    let routeWasCreated = true;

    await act(async () => {
      routeWasCreated = await result.current.calculateRoute({
        origin,
        destinationBuilding,
      });
    });

    expect(routeWasCreated).toBe(false);
    expect(result.current.routeError).toBe(
      "Mapbox did not return a usable walking route."
    );
  });

  it("aborts the previous request when a new route is requested", async () => {
    const firstSignal = { current: null as AbortSignal | null };

    fetchMock
      .mockImplementationOnce((_input, options) => {
        firstSignal.current = options?.signal ?? null;

        return new Promise<Response>((_resolve, reject) => {
          firstSignal.current?.addEventListener("abort", () => {
            reject(new DOMException("Request aborted", "AbortError"));
          });
        });
      })
      .mockResolvedValueOnce(createResponse(successfulResponseBody));

    const secondBuilding: Building = {
      ...destinationBuilding,
      id: "K18",
      name: "Second Building",
      lat: -33.9185,
      long: 151.232,
    };

    const { result } = renderHook(() => useMapboxRoute());
    let firstRequest!: Promise<boolean>;
    let secondRouteWasCreated = false;

    act(() => {
      firstRequest = result.current.calculateRoute({
        origin,
        destinationBuilding,
      });
    });

    await act(async () => {
      secondRouteWasCreated = await result.current.calculateRoute({
        origin,
        destinationBuilding: secondBuilding,
      });
    });

    await expect(firstRequest).resolves.toBe(false);
    expect(firstSignal.current?.aborted).toBe(true);
    expect(secondRouteWasCreated).toBe(true);
    expect(result.current.routeSummary?.destinationBuildingId).toBe(
      secondBuilding.id
    );
  });

  it("clears the route, summary, and error", async () => {
    fetchMock.mockResolvedValue(createResponse(successfulResponseBody));

    const { result } = renderHook(() => useMapboxRoute());

    await act(async () => {
      await result.current.calculateRoute({
        origin,
        destinationBuilding,
      });
    });

    act(() => {
      result.current.clearRoute();
    });

    expect(result.current.route).toBeNull();
    expect(result.current.routeSummary).toBeNull();
    expect(result.current.routeError).toBeNull();
    expect(result.current.isRouteLoading).toBe(false);
  });

  it("clears a route error", async () => {
    fetchMock.mockResolvedValue(
      createResponse(
        {
          code: "InvalidInput",
          message: "No walking route was found.",
        },
        false
      )
    );

    const { result } = renderHook(() => useMapboxRoute());

    await act(async () => {
      await result.current.calculateRoute({
        origin,
        destinationBuilding,
      });
    });

    expect(result.current.routeError).toBe("No walking route was found.");

    act(() => {
      result.current.clearRouteError();
    });

    expect(result.current.routeError).toBeNull();
  });
});
