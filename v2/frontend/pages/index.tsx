import type { NextPage } from "next";
import Head from "next/head";
import { Container, MantineProvider } from "@mantine/core";

import ListView from "../views/ListView";

const Home: NextPage = () => {
  return (
    <MantineProvider theme={{ fontFamily: "Roboto", primaryColor: "orange" }}>
      <Head>
        <title>Freerooms</title>
        <meta
          name="description"
          content="A web application designed to aid UNSW students in finding vacant rooms."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container fluid style={{ padding: 0 }}>
        <ListView />
      </Container>
    </MantineProvider>
  );
};

export default Home;
