// Interface to the Hasura GraphQL API
import type { TypedDocumentNode } from "@graphql-typed-document-node/core";
import { UPPER_CAMPUS_GRID_START } from "common/constants";
import parseDates from "common/parseDates";
import {
  Booking,
  BookingCursor,
  BookingDetails,
  BookingListModule,
  BookingPaginationParams,
  BookingsEventResponse,
  BookingSummary,
  BookingType,
  PaginatedBooking,
} from "common/types";
import { parse } from "graphql";
import { gql, GraphQLClient } from "graphql-request";

import { GRAPHQL_API } from "./config";

///////////////////////////////////////////////////////////////
// Helper functions for making and processing GQL requests

const client = new GraphQLClient(GRAPHQL_API);

type GraphQLValue =
  | string
  | number
  | boolean
  | null
  | GraphQLValue[]
  | { [key: string]: GraphQLValue };

/**
 * Make a request to the GraphQL API
 */
const doRequest = async <T>(
  queryStr: string,
  variables: Record<string, GraphQLValue> = {}
): Promise<T> => {
  // Make the request
  const query: TypedDocumentNode<T> = parse(gql`
    ${queryStr}
  `);
  const data = await client.request(query, variables);

  // Parse dates
  return parseDates(data);
};

///////////////////////////////////////////////////////////////

type BookingsInRangeRes = {
  rooms: Array<{
    id: string;
    name: string;
    bookings: Booking[];
  }>;
};

/**
 * Query all bookings in the range start to end, grouped by room
 */
export const queryBookingsInRange = async (
  start: Date,
  end: Date
): Promise<BookingsInRangeRes> => {
  const query = `
    query BookingsInRange($start: timestamptz, $end: timestamptz) {
      rooms {
        id
        name
        bookings(where: {start: {_lte: $end}, end: {_gte: $start}}, order_by: {start: asc}) {
          name
          bookingType
          start
          end
        }
      }
    }
  `;

  const variables = {
    start: start.toISOString(),
    end: end.toISOString(),
  };

  return await doRequest<BookingsInRangeRes>(query, variables);
};

///////////////////////////////////////////////////////////////

type BuildingsAndRoomsRes = {
  buildings: Array<{
    id: string;
    name: string;
    lat: number;
    long: number;
    aliases: string[];
    rooms: Array<{
      id: string;
      name: string;
      abbr: string;
      school: string;
      usage: string;
      capacity: number;
    }>;
  }>;
};

/**
 * Query information for all buildings and rooms
 */
export const queryBuildingsAndRooms =
  async (): Promise<BuildingsAndRoomsRes> => {
    const query = `
    query BuildingAndRooms {
      buildings(order_by: {name: asc}) {
        id
        name
        lat
        long
        aliases
        rooms(order_by: {id: asc}) {
          id
          name
          abbr
          school
          usage
          capacity
        }
      }
    }
  `;

    return await doRequest<BuildingsAndRoomsRes>(query);
  };

///////////////////////////////////////////////////////////////

export type AllBookingsRes = {
  bookings: PaginatedBooking[];
};

type BookingModulesQueryRes = {
  bookingmodules: Array<
    BookingListModule & {
      roomId: string;
      occurrenceId: string;
    }
  >;
};

// Get and attache the associated modules for each booking
const attachBookingModules = async (
  bookings: BookingSummary[]
): Promise<BookingDetails[]> => {
  if (bookings.length === 0) {
    return [];
  }

  const where: GraphQLValue = {
    _or: bookings.map((booking) => ({
      roomId: { _eq: booking.roomId },
      occurrenceId: { _eq: booking.occurrenceId },
    })),
  };

  const query = `
    query BookingModules($where: bookingmodules_bool_exp!) {
      bookingmodules(
        where: $where
        order_by: [{ moduleIndex: asc}]
      ) {
        roomId
        occurrenceId
        code
        name
        term
        career
      }
    }
  `;

  const result = await doRequest<BookingModulesQueryRes>(query, { where });

  const modulesByBooking = new Map<string, BookingListModule[]>();

  for (const module of result.bookingmodules) {
    const key = JSON.stringify([module.roomId, module.occurrenceId]);

    const modules = modulesByBooking.get(key) ?? [];

    modules.push({
      code: module.code,
      name: module.name,
      term: module.term,
      career: module.career,
    });

    modulesByBooking.set(key, modules);
  }

  return bookings.map((booking) => {
    const key = JSON.stringify([booking.roomId, booking.occurrenceId]);

    return {
      ...booking,
      bookingModules: modulesByBooking.get(key) ?? [],
    };
  });
};

