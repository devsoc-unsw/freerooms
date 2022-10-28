import React from "react";
import Image from "next/image";

const Landing: React.FC = () => {
  return (
    <div style={{
      height: "95vh",
      width: "80vw",
      maxWidth: "100rem",
      margin: "auto",
      display: "flex",
      flexDirection: "row",
      justifyContent: "center",
      paddingBottom: "15vh",
      overflow: "scroll"
    }}>
      <div style={{ width: "auto", display: "flex", flexDirection: "column", margin: "auto"}}>
        <div style={{ width: "auto", margin: 0, justifyContent: "flex-start", display: "flex", flexDirection: "row"}}>
          <Image style={{margin: 0, padding: 0}} alt={"CSESOC Logo"} width={50} height={50} src={"/../public/assets/favicon/logo.png"} />
          <p>
            presents
          </p>
        </div>
        <h1 id={"FreeroomsTitle"} style={{
          fontFamily: "Josefin Sans",
          textAlign: "left",
          fontSize: "5rem",
          fontWeight: "700",
          margin: "0 0",
          paddingBottom: 0
        }}>
          Freerooms
        </h1>
        <p id={"FreeroomsBlurb"} style={{ textAlign: "left", fontSize: "1.5rem", fontWeight: "700" }}>
          Find unallocated CATS rooms at UNSW
        </p>
        <button onClick={() => {
          let position: number;
          // @ts-ignore
          position = document.querySelector("#Home-Building-Tiles").getBoundingClientRect().top;
          window.scrollTo({ left: 0, top: position - 100, behavior: "smooth" });
        }} style={{
          backgroundColor: "#111",
          color: "white",
          width: "15rem",
          height: "3rem",
          border: "none",
          borderRadius: "2rem",
          margin: "2rem 0",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 9%",
        }}>
          <p style={{ fontSize: "1rem", fontWeight: "600" }}>Start Browsing!</p>
          <svg style={{ width: "2rem" }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
               strokeWidth="1.5"
               stroke="currentColor" className="w-2 h-2">
            <path strokeLinecap="round" strokeLinejoin="round"
                  d="M9 12.75l3 3m0 0l3-3m-3 3v-7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
      </div>
      <div id={"landing-freerooms-logo"} style={{ width: "auto", margin: "auto" }}>
        <Image width={400} height={400} alt={"Freerooms Logo"} src={"/../public/assets/favicon/free_rooms_logo.png"} />
      </div>
    </div>
  );
};

export default Landing;