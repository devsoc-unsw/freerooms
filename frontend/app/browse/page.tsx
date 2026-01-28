"use client";

import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import React from "react";
import BuildingDrawer from "views/BuildingDrawer";

import DatePicker from "../../components/DatePicker";
import FeedbackButton from "../../components/FeedbackButton";
import FilterBar from "../../components/FilterBar";
import SearchBar from "../../components/SearchBar";
import SortBar from "../../components/SortBar";
import TimePicker from "../../components/TimePicker";
import CardList from "../../views/CardList";

const Page = () => {
  const [sort, setSort] = React.useState<string>("alphabetical");
  const [query, setQuery] = React.useState<string>("");

  return (
    <Container maxWidth={false}>
      <FeedbackButton />
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Tiles>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent={{
              xs: "center",
              sm: "space-between",
            }}
            alignItems="center"
            my={1}
            flexWrap={{ sm: "wrap", md: "nowrap" }}
            width="100%"
          >
            <Stack
              direction="row"
              spacing={2}
              justifyContent="space-between"
              alignItems="center"
              alignSelf="center"
            >
              <FilterBar />
              <SortBar setSort={setSort} sort={sort} />
            </Stack>
            <SearchBar setQuery={setQuery} />
            <Stack
              alignItems="center"
              alignSelf="center"
              direction="row"
              justifyContent="space-between"
              marginTop={{ xs: 1, sm: 0 }}
              spacing={2}
            >
              <DatePicker />
              <TimePicker />
            </Stack>
          </Stack>
          <CardList sort={sort} query={query} />
        </Tiles>
      </LocalizationProvider>
      <BuildingDrawer />
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

export default Page;
