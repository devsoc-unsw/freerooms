"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roomUsages = void 0;
exports.roomUsages = {
    AUD: "Auditorium",
    CMLB: "Computer Lab",
    LAB: "Lab",
    LCTR: "Lecture Hall",
    MEET: "Meeting Room",
    SDIO: "Studio",
    TUSM: "Tutorial Room",
    LIB: "Library Study Room",
};
const translateRoomUsage = (usageAbbr) => {
    return exports.roomUsages[usageAbbr];
};
exports.default = translateRoomUsage;