type TextComparison = {
  _eq?: string;
  _gt?: string;
  _lt?: string;
  _ilike?: string;
  _regex?: string;
};

type BookingWhere = {
  _and?: BookingWhere[];
  _or?: BookingWhere[];
  _not?: BookingWhere;

  start?: {
    _eq?: string;
    _gt?: string;
    _lt?: string;
    _lte?: string;
    _gte?: string;
  };

  end?: {
    _eq?: string;
    _gt?: string;
    _lt?: string;
    _lte?: string;
  };

  bookingType?: {
    _eq?: BookingType;
    _gt?: BookingType;
    _lt?: BookingType;
    _in?: BookingType[];
  };

  plannedSize?: {
    _eq?: number;
    _lt?: number;
    _gte?: number;
    _is_null?: boolean;
  };

  name?: TextComparison;
  rawName?: TextComparison;
  roomId?: TextComparison;
  occurrenceId?: TextComparison;
  eventId?: TextComparison;
  eventType?: TextComparison;
};

type SortColumn = {
  field:
    | "start"
    | "end"
    | "bookingType"
    | "name"
    | "plannedSize"
    | "roomId"
    | "occurrenceId";
  direction: "asc" | "desc" | "desc_nulls_last";
};

const getSortColumns = (
  sort: BookingPaginationParams["sort"]
): SortColumn[] => {
  const tieBreakers: SortColumn[] = [
    { field: "roomId", direction: "asc" },
    { field: "occurrenceId", direction: "asc" },
  ];

  switch (sort) {
    case "ascendingStart":
      return [
        { field: "start", direction: "asc" },
        { field: "bookingType", direction: "asc" },
        ...tieBreakers,
      ];

    case "descendingStart":
      return [
        { field: "start", direction: "desc" },
        { field: "bookingType", direction: "asc" },
        ...tieBreakers,
      ];

    case "alphabetical":
      return [{ field: "name", direction: "asc" }, ...tieBreakers];

    case "reverseAlphabetical":
      return [{ field: "name", direction: "desc" }, ...tieBreakers];

    case "plannedSize":
      return [
        { field: "plannedSize", direction: "desc_nulls_last" },
        ...tieBreakers,
      ];

    case "remainingTime":
      return [{ field: "end", direction: "asc" }, ...tieBreakers];

    default:
      throw new Error(`Unsupported sort: ${sort}`);
  }
};

const cursorComparison = (
  cursor: BookingCursor,
  field: SortColumn["field"],
  operator: "_eq" | "_gt" | "_lt"
): BookingWhere => {
  const comparison = <T extends string>(value: T) =>
    operator === "_eq"
      ? { _eq: value }
      : operator === "_gt"
        ? { _gt: value }
        : { _lt: value };

  switch (field) {
    case "start":
      return { start: comparison(cursor.start.toISOString()) };

    case "end":
      return { end: comparison(cursor.end.toISOString()) };

    case "bookingType":
      return { bookingType: comparison(cursor.bookingType) };

    case "name":
      return { name: comparison(cursor.name) };

    case "roomId":
      return { roomId: comparison(cursor.roomId) };

    case "occurrenceId":
      return { occurrenceId: comparison(cursor.occurrenceId) };

    case "plannedSize":
      if (operator !== "_eq") {
        throw new Error("Unexpected planned size comparison");
      }

      return {
        plannedSize:
          cursor.plannedSize === null
            ? { _is_null: true }
            : { _eq: cursor.plannedSize },
      };
  }
};

