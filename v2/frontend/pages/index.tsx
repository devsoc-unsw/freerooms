/*
  This is the home page (list view of all the buildings)
*/

import React from "react";
import type { NextPage } from "next";
import Head from "next/head";

import { server } from "../config";
import { BuildingReturnData } from "../types";
import ListView from "../views/ListView";
import FilterBar from "../components/FilterBar";

const Home: NextPage<{ buildings: BuildingReturnData }> = ({ buildings }) => {
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
      <FilterBar data={buildings} multiSelect={true}/>
      {/* <ListView data={buildings} /> */}
    </>
  );
};

export async function getStaticProps() {
  // fetches /buildings via **BUILD** time so we don't need to have
  // the client fetch buildings data every request
  const res = await fetch(server + "/buildings");
  const buildings: BuildingReturnData = await res.json();
  return {
    props: {
      buildings,
    },
  };
}

export default Home;
