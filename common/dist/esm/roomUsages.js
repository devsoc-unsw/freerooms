export const roomUsages = {
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
    return roomUsages[usageAbbr];
};
export default translateRoomUsage;