const cursorAfter = (
  cursor: BookingCursor,
  columns: SortColumn[]
): BookingWhere => ({
  _or: columns.flatMap((column, index): BookingWhere[] => {
    let after: BookingWhere;

    if (column.field === "plannedSize") {
      if (column.direction !== "desc_nulls_last") {
        throw new Error("Unsupported planned size ordering");
      }

      // Nothing sorts after null
      if (cursor.plannedSize === null) {
        return [];
      }

      after = {
        _or: [
          { plannedSize: { _lt: cursor.plannedSize } },
          { plannedSize: { _is_null: true } },
        ],
      };
    } else {
      after = cursorComparison(
        cursor,
        column.field,
        column.direction === "asc" ? "_gt" : "_lt"
      );
    }

    return [
      {
        _and: [
          ...columns
            .slice(0, index)
            .map((previous) => cursorComparison(cursor, previous.field, "_eq")),
          after,
        ],
      },
    ];
  }),
});

// Ordered json string for comparison
const normaliseFilters = (
  filters: BookingPaginationParams["filters"]
): string => {
  return JSON.stringify({
    startTime:
      filters?.startTime instanceof Date
        ? filters.startTime.toISOString()
        : (filters?.startTime ?? null),
    endTime:
      filters?.endTime instanceof Date
        ? filters.endTime.toISOString()
        : (filters?.endTime ?? null),
    bookingType: filters?.bookingType ?? null,
    plannedSize: filters?.plannedSize ?? null,
    location: filters?.location ?? null,
  });
};

const cursorMatchesRequest = (
  cursor: BookingCursor,
  params: BookingPaginationParams
): boolean => {
  return (
    cursor.sort === params.sort &&
    (cursor.search ?? null) === (params.search ?? null) &&
    normaliseFilters(cursor.filter) === normaliseFilters(params.filters)
  );
};

const LOWER_CAMPUS_REGEX = `^[^-]+-[A-Za-z]+0*(?:${Array.from(
  { length: UPPER_CAMPUS_GRID_START },
  (_, grid) => grid
).join("|")})-`;

/**
 * Query all bookings with pagination
 */
export const queryAllBookings = async (
  params: BookingPaginationParams
): Promise<AllBookingsRes> => {
  const { limit, cursor, filters, search, sort } = params;

  const conditions: BookingWhere[] = [];

  const sortColumns = getSortColumns(sort);

  // Ignore old cursor if the settings changed
  const activeCursor =
    cursor && cursorMatchesRequest(cursor, params) ? cursor : null;

  if (
    filters?.startTime &&
    filters?.endTime &&
    filters.endTime <= filters.startTime
  ) {
    throw new Error("End time must be after start time");
  }

  // Exclude finished when no start time is specified
  if (!filters?.startTime) {
    conditions.push({
      end: { _gt: new Date().toISOString() },
    });
  }

  // Bookings start at or after
  if (filters?.startTime) {
    conditions.push({
      start: { _gte: filters.startTime.toISOString() },
    });
  }

  // Bookings end at or before
  if (filters?.endTime) {
    conditions.push({
      end: { _lte: filters.endTime.toISOString() },
    });
  }

  // Filter by booking on campus location
  if (filters?.location === "lower") {
    conditions.push({
      roomId: { _regex: LOWER_CAMPUS_REGEX },
    });
  } else if (filters?.location === "upper") {
    conditions.push({
      _not: {
        roomId: { _regex: LOWER_CAMPUS_REGEX },
      },
    });
  }

  if (filters?.bookingType) {
    conditions.push({
      bookingType: { _eq: filters.bookingType },
    });
  }

  if (filters?.plannedSize !== undefined) {
    conditions.push({
      plannedSize: { _gte: filters.plannedSize },
    });
  }

  // Search across booking fields
  if (search) {
    const escaped = search.replace(/[%_\\]/g, "\\$&");
    const pattern = `%${escaped}%`;

    const searchConditions: BookingWhere[] = [
      { name: { _ilike: pattern } },
      { rawName: { _ilike: pattern } },
      { roomId: { _ilike: pattern } },
      { occurrenceId: { _ilike: pattern } },
      { eventId: { _ilike: pattern } },
      { eventType: { _ilike: pattern } },
    ];

    // Booking type is an enum so do seperatly

    const matchingTypes = Object.values(BookingType).filter((type) =>
      type.toLowerCase().includes(search.toLowerCase())
    );

    if (matchingTypes.length > 0) {
      searchConditions.push({
        bookingType: { _in: matchingTypes },
      });
    }

    conditions.push({ _or: searchConditions });
  }

  // Existing acending keyset
  if (activeCursor) {
    conditions.push(cursorAfter(activeCursor, sortColumns));
  }

  // Filter bookings if cursor exists
  const where: GraphQLValue = conditions.length > 0 ? { _and: conditions } : {};

  const orderBy = sortColumns
    .map(({ field, direction }) => `{ ${field}: ${direction} }`)
    .join("\n");

  const query = `
    query AllBookings(
      $limit: Int!
      $where: bookings_bool_exp!
    ) {
      bookings(
      where: $where
        order_by: [
          ${orderBy}
        ]
        limit: $limit
      ) {
        roomId
        occurrenceId
        eventId
        name
        bookingType
        start
        end
        plannedSize
      }
    }
  `;

  // Get the paginated bookings first
  const result = await doRequest<{
    bookings: BookingSummary[];
  }>(query, { limit, where });

  return {
    bookings: await attachBookingModules(result.bookings),
  };
};

