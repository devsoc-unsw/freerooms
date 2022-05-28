/*
  This is the home page (list view of all the buildings)
*/

import React from "react";
import { server } from "../config";
import { DateTime } from "luxon";
import {
  Room,
  RoomStatus,
  BuildingRoomReturnStatus,
  Building,
  BuildingReturnData,
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
import CircularProgress from "@mui/material/CircularProgress";

import StatusDot from "../components/StatusDot";
import Branding from "../components/Branding";
import Button from "../components/Button";
import BuildingCard from "../components/BuildingCard";

const INITIALISING = -2;
const FAILED = -1;

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

  React.useEffect(() => {
    console.log("building", building);
    if (building) {
      const buildingData = data.buildings.find((b) => b.id === building);
      if (buildingData) {
        setCurrentBuilding(buildingData);
        router.replace("/", undefined, { shallow: true });
      }
    }
  }, [building]);

  const drawerOpen = currentBuilding ? true : false;

  const [date, setDate] = React.useState<DateTime>(DateTime.now());
  const [sort, setSort] = React.useState<"name" | "available">("name");
  const [rooms, setRooms] = React.useState<Room[]>([]);
  const { data: roomsData, error: roomsError } =
    useSWR<BuildingRoomReturnStatus>(
      currentBuilding
        ? {
            url: server + "/buildings/" + currentBuilding!.id,
            config: { params: { datetime: date.toFormat("yyyy-MM-dd HH:mm") } },
          }
        : null
    );

  const BuildingInfo = () =>
    currentBuilding ? (
      <MainBox>
        <StatusBox>
          {roomsData ? (
            <>
              {roomsError ? (
                <StatusDot
                  colour={
                    rooms.filter((r) => r.status === "free").length >= 5
                      ? "green"
                      : rooms.filter((r) => r.status === "free").length !== 0
                      ? "orange"
                      : "red"
                  }
                />
              ) : null}
              <Typography sx={{ fontSize: 12, fontWeight: 500 }}>
                {roomsData && !roomsError
                  ? `${rooms.length} room${
                      rooms.length === 1 ? "" : "s"
                    } available`
                  : "data unavailable"}
              </Typography>
            </>
          ) : (
            <CircularProgress size={20} thickness={5} disableShrink />
          )}
        </StatusBox>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            flexWrap: "wrap",
            margin: 10,
          }}
        >
          <StyledImage
            src={`/assets/building_photos/${currentBuilding!.id}.png`}
            layout="fill"
            objectFit="cover"
            priority={true}
          />
        </div>

        <TitleBox>
          <Typography sx={{ fontSize: 16, fontWeight: 500 }}>
            {currentBuilding!.name}
          </Typography>
        </TitleBox>
      </MainBox>
    ) : (
      <></>
    );

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
          <Branding />
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
          <div
            style={{
              width: "100%",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gridGap: "20px",
            }}
          >
            {data.buildings.map((building) => (
              <BuildingCard
                building={building}
                key={building.id}
                setBuilding={setCurrentBuilding}
              />
            ))}
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
          <BuildingInfo />
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
  console.log(buildings);
  return {
    props: {
      data: buildings,
    },
  };
}

const MainBox = styled(Box)<BoxProps>(({ theme }) => ({
  position: "relative",
  flex: 1,
  backgroundColor: theme.palette.primary.main,
  height: 385,
  borderRadius: 10,
  "&:hover": {
    cursor: "pointer",
  },
}));

const StyledImage = styled(Image)<ImageProps>(({ theme }) => ({
  borderRadius: 10,
  transition: "all 0.1s ease-in-out",
  "&:hover": {
    opacity: 0.7,
  },
}));

const StatusBox = styled(Box)<BoxProps>(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  borderRadius: 15,
  backgroundColor: "white",
  padding: 10,
  paddingLeft: 15,
  paddingRight: 15,
  margin: 10,
  pointerEvents: "none",
}));

const TitleBox = styled(Box)<BoxProps>(({ theme }) => ({
  display: "flex",
  borderRadius: 10,
  position: "absolute",
  bottom: 0,
  left: 0,
  right: 0,
  backgroundColor: theme.palette.primary.main,
  color: "white",
  padding: 15,
  paddingLeft: 20,
  paddingRight: 20,
  margin: 10,
  pointerEvents: "none",
}));

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
