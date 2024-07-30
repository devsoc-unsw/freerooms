import "@testing-library/jest-dom";

import { Booking } from "@common/types";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";

import BookingCalendar from "../components/BookingCalendar";
import store from "../redux/store";


const start: Date = new Date();
const end: Date = new Date();
const events: Booking[] = [
  {
    name: "MARK5827 TUT",
    bookingType: "(CLASS)",
    start: start,
    end: end,
  },
];

describe("Booking calendar with circular rating", () => {
    it("renders the CircularRating component", () => {
        render(
            <Provider store={store}>
                <BookingCalendar events={events} />
            </Provider>
        );

        const cleanlinessRating = screen.getByText("Cleanliness");
        const quietnessRating = screen.getByText("Quietness");
        const ackRating = screen.getByText("ACK");

        expect(cleanlinessRating).toBeInTheDocument();
        expect(quietnessRating).toBeInTheDocument();
        expect(ackRating).toBeInTheDocument();
    })
})