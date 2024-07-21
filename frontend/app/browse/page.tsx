"use client";

import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import React from "react";

import FilterBar from "../../components/FilterBar";
import SearchBar from "../../components/SearchBar";
import SortBar from "../../components/SortBar";
import CardList from "../../views/CardList";

const Page = () => {
  // Local state variables
  const [sort, setSort] = React.useState<string>("alphabetical");
  const [query, setQuery] = React.useState<string>("");

  return (
    <Container maxWidth={false}>
      <Tiles>
        <Stack
          direction="row"
          justifyContent="space-between"
          my={1}
          flexWrap={{ xs: "wrap", sm: "nowrap" }}
        >
          <FilterBar />
          <SearchBar setQuery={setQuery} />
          <SortBar setSort={setSort} sort={sort} />
        </Stack>
        <CardList sort={sort} query={query} />
      </Tiles>
    </Container>
  );
};

const Tiles = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  flexGrow: 1,
  padding: theme.spacing(0, 0, 1, 0),
}));

export default Page;
