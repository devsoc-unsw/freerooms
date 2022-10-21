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
import BuildingInfo from "../views/BuildingInfo";
<<<<<<< HEAD
import SearchBar from "../components/SearchBar";
=======
import CardList from "../views/CardList";
import axios from "axios";
>>>>>>> origin/FREE-58-building-card-shuffling

const Home: NextPage<{ buildingData: BuildingReturnData }> = ({ buildingData }) => {
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

  // State variables to be used by the various new features
  const [sort, setSort] = React.useState<string>("alphabetical");
  const [query, setQuery] = React.useState<string>("");
  const [datetime, setDatetime] = React.useState<Date | null>(new Date());
  const [filters, setFilters] = React.useState<Filters>({});

  const [roomStatusData, setRoomStatusData] = React.useState<RoomsReturnData | undefined>();
  const fetchRoomStatus = () => {
    const params: RoomsRequestParams = { ...filters };
    if (datetime) {
      params.datetime = DateTime.fromJSDate(datetime).toFormat("yyyy-MM-dd'T'HH:mm");
    }

    axios.get(server + "/rooms", { params: params })
      .then((res) => {
        setRoomStatusData(res.status == 200 ? res.data : {});
      })
      .catch((err) => setRoomStatusData({}));
  }

  React.useEffect(() => {
    setRoomStatusData(undefined);
    fetchRoomStatus();
  }, [filters, datetime]);

  const [currentBuilding, setCurrentBuilding] = React.useState<Building | null>(
    null
  );

  React.useEffect(() => {
    if (building) {
      const selectedBuilding = buildingData.buildings.find((b) => b.id === building);
      if (selectedBuilding) {
        setCurrentBuilding(selectedBuilding);
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
              <SearchBar
                open={true}
                setOpen={function (open: boolean): void {
                  throw new Error("Function not implemented.");
                }}
              ></SearchBar>
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
            buildingData={buildingData}
            setCurrentBuilding={setCurrentBuilding}
            sort={sort}
            query={query}
            roomStatusData={roomStatusData}
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
            roomStatusData={roomStatusData}
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
  const buildings: BuildingReturnData = await res.json()
  // const buildings: BuildingReturnData = { buildings: [] };
  return {
    props: {
      buildingData: buildings,
    },
  };
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
