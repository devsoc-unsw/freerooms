import Image from "next/image";
import React from "react";

import parentLogo from "../public/assets/favicon/csesocgreyblue.png";
import Logo from "../public/assets/favicon/free_rooms_logo.png";

const Landing = (props: { setShowLanding: (arg0: boolean) => void; }) => {
  function delay(milliseconds: number | undefined){
    return new Promise(resolve => {
      setTimeout(resolve, milliseconds);
    });
  }
  return (
    <div id={"LandingScreenWhole"} style={{
      height: "95vh",
      width: "80vw",
      maxWidth: "100rem",
      margin: "auto",
      justifyContent: "center"
    }}>
      <div style={{ width: "auto", display: "flex", flexDirection: "column", margin: "auto"}}>
        <div style={{ width: "auto", margin: 0, justifyContent: "flex-start", display: "flex", flexDirection: "row"}}>
          <Image style={{margin: 0, padding: 0}} alt={"CSESOC Logo"} width={110} height={25} src={parentLogo} />
        </div>
        <h1 id={"FreeroomsTitle"}>
          Freerooms
        </h1>
        <p id={"FreeroomsBlurb"} style={{ textAlign: "left", fontWeight: "700" }}>
          Check UNSW room bookings
        </p>
        <button onClick={async () => {
          let position: number;
          // @ts-ignore
          position = document.querySelector("#Home-Building-Tiles").getBoundingClientRect().top;
          if (window.innerWidth > 800) {
            window.scrollBy({ left: 0, top: position - 100, behavior: "smooth" });
          } else {
            window.scrollBy({ left: 0, top: position - 250, behavior: "smooth" });
          }
          await delay(600);
          props.setShowLanding(false)
        }} id={"FreeroomsCTA"} style={{
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
          zIndex: 200
        }}>
          <p style={{ fontWeight: "600" }}>Start Browsing!</p>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
               strokeWidth="1.5"
               stroke="currentColor" className="w-2 h-2">
            <path strokeLinecap="round" strokeLinejoin="round"
                  d="M9 12.75l3 3m0 0l3-3m-3 3v-7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
      </div>
      <div id={"landing-freerooms-logo"} style={{ width: "auto", margin: "auto" }}>
        <Image width={400} height={400} alt={"Freerooms Logo"} src={Logo} />
      </div>
    </div>
  );
};

export default Landing;