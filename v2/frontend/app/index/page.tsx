'use client';

import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import { styled } from "@mui/material/styles";
import React from "react";

import Landing from "../../components/Landing";
import { setCurrentBuilding } from "../../redux/currentBuildingSlice";
import { useDispatch } from "../../redux/hooks";


const Home = () => {
  // There should be no current building on landing page
  const dispatch = useDispatch();
  dispatch(setCurrentBuilding(null));

  return (
    <Container maxWidth={false}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <Main>
          <Landing />
        </Main>
      </Box>
    </Container>
  );
};

const Main = styled("main")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  flexGrow: 1,
  padding: theme.spacing(12, 0),
  maxHeight: "100vh",
}));

export default Home;