// Interface to the Hasura GraphQL API
import type { TypedDocumentNode } from "@graphql-typed-document-node/core";
import parseDates from "common/parseDates";
import { Booking, BookingCursor, BookingModule, BookingPaginationParams, BookingType } from "common/types";
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
  | { [key: string]: GraphQLValue}

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
  bookings: Booking[];
};

type TextComparison = {
  _eq?: string;
  _gt?: string;
  _lt?: string;
  _ilike?: string;
};

type BookingWhere = {
  _and?: BookingWhere[];
  _or?: BookingWhere[];

  start?: {
    _eq?: string;
    _gt?: string;
    _lt?: string;
  };

  bookingType?: {
    _eq?: BookingType;
    _gt?: BookingType;
    _lt?: BookingType;
    _in?: BookingType[];
  };

  plannedSize?: {
    _gte?: number;
  };

  name?: TextComparison;
  rawName?: TextComparison;
  roomId?: TextComparison;
  occurrenceId?: TextComparison;
  eventId?: TextComparison;
  eventType?: TextComparison;
}

type SortColumn = {
  field: "start" | "bookingType" | "name" | "roomId" | "occurrenceId";
  direction: "asc" | "desc";
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
        { field: "start", direction: "asc"},
        { field: "bookingType", direction: "asc"},
        ...tieBreakers
      ];

    case "descendingStart":
      return [
        { field: "start", direction: "desc"},
        { field: "bookingType", direction: "asc"},
        ...tieBreakers
      ];

    case "alphabetical":
      return [
        { field: "name", direction: "asc"},
        ...tieBreakers
      ];

    case "reverseAlphabetical":
      return [
        { field: "name", direction: "desc"},
        ...tieBreakers
      ];

    default:
      throw new Error(`Unsupported sort: ${sort}`)
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
        ? {_gt: value}
        : {_lt: value};

  switch (field) {
    case "start":
      return { start: comparison(cursor.start.toISOString()) };

    case "bookingType":
      return { bookingType: comparison(cursor.bookingType) };

    case "name":
      return { name: comparison(cursor.name) };

    case "roomId":
      return { roomId: comparison(cursor.roomId) };

    case "occurrenceId":
      return { occurrenceId: comparison(cursor.occurrenceId) };
  }
}

const cursorAfter = (
  cursor: BookingCursor,
  columns: SortColumn[]
): BookingWhere => ({
  _or: columns.map((column, index) => ({
    _and: [
      ...columns
        .slice(0, index)
        .map((previous) =>
          cursorComparison(cursor, previous.field, "_eq")
        ),
      cursorComparison(
        cursor,
        column.field,
        column.direction === "asc" ? "_gt" : "_lt",
      ),
    ],
  })),
});

/**
 * Query all bookings with pagination
 */
export const queryAllBookings = async (
  params: BookingPaginationParams
): Promise<AllBookingsRes> => {
  const { limit, cursor, filters, search, sort } = params;

  const conditions: BookingWhere[] = [];

  const sortColumns = getSortColumns(sort);

  if (cursor && cursor.sort !== sort) {
    throw new Error("Cursor sorting does not match requested sorting");
  }

  if (filters?.bookingType) {
    conditions.push({
      bookingType: { _eq: filters.bookingType }
    })
  }

  if (filters?.plannedSize !== undefined) {
    conditions.push({
      plannedSize: {_gte: filters.plannedSize}
    })
  }

  // Search across booking fields
  if (search) {
    const escaped = search.replace(/[%_\\]/g, "\\$&");
    const pattern = `%${escaped}%`

    const searchConditions: BookingWhere[] = [
      { name: { _ilike: pattern }},
      { rawName: { _ilike: pattern }},
      { roomId: { _ilike: pattern }},
      { occurrenceId: { _ilike: pattern }},
      { eventId: { _ilike: pattern }},
      { eventType: { _ilike: pattern }},
    ];

    // Booking type is an enum so do seperatly

    const matchingTypes = Object.values(BookingType).filter((type) =>
      type.toLowerCase().includes(search.toLowerCase())
    );

    if (matchingTypes.length > 0) {
      searchConditions.push({
        bookingType: { _in: matchingTypes}
      })
    }

    conditions.push({ _or: searchConditions });
  }

  // Existing acending keyset
  if (cursor) {
    conditions.push(cursorAfter(cursor, sortColumns));
  }

  // Filter bookings if cursor exists
  const where: GraphQLValue = conditions.length > 0 ? { _and: conditions } : {};

  const orderBy = sortColumns.map(({field, direction}) =>
    `{ ${field}: ${direction} }`
  ).join("\n");

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

  return await doRequest<AllBookingsRes>(query, {limit, where});
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

type BookingsModuleRes = {
  bookings: {
    occurrenceId: string;
    roomId: string;
    bookingModule: BookingModule;
  };
};

/**
 * Query bookings module from an occurrence ID and room ID
 */
export const queryBookingsModule = async (
  roomId: string,
  occurrenceId: string
): Promise<BookingsModuleRes> => {
  const query = `
    query BookingsModule($roomId: String!, $occurrenceId: String!) {
      bookings(where: {roomId: {_like: $roomId}, occurrenceId: {_like: $occurrenceId}, }) {
        occurrenceId
        roomId
        bookingmodules {
          term
          career
          code
          name
        }
      }
    }
  `;

  const variables = { occurrenceId, roomId };

  return await doRequest<BookingsModuleRes>(query, variables);
};

///////////////////////////////////////////////////////////////

type BookingsForEventRes = {
  bookings: Array<{
    eventId: string;
    occurrenceId: string;
    roomId: string;
    name: string;
    bookingType: string;
    plannedSize: string;
    start: Date;
    end: Date;
  }>;
};

/**
 * Query all bookings by the eventID
 */
export const queryBookingsForEvent = async (
  eventId: string
): Promise<BookingsForEventRes> => {
  const query = `
    query BookingsForEvent($eventId: String!) {
      bookings(where: {eventId: {_like: $eventId}}, order_by: {start: asc}) {
        eventId
        occurrenceId
        roomId
        name
        start
        end
        bookingType
      }
    }
  `;

  const variables = { eventId };

  return await doRequest<BookingsForEventRes>(query, variables);
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
