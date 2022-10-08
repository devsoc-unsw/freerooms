/*
  This is the home page (list view of all the buildings)
*/

import React from "react";
import { server } from "../config";
import { DateTime } from "luxon";
import {
  RoomStatus,
  Building,
  BuildingReturnData,
  Filters,
  RoomsReturnData,
  RoomsRequestParams,
} from "../types";

import useSWR from "swr";
import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import Image, { ImageProps } from "next/image";

import Drawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Container from "@mui/material/Container";
import { styled } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import SearchIcon from "@mui/icons-material/Search";
import { BoxProps, Typography } from "@mui/material";

import Branding from "../components/Branding";
import Button from "../components/Button";
import BuildingCard from "../components/BuildingCard";
import BuildingInfo from "../views/BuildingInfo";
import CardList from "../views/CardList";
import axios from "axios";

import TextField from "@mui/material/TextField"; // REMOVE ME

const Home: NextPage<{ data: BuildingReturnData }> = ({ data }) => {
  const router = useRouter();
  const { building } = router.query;

  /* commented these out for now because backend doesn't return upper/lower info
  const [selection, setSelection] = React.useState<string>("upper");
  React.useEffect(() => {
    clearCurrentBuilding();
  }, [selection]);
  const clearCurrentBuilding = () => {
    setCurrentBuilding(null);
    router.push("/");
  };
  */

  const [currentBuilding, setCurrentBuilding] = React.useState<Building | null>(
    null
  );

  const [sort, setSort] = React.useState<string>("alphabetical");
  const [query, setQuery] = React.useState<string>("");
  
  const [datetime, setDatetime] = React.useState<Date | null>(new Date());
  const [filters, setFilters] = React.useState<Filters>({
    capacity: 0, usage: null, location: null, duration: 0
  });
  const [hideUnavailable, setHideUnavailable] = React.useState<boolean>(false);
  
  const [roomsData, setRoomsData] = React.useState<RoomsReturnData | undefined>(undefined);
  // fetchRoomStatus(filters, datetime, setRoomsData);
  React.useEffect(() => {
    setRoomsData(undefined);
    fetchRoomStatus(filters, datetime, setRoomsData);
  }, [filters, datetime]);

  React.useEffect(() => {
    if (building) {
      const buildingData = data.buildings.find((b) => b.id === building);
      if (buildingData) {
        setCurrentBuilding(buildingData);
        router.replace("/", undefined, { shallow: true });
      }
    }
  }, [building]);

  const drawerOpen = currentBuilding ? true : false;

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
          })}
        >
          <Branding
            onClick={() => {
              setCurrentBuilding(null);
            }}
          />
          
          <TextField
            label="searchQuery"
            onKeyPress={(e) => {
              if (e.key === 'Enter') setQuery(e.target.value)
            }}
          />
          <TextField
            label="hideUnavailable"
            onKeyPress={(e) => {
              if (e.key === 'Enter') setHideUnavailable(e.target.value == "true")
            }}
          />
          <TextField
            label="capacity"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                  const newFilter: Filters = {...filters};  
                  newFilter.capacity = e.target.value ? +e.target.value : 0;
                  setFilters(newFilter)
                }
              }
            }
          />
          <TextField
            label="sort"
            onKeyPress={(e) => {
              if (e.key === 'Enter') setSort(e.target.value)
            }}
          />

          {/* 
          <StyledTabs
            value={selection}
            onChange={(_e: React.SyntheticEvent, newValue: string) => {
              setSelection(newValue);
            }}
            centered
            aria-label="upper or lower campus selector"
            sx={(theme) => ({
              marginLeft: theme.spacing(3),
            })}
          >
            <StyledTab label="Upper Campus" value="upper" />
            <StyledTab label="Lower Campus" value="lower" />
          </StyledTabs>
           */}
          <div />
          <ButtonGroup>
            <Stack direction="row" spacing={1.5}>
              <Button aria-label="Search">
                <SearchIcon />
              </Button>
              <Button>Map</Button>
            </Stack>
          </ButtonGroup>
        </AppBar>
        <Main open={drawerOpen}>
          {/* selection === "upper" ? (
            <UpperBuildings setCurrentBuilding={setCurrentBuilding} />
          ) : (
            <p>
              Todo: load lower campus buildings{buildings} {isLoading}{" "}
              {`${isError}`}
            </p>
          )*/}
          <CardList
            data={data}
            setBuilding={setCurrentBuilding}
            sortOrder={sort}
            searchQuery={query}
            hideUnavailable={hideUnavailable}
            statusData={roomsData}
          />
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
            statusData={roomsData}
          />
        </Drawer>
      </Box>
    </Container>
  );
};

export async function getStaticProps() {
  // fetches /buildings via **BUILD** time so we don't need to have
  // the client fetch buildings data every request
  const res = await fetch(server + "/buildings");
  let buildings: BuildingReturnData = await res.json();
  buildings.buildings.sort((a, b) => a.name.localeCompare(b.name));
  return {
    props: {
      data: buildings,
    },
  };
}

const fetchRoomStatus = (
  filter: Filters | null,
  datetime: Date | null,
  setRoomsData: (roomsData: RoomsReturnData) => void
): void => {
  const params: RoomsRequestParams = {};
  if (datetime) params.datetime = `${DateTime.fromJSDate(datetime).toFormat(
    "yyyy-MM-dd"
  )}T${DateTime.fromJSDate(datetime).toFormat("HH:mm")}`
  if (filter !== null) {
    if (filter.capacity > 0) params.capacity = filter.capacity;
    if (filter.usage !== null) params.usage = filter.usage;
    if (filter.location !== null) params.usage = filter.location;
    if (filter.duration > 0) params.duration = filter.duration;
  }

  axios
    .get(server + "/rooms", {params: params})
    .then((res) => {
      setRoomsData(res.status == 200 ? res.data as RoomsReturnData : {});
    })
    .catch((err) => setRoomsData({}));
}

const drawerWidth = 400;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })<{
  open?: boolean;
}>(({ theme, open }) => ({
  display: "flex",
  flexDirection: "row",
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
