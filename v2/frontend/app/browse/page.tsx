"use client";

import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import { styled } from "@mui/material/styles";
import axios from "axios";
import { DateTime } from "luxon";
import { useRouter, useSearchParams } from "next/navigation";
import React, { CSSProperties } from "react";
import { ClipLoader } from "react-spinners";

import FilterBar from "../../components/FilterBar";
import SearchBar from "../../components/SearchBar";
import SortBar from "../../components/SortBar";
import { API_URL } from "../../config";
import { Building, BuildingReturnData, Filters, RoomsRequestParams, RoomsReturnData } from "../../types";
import BuildingInfo from "../../views/BuildingInfo";
import CardList from "../../views/CardList";


const Page = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const building = searchParams.get("building");

  const [buildingData, setBuildingData] = React.useState<BuildingReturnData>({ buildings: [] });
  React.useEffect(() => {
    fetch(API_URL + "/buildings")
      .then(res => res.json())
      .then(data => setBuildingData(data as BuildingReturnData))
      .catch(() => setBuildingData({ buildings: [] }));
  }, []);

  // State variables to be used by the various new features
  const [sort, setSort] = React.useState<string>("alphabetical");
  const [query, setQuery] = React.useState<string>("");
  const [datetime, setDatetime] = React.useState<Date | null>(new Date());
  const [filters, setFilters] = React.useState<Filters>({});

  const [roomStatusData, setRoomStatusData] = React.useState<
    RoomsReturnData | undefined
  >();

  React.useEffect(() => {
    const fetchRoomStatus = () => {
      const params: RoomsRequestParams = { ...filters };
      if (datetime) {
        params.datetime =
          DateTime.fromJSDate(datetime).toFormat("yyyy-MM-dd'T'HH:mm");
      }

      axios
        .get(API_URL + "/rooms", { params: params })
        .then((res) => {
          setRoomStatusData(res.status == 200 ? res.data : {});
        })
        .catch((err) => setRoomStatusData({}));
    };

    setRoomStatusData(undefined);
    fetchRoomStatus();
  }, [filters, datetime]);

  const [currentBuilding, setCurrentBuilding] = React.useState<Building | null>(
    null,
  );

  React.useEffect(() => {
    if (building) {
      const selectedBuilding = buildingData.buildings.find(
        (b) => b.id === building,
      );
      if (selectedBuilding) {
        setCurrentBuilding(selectedBuilding);
        router.replace("/");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [building]);

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
              <FilterBar filters={filters} setFilters={setFilters} />
              <SearchBar setQuery={setQuery}></SearchBar>
              <SortBar filters={sort} setFilters={setSort}></SortBar>
            </div>
            {
              buildingData.buildings.length == 0 ?
                <ClipLoader
                  color={"#000000"}
                  loading={true}
                  cssOverride={override}
                  size={150}
                  aria-label="Loading Spinner"
                  data-testid="loader"
                /> : <CardList
                buildingData={buildingData}
                setCurrentBuilding={setCurrentBuilding}
                sort={sort}
                query={query}
                roomStatusData={roomStatusData}
              />
            }
          </div>
        </Tiles>
        <Drawer
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
            },
          }}
          variant="persistent"
          anchor="right"
          open={drawerOpen}
        >
          <Divider />
          <BuildingInfo
            building={currentBuilding}
            onClose={() => setCurrentBuilding(null)}
            datetime={datetime}
            setDatetime={setDatetime}
            roomStatusData={roomStatusData}
          />
        </Drawer>
      </Box>
    </Container>
  );
};

const drawerWidth = 400;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })<{
  open?: boolean;
}>(({ theme, open }) => ({
  display: "flex",
  flexDirection: "column",
  flexGrow: 1,
  padding: theme.spacing(12, 0),
  maxHeight: "100vh",
}));

const Tiles = styled("main", { shouldForwardProp: (prop) => prop !== "open" })<{
  open?: boolean;
}>(({ theme, open }) => ({
  display: "flex",
  flexDirection: "column",
  flexGrow: 1,
  padding: theme.spacing(12, 0),
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginRight: `-${drawerWidth}px`,
  ...(open && {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginRight: 0,
  }),
}));

export default Page;