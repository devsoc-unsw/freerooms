import { BookingType } from "common/types";


const bookingTypeLabels: Record<BookingType, string> = {
    [BookingType.LECTURE]: "Lecture",
    [BookingType.TUTORIAL]: "Tutorial",
    [BookingType.LABORATORY]: "Laboratory",
    [BookingType.TUTORIAL_LABORATORY]: "Tutorial / Laboratory",
    [BookingType.WORKSHOP]: "Workshop",
    [BookingType.SEMINAR]: "Seminar",
    [BookingType.STUDIO]: "Studio",
    [BookingType.CLASS]: "Class",
    [BookingType.EXAMS]: "Exam",
    [BookingType.SOCIETY]: "Society",
    [BookingType.INTERNAL]: "Internal",
    [BookingType.BLOCK]: "Block Booking",
    [BookingType.MISC]: "Miscellaneous",
    [BookingType.OTHER]: "Other",
};


export const getBookingTypeLabel = (
    bookingType: string
): string => {
    const type = Object.values(BookingType).find((type) => type === bookingType);

    return type ? bookingTypeLabels[type] : "Other";
}