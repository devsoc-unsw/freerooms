/*
  This is the home page (list view of all the buildings)
*/
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import axios from "axios";
import { DateTime } from "luxon";
import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import React from "react";

import Mapping from "../components/BaseMap";
import Branding from "../components/Branding";
import Button from "../components/Button";
import FilterBar from "../components/FilterBar";
import Landing from "../components/Landing";
import SearchBar from "../components/SearchBar";
import SortBar from "../components/SortBar";
import { API_URL } from "../config";
import { Building, BuildingReturnData, Filters, RoomsRequestParams, RoomsReturnData } from "../types";
import BuildingInfo from "../views/BuildingInfo";
import CardList from "../views/CardList";

const Home: NextPage<{}> = () => {
  const router = useRouter();
  const { building } = router.query;

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
  const [showLanding, setShowLanding] = React.useState(true);
  const [showMap, setShowMap] = React.useState(false);
  const [buttonText, setButtonText] = React.useState<string>("Map View");

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
        router.replace("/", undefined, { shallow: true });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [building]);

  const drawerOpen = !!currentBuilding;

  const handleShowMap = () => {
    setShowMap((currState) => !currState);
    setButtonText(buttonText == "Map View" ? "List View" : "Map View");
  };

  return (
    <Container maxWidth={false}>
      <Head>
        <title>Freerooms</title>
        <meta
          name="description"
          content="A web application designed to aid UNSW students in finding vacant rooms."
        />
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar
          position="fixed"
          open={drawerOpen}
          sx={(theme) => ({
            borderBottom: "1px solid #e0e0e0",
            alignItems: "center",
            display: "flex",
            justifyContent: "space-between",
          })}
        >
          <div id={"header"}>
            <div id={"headerBranding"}>
              <Branding
                onClick={() => {
                  setCurrentBuilding(null);
                  window.location.replace(window.location.href);
                }}
              />
            </div>
            <div id={"headerSearch"}>
              <div id={"headerButtons"}>
                <ButtonGroup>
                  <Stack direction="row" spacing={1.5}>
                    <Button onClick={handleShowMap}>{buttonText}</Button>
                  </Stack>
                </ButtonGroup>
              </div>
            </div>
          </div>
        </AppBar>
        <Main open={drawerOpen}>
          {showLanding ? <Landing setShowLanding={setShowLanding} /> : null}
          <div id={"Home-Building-Tiles"}>
            <div id={"Home-Options"} style={{ display: "flex", justifyContent: "space-between" }}>
              <FilterBar filters={filters} setFilters={setFilters} />
              <SearchBar setQuery={setQuery}></SearchBar>
              <SortBar filters={sort} setFilters={setSort}></SortBar>
            </div>
            {showMap ? (
              <Mapping
                setCurrentBuilding={setCurrentBuilding}
                buildingData={buildingData}
              />
            ) : (
              <CardList
                buildingData={buildingData}
                setCurrentBuilding={setCurrentBuilding}
                sort={sort}
                query={query}
                roomStatusData={roomStatusData}
              />
            )}
          </div>
        </Main>
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

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  backgroundColor: theme.palette.background.default,
  color: theme.palette.getContrastText(theme.palette.background.default),
  boxShadow: "none",
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  padding: theme.spacing(2, 1),
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginRight: `${drawerWidth}px`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const ButtonGroup = styled(Box)(({ theme }) => ({
  flex: 1,
  display: "flex",
  flexDirection: "row",
  justifyContent: "flex-end",
  alignItems: "center",
  paddingRight: theme.spacing(2),
}));


export default Home;
