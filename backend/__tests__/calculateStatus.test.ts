import { calculateStatus } from "../src/helpers";

const TEST_DATE = new Date(2024, 2, 24, 12);

describe("calculateStatus", () => {
  it("is available all day if there are no bookings", () => {
    expect(calculateStatus(TEST_DATE, [], 0)).toEqual({
      status: "free",
      endtime: "",
    });
  });
});
