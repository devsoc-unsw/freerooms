"use client";

import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Container from "@mui/material/Container";
import { styled } from "@mui/material/styles";
import React from "react";

import FilterBar from "../../components/FilterBar";
import SearchBar from "../../components/SearchBar";
import SortBar from "../../components/SortBar";
import useBuildings from "../../hooks/useBuildings";
import { setCurrentBuilding } from "../../redux/currentBuildingSlice";
import { useDispatch } from "../../redux/hooks";
import CardList from "../../views/CardList";


const Page = () => {
  // Get global state from Redux
  const dispatch = useDispatch();

  // Fetch data from backend
  const { buildings } = useBuildings();

  // Local state variables
  const [sort, setSort] = React.useState<string>("alphabetical");
  const [query, setQuery] = React.useState<string>("");

  return (
    <Container maxWidth={false}>
      <Box sx={{ display: "flex" }}>
        <Tiles>
          <div id={"Home-Building-Tiles"}>
            <div id={"Home-Options"} style={{ display: "flex", justifyContent: "space-between" }}>
              <FilterBar />
              <SearchBar setQuery={setQuery} />
              <SortBar setSort={setSort} sort={sort} />
            </div>
            {
              buildings?.length
                ? <CardList
                  buildings={buildings}
                  setCurrentBuilding={building => dispatch(setCurrentBuilding(building))}
                  sort={sort}
                  query={query}
                />
                : <Box sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  display: "block"
                }}>
                  <CircularProgress color="primary" size={150} />
                </Box>
            }
          </div>
        </Tiles>
      </Box>
    </Container>
  );
};

const Tiles = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  flexGrow: 1,
  padding: theme.spacing(0, 0, 1, 0)
}));

export default Page;