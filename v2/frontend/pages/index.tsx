/*
  This is the home page (list view of all the buildings)
*/

import SearchIcon from "@mui/icons-material/Search";
import { BoxProps, Typography } from "@mui/material";
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
import Image, { ImageProps } from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import useSWR from "swr";

import Branding from "../components/Branding";
import Button from "../components/Button";
import Landing from "../components/Landing";
import SearchBar from "../components/SearchBar";
import { API_URL } from "../config";
import {
  Building,
  BuildingReturnData,
  Filters,
  RoomsRequestParams,
  RoomsReturnData,
  RoomStatus,
} from "../types";
import BuildingInfo from "../views/BuildingInfo";
import CardList from "../views/CardList";

const Home: NextPage<{ buildingData: BuildingReturnData }> = ({
  buildingData,
}) => {
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

  const [roomStatusData, setRoomStatusData] = React.useState<
    RoomsReturnData | undefined
  >();
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

  React.useEffect(() => {
    setRoomStatusData(undefined);
    fetchRoomStatus();
  }, [filters, datetime]);

  const [currentBuilding, setCurrentBuilding] = React.useState<Building | null>(
    null
  );

  React.useEffect(() => {
    if (building) {
      const selectedBuilding = buildingData.buildings.find(
        (b) => b.id === building
      );
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
            justifyContent: "center",
            alignItems: "center",
          })}
        >
          <Branding
            onClick={() => {
              setCurrentBuilding(null);
            }}
          />
          <SearchBar setQuery={setQuery}></SearchBar>
          <div />
          <ButtonGroup>
            <Stack direction="row" spacing={1.5}>
              <Button>Map</Button>
            </Stack>
          </ButtonGroup>
        </AppBar>
        <Main open={drawerOpen}>
          <Landing/>
          {/* selection === "upper" ? (
            <UpperBuildings setCurrentBuilding={setCurrentBuilding} />
          ) : (
            <p>
              Todo: load lower campus buildings{buildings} {isLoading}{" "}
              {`${isError}`}
            </p>
          )*/}
          <div id={"Home-Building-Tiles"}>
            <CardList
              buildingData={buildingData}
              setCurrentBuilding={setCurrentBuilding}
              sort={sort}
              query={query}
              roomStatusData={roomStatusData}
            />
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

export async function getStaticProps() {
  // fetches /buildings via **BUILD** time so we don't need to have
  // the client fetch buildings data every request
  
  let buildings: BuildingReturnData;
  try {
    const res = await fetch(API_URL + "/buildings");
    buildings = await res.json();
  } catch {
    buildings = { buildings: [] };
  }
  
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

const StyledImage = styled(Image)<ImageProps>(({ theme }) => ({
  borderRadius: 10,
  transition: "all 0.1s ease-in-out",
  "&:hover": {
    opacity: 0.7,
  },
}));

export default Home;
