import "../styles/button.css";

import Button, { ButtonProps } from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

import parentLogo from "../public/assets/favicon/csesocgreyblue.png";
import Logo from "../public/assets/favicon/free_rooms_logo.png";
import theme from "./Theme";

const StartBrowsingButton = styled(Button)<ButtonProps>(() => ({
  backgroundColor: "#111",
  color: "white",
  border: "none",
  borderRadius: "2rem",
  margin: "1rem 0",
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "0 9%",
  zIndex: 200,
  textTransform: "none",
  transition: "all 0.1s ease-in-out",
  "&:hover": {
    backgroundColor: theme.palette.primary.main,
    color: "#fff",
  },
}));

const Landing = () => {
  const router = useRouter();


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
          <a className={"button-gradient"} style={{ gap: "1rem", width: "13rem" }} href={"/browse"} id={"FreeroomsCTA"}>
            <p style={{ fontWeight: "600" }}>Browse</p>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                 stroke="currentColor" className="w-6 h-6">
              <path
                    d="M15.75 15.75l-2.489-2.489m0 0a3.375 3.375 0 10-4.773-4.773 3.375 3.375 0 004.774 4.774zM21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </a>
          <a className={"button-gradient"} style={{ gap: "1rem", width: "13rem" }} href={"/map"} id={"FreeroomsCTA"}>
            <p style={{ fontWeight: "600" }}>Map</p>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                 stroke="currentColor" className="w-6 h-6">
              <path d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
              <path
                    d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
            </svg>
          </a>
        </div>
      </div>
      <div id={"landing-freerooms-logo"} style={{ width: "auto", margin: "auto" }}>
        <Image width={400} height={400} alt={"Freerooms Logo"} src={Logo} />
      </div>
    </div>
  );
};

export default Landing;