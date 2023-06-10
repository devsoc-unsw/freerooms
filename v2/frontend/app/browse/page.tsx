"use client";

import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import { styled } from "@mui/material/styles";
import React, { CSSProperties } from "react";
import { ClipLoader } from "react-spinners";

import FilterBar from "../../components/FilterBar";
import SearchBar from "../../components/SearchBar";
import SortBar from "../../components/SortBar";
import useBuildings from "../../hooks/useBuildings";
import { selectCurrentBuilding, setCurrentBuilding } from "../../redux/currentBuildingSlice";
import { useDispatch, useSelector } from "../../redux/hooks";
import CardList from "../../views/CardList";


const Page = () => {
  // Get global state from Redux
  const dispatch = useDispatch();
  const currentBuilding = useSelector(selectCurrentBuilding);

  // Fetch data from backend
  const { buildings } = useBuildings();

  // Local state variables
  const [sort, setSort] = React.useState<string>("alphabetical");
  const [query, setQuery] = React.useState<string>("");

  const drawerOpen = !!currentBuilding;

  const override: CSSProperties = {
    display: "block",
    margin: "20vh auto",
    borderColor: "red",
  };

  return (
    <Container maxWidth={false}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <Tiles open={drawerOpen}>
          <div id={"Home-Building-Tiles"}>
            <div id={"Home-Options"} style={{ display: "flex", justifyContent: "space-between" }}>
              <FilterBar/>
              <SearchBar setQuery={setQuery}></SearchBar>
              <SortBar
                // filters={sort}
                // setFilters={setSort}
                setSort={setSort} sort={sort}></SortBar>
            </div>
            {
              buildings?.length
                ? <CardList
                  buildings={buildings}
                  setCurrentBuilding={building => dispatch(setCurrentBuilding(building))}
                  sort={sort}
                  query={query}
                />
                : <ClipLoader
                  color={"#000000"}
                  loading={true}
                  cssOverride={override}
                  size={150}
                  aria-label="Loading Spinner"
                  data-testid="loader"
                />
            }
          </div>
        </Tiles>
      </Box>
    </Container>
  );
};

const drawerWidth = 400;

const Tiles = styled("main", { shouldForwardProp: (prop) => prop !== "open" })<{
  open?: boolean;
}>(({ theme, open }) => ({
  display: "flex",
  flexDirection: "column",
  flexGrow: 1,
  padding: theme.spacing(0, 0, 1, 0),
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    width: `calc(100% - ${drawerWidth}px)`,
    marginRight: `${drawerWidth}px`,
  }),
}));

export default Page;