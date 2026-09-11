"use client";

import FeedbackButton from "@frontend/components/feedback/FeedbackButton";
import FeedbackNotification from "@frontend/components/feedback/FeedbackNotification";
import Landing from "@frontend/components/landing/Landing";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import React from "react";

const Home = () => {
  return (
    <Container maxWidth={false}>
      <Main>
        <FeedbackNotification />
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
