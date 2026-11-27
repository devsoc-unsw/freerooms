import { bookingsPaginationQuerySchema, BookingType, searchQuerySchema } from "common/types";
import type { Request } from "express";

import {
  parseBookingFilters,
  parseSearchFilters,
  parseStatusFilters,
} from "../src/requestParsers";

const request = (query: Record<string, string>): Request =>
  ({ query }) as Request;

describe("Multiselect room filters", () => {
  it("parses multiple room usages and locations", () => {
    const filters = parseStatusFilters(
      request({
        usage: "LAB,TUSM",
        location: "upper,lower",
        capacity: "50",
        id: "true,false",
      }),
    );

    expect(filters).toEqual({
      usage: ["LAB", "TUSM"],
      location: ["lower", "upper"],
      capacity: 50,
      id: [false, true],
    });
  });

  it("supports single selections", () => {
    expect(parseStatusFilters(request({ usage: "LAB" }))).toEqual({
      usage: ["LAB"],
    });
  });

  it("rejects invalid room usages", () => {
    expect(() => parseStatusFilters(request({ usage: "LAB,INVALID" }))).toThrow(
      "Invalid room usage",
    );
  });

  it("rejects invalid ID selections", () => {
    expect(() => parseStatusFilters(request({ id: "true,invalid" }))).toThrow(
      "Invalid ID required",
    );
  });

  it("supports multiselect in room search", () => {
    expect(
      parseSearchFilters(
        request({
          usage: "LAB,TUSM",
          buildingId: "K-K17",
        }),
      ),
    ).toEqual({
      usage: ["LAB", "TUSM"],
      buildingId: "K-K17",
    });
  });
});

describe("Multiselect booking filters", () => {
  it("parses multiple booking types", () => {
    expect(
      parseBookingFilters(
        request({
          bookingType: "TUTORIAL,LECTURE",
          plannedSize: "50",
        }),
      ),
    ).toEqual({
      bookingType: [BookingType.LECTURE, BookingType.TUTORIAL],
      plannedSize: 50,
    });
  });

  it("removes duplicate selections", () => {
    expect(
      parseBookingFilters(
        request({
          bookingType: "LECTURE,TUTORIAL,LECTURE",
        }),
      ),
    ).toEqual({
      bookingType: [BookingType.LECTURE, BookingType.TUTORIAL],
    });
  });

  it("rejects invalid booking types", () => {
    expect(() =>
      parseBookingFilters(request({ bookingType: "LECTURE,INVALID" })),
    ).toThrow("Invalid booking type");
  });

  it("rejects invalid campus locations", () => {
    expect(() =>
      parseBookingFilters(request({ location: "lower,invalid" })),
    ).toThrow("Invalid location");
  });

  it("returns null when no filters are provided", () => {
    expect(parseBookingFilters(request({}))).toBeNull();
  });
});


describe("Multiselect API query validation", () => {
  it("accepts multiple locations in room status queries", () => {
    expect(
      statusQuerySchema.safeParse({
        location: "upper,lower",
      }).success,
    ).toBe(true);
  });

  it("accepts both ID requirements", () => {
    expect(
      statusQuerySchema.safeParse({
        id: "true,false",
      }).success,
    ).toBe(true);
  });

  it("accepts multiple filters in room search queries", () => {
    expect(
      searchQuerySchema.safeParse({
        location: "upper,lower",
        usage: "LAB,TUSM",
        id: "true,false",
      }).success,
    ).toBe(true);
  });

  it("accepts multiple locations and booking types", () => {
    expect(
      bookingsPaginationQuerySchema.safeParse({
        location: "upper,lower",
        bookingType: "LECTURE,TUTORIAL",
      }).success,
    ).toBe(true);
  });
});
