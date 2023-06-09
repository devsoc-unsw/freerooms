import "../styles/button.css";

import GridViewRoundedIcon from '@mui/icons-material/GridViewRounded';
import MapIcon from '@mui/icons-material/Map';
import { Typography } from "@mui/material";
import Image from "next/image";
import React from "react";

import Button from "../components/Button";
import parentLogo from "../public/assets/favicon/csesocgreyblue.png";
import Logo from "../public/assets/favicon/free_rooms_logo.png";

const Landing = () => {
  return (
    <div id={"LandingScreenWhole"} style={{
      height: "95vh",
      width: "80vw",
      maxWidth: "100rem",
      margin: "auto",
      justifyContent: "center",
    }}>
      <div style={{ width: "auto", display: "flex", flexDirection: "column", margin: "auto" }}>
        <div style={{ width: "auto", margin: 0, justifyContent: "flex-start", display: "flex", flexDirection: "row" }}>
          <Image style={{ margin: 0, padding: 0 }} alt={"CSESOC Logo"} width={110} height={25} src={parentLogo} />
        </div>
        <h1 id={"FreeroomsTitle"}>
          Freerooms
        </h1>
        <p id={"FreeroomsBlurb"} style={{ textAlign: "left", fontWeight: "700" }}>
          UNSW room bookings
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <Button href="/browse" sx={{ width: "13rem" }} endIcon={<GridViewRoundedIcon/>}>
            <Typography fontWeight="bold">Browse</Typography>
          </Button>
          <Button href="/map" sx={{ width: "13rem" }} endIcon={<MapIcon/>}>
            <Typography fontWeight="bold">Map</Typography>
          </Button>
        </div>
      </div>
      <div id={"landing-freerooms-logo"} style={{ width: "auto", margin: "auto" }}>
        <Image width={400} height={400} alt={"Freerooms Logo"} src={Logo} />
      </div>
    </div>
  );
};

export default Landing;