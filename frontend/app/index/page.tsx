'use client';

import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import React from "react";

import Landing from "../../components/Landing";


const Home = () => {
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