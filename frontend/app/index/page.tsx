'use client';

import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
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
      <Main>
        <Landing />
      </Main>
    </Container>
  );
};

const Main = styled(Stack)(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(12, 0),
}));

export default Home;