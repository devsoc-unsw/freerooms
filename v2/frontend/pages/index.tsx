/*
  This is the home page (list view of all the buildings)
*/

import React from "react";
import type { NextPage } from "next";
import Head from "next/head";

import ListView from "../views/ListView";

const Home: NextPage = () => {
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
      <ListView />
    </>
  );
};

export default Home;
