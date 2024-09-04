import "@testing-library/jest-dom";

import { createTheme, ThemeProvider } from "@mui/material";
import { render, screen, within } from "@testing-library/react";

import DropdownSelections from "../components/DropdownSelections";

describe("DropdownSelections", () => {
  it("Displays the correct filter type given", () => {
    render(
      <ThemeProvider theme={createTheme({})}>
        <DropdownSelections
          dropdown={{
            text: "Room Capacity",
            key: "capacity",
            items: [
              {
                text: "25+",
                value: "25",
              },
              {
                text: "50+",
                value: "50",
              },
              {
                text: "100+",
                value: "100",
              },
              {
                text: "200+",
                value: "200",
              },
            ],
          }}
          canSelectMultiple={false}
          filters={{
            capacity: "",
            usage: "",
            location: "",
            duration: "",
            id: "",
          }}
          handleSelect={(key, item) => {
            return;
          }}
        />
      </ThemeProvider>
    );
    const filterTitle = screen.getByText("Room Capacity");
    expect(filterTitle).toBeInTheDocument();

    const filterItem25 = screen.getByText("25+");
    expect(filterItem25).toBeInTheDocument();
    const filterItem50 = screen.getByText("50+");
    expect(filterItem50).toBeInTheDocument();
    const filterItem100 = screen.getByText("100+");
    expect(filterItem100).toBeInTheDocument();
    const filterItem200 = screen.getByText("200+");
    expect(filterItem200).toBeInTheDocument();
  });
});
