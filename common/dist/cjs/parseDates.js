"use strict";
// Date helpers from https://stackoverflow.com/a/66238542
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Convert all ISO date strings in an object to JS Date objects and
 * return the original object
 */
const parseDates = (body) => {
    if (body === null || body === undefined || typeof body !== "object")
        return body;
    for (const key of Object.keys(body)) {
        const value = body[key];
        if (isIsoDateString(value))
            body[key] = parseISO(value);
        else if (typeof value === "object")
            body[key] = parseDates(value);
    }
    return body;
};
const ISO_DATE_REGEX = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d*)?(?<tz>Z|[+-]\d{2}:\d{2})?$/;
const isIsoDateString = (value) => {
    return value && typeof value === "string" && ISO_DATE_REGEX.test(value);
};
/**
 * Adds a Z if no timezone attached, then parses using Date constructor
 */
const parseISO = (value) => {
    return value.match(/[+\-Z]/) ? new Date(value) : new Date(`${value}Z`);
};
exports.default = parseDates;
