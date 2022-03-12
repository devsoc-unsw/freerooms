/*
  This is the home page (list view of all the buildings)
*/

import React from "react";
import type { NextPage } from "next";
import Head from "next/head";

import Drawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Container from "@mui/material/Container";
import { styled } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import SearchIcon from "@mui/icons-material/Search";

import Branding from "../components/Branding";
import Button from "../components/Button";
import { StyledTabs, StyledTab } from "../components/StyledTabs";
import UpperBuildings from "../views/UpperBuildings";

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

const Home: NextPage = () => {
  const [selection, setSelection] = React.useState<string>("upper");
  const [currentBuilding, setCurrentBuilding] = React.useState<string | null>(
    null
  ); // use BuildingID here

  const drawerOpen = () => (currentBuilding ? true : false);

  return (
    <>
      <Head>
        <title>Freerooms</title>
        <meta
          name="description"
          content="A web application designed to aid UNSW students in finding vacant rooms."
        />
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <Container maxWidth={false}>
        <Box sx={{ display: "flex" }}>
          <CssBaseline />
          <AppBar position="fixed" open={drawerOpen()}>
            <Branding />
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
            <ButtonGroup>
              <Stack direction="row" spacing={1.5}>
                <Button aria-label="Search">
                  <SearchIcon />
                </Button>
                <Button>Map</Button>
              </Stack>
            </ButtonGroup>
          </AppBar>
          <Main open={drawerOpen()}>
            {selection === "upper" ? (
              <UpperBuildings setCurrentBuilding={setCurrentBuilding} />
            ) : (
              <p>Todo: load lower campus buildings</p>
            )}
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
            open={drawerOpen()}
          >
            <Divider />
            currently selected: {currentBuilding}
          </Drawer>
        </Box>
      </Container>
    </>
  );
};

export default Home;