///////////////////////////////////////////////////////////////

type BookingsForRoomRes = {
  rooms_by_pk: {
    id: string;
    name: string;
    bookings: Booking[];
  };
};

/**
 * Query all bookings in the range start to end, grouped by room
 */
export const queryBookingsForRoom = async (
  roomId: string
): Promise<BookingsForRoomRes> => {
  const query = `
    query BookingsForRoom($roomId: String!) {
      rooms_by_pk(id: $roomId) {
        id
        name
        bookings(order_by: {start: asc}) {
          roomId
          occurrenceId
          eventId
          name
          bookingType
          start
          end
        }
      }
    }
  `;

  const variables = { roomId };

  return await doRequest<BookingsForRoomRes>(query, variables);
};

///////////////////////////////////////////////////////////////

/**
 * Query an individual booking and its modules
 */
export const queryBookingDetails = async (
  roomId: string,
  occurrenceId: string
): Promise<BookingDetails | null> => {
  const query = `
    query BookingDetails(
      $roomId: String!
      $occurrenceId: String!
    ) {
      bookings(
        where: {
          roomId: { _eq: $roomId}
          occurrenceId: { _eq: $occurrenceId }
        }
        limit: 1
      ) {
        roomId
        occurrenceId
        eventId
        name
        bookingType
        start
        end
        plannedSize
      }
    }
  `;

  const result = await doRequest<{
    bookings: BookingSummary[];
  }>(query, { roomId, occurrenceId });

  if (result.bookings.length === 0) {
    return null;
  }

  const bookings = await attachBookingModules(result.bookings);

  return bookings[0];
};

///////////////////////////////////////////////////////////////

type BookingsForEventRes = {
  bookings: BookingsEventResponse[];
};

/**
 * Query all bookings by the eventID
 */
export const queryBookingsForEvent = async (
  eventId: string
): Promise<BookingsForEventRes> => {
  const query = `
    query BookingsForEvent($eventId: String!) {
      bookings(
        where: {eventId: {_eq: $eventId}}
        order_by: [
          { start: asc }
          { roomId: asc }
          { occurrenceId: asc }
        ]
      ) {
        eventId
        occurrenceId
        roomId
        name
        start
        end
        bookingType
        plannedSize
      }
    }
  `;

  return await doRequest<BookingsForEventRes>(query, { eventId });
};

///////////////////////////////////////////////////////////////
// Type definition of room utilities from GraphQL query
type RoomUtilitiesRes = {
  rooms_by_pk: {
    id: string;
    name: string;
    floor: string | null;
    seating: string | null;
    microphone: string[];
    accessibility: string[];
    audiovisual: string[];
    infotechnology: string[];
    writingMedia: string[];
    service: string[];
  };
};

// Requesting API to return information for the room utilities under a specific roomId
export const queryRoomUtilities = async (
  roomId: string
): Promise<RoomUtilitiesRes> => {
  const query = `
    query RoomUtilities($roomId: String!) {
      rooms_by_pk(id: $roomId) {
        id
        name
        floor
        seating
        microphone
        accessibility
        audiovisual
        infotechnology
        writingMedia
        service
      }
    }
  `;

  const variables = { roomId };
  return await doRequest<RoomUtilitiesRes>(query, variables);
};
