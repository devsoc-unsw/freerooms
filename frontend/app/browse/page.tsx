"use client";

import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import { styled, useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { DesktopTimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { DigitalClock } from "@mui/x-date-pickers/DigitalClock";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import React from "react";

import DatePicker from "../../components/DatePicker";
import FilterBar from "../../components/FilterBar";
import SearchBar from "../../components/SearchBar";
import SortBar from "../../components/SortBar";
import TimePicker from "../../components/TimePicker";
import { selectDatetime, setDatetime } from "../../redux/datetimeSlice";
import { useDispatch, useSelector } from "../../redux/hooks";
import toSydneyTime from "../../utils/toSydneyTime";
import CardList from "../../views/CardList";

const Page = () => {
  // Local state variables
  const [sort, setSort] = React.useState<string>("alphabetical");
  const [query, setQuery] = React.useState<string>("");
  const dispatch = useDispatch();
  const datetime = useSelector(selectDatetime);
  const theme = useTheme();
  // const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Container maxWidth={false}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Tiles>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent={{
              xs: "center",
              sm: "space-around",
              md: "space-between",
            }}
            alignItems="center"
            my={1}
            flexWrap={{ sm: "wrap", md: "nowrap" }}
            width="100%"
          >
            <StyledRow>
              <FilterBar />
              <div style={{ width: 10 }} />
              <SortBar setSort={setSort} sort={sort} />
            </StyledRow>
            <SearchBar setQuery={setQuery} />
            <StyledRow>
              <DatePicker />
              <div style={{ width: 10 }} />
              <TimePicker />
            </StyledRow>
          </Stack>
          <CardList sort={sort} query={query} />
        </Tiles>
      </LocalizationProvider>
    </Container>
  );
};

const Tiles = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  flexGrow: 1,
  alignItems: "center",
  padding: theme.spacing(0, 0, 1, 0),
}));

const StyledRow = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  alignSelf: "center",
  padding: theme.spacing(0.5, 0.5, 0.5, 0.5),
}));

export default Page;
