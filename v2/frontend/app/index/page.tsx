'use client';

import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import { styled } from "@mui/material/styles";
import React from "react";

import Landing from "../../components/Landing";


const Home = () => {
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

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })<{
  open?: boolean;
}>(({ theme, open }) => ({
  display: "flex",
  flexDirection: "column",
  flexGrow: 1,
  padding: theme.spacing(12, 0),
  maxHeight: "100vh",
}));

export default Home;