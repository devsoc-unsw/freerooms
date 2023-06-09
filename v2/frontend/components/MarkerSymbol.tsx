import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import RoomIcon from "@mui/icons-material/Room";
import { Fade } from "@mui/material";
import { Typography } from "@mui/material";
import Box, { BoxProps } from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import Image, { ImageProps } from "next/image";
import React from "react";

import { Building } from "../types";

const MarkerSymbol: React.FC<{
  building: Building;
  freerooms: number;
  totalRooms: number;
  distance: number | undefined;
  setBuilding: (building: Building) => void;
  setCurrentHover: (building: Building | null) => void;
}> = ({
  building,
  freerooms,
  totalRooms,
  distance,
  setBuilding,
  setCurrentHover,
}) => {
  const [showPopup, setShowPopup] = React.useState(false);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        position: "relative",
        transform: "translate(-50%, -50%)",
      }}
      onMouseEnter={() => {
        setShowPopup(true);
        setCurrentHover(building);
      }}
      onMouseLeave={() => {
        setShowPopup(false);
        setCurrentHover(null);
      }}
    >
      <Typography sx={{ fontSize: 10, fontWeight: 500 }}>
        {building.name}
      </Typography>
      <Box
        sx={(theme) => ({
          width: 18,
          height: 18,
          borderRadius: "50%",
          border: "4px solid white",
          backgroundColor:
            freerooms >= 5
              ? theme.palette.success.light
              : freerooms !== 0
              ? theme.palette.warning.light
              : theme.palette.error.light,
          position: "relative",
          "&:hover": {
            cursor: "pointer",
          },
        })}
        onClick={() => setBuilding(building)}
      />
      <Fade in={showPopup} timeout={200}>
        <div style={{ position: "relative", bottom: -3 }}>
          <MarkerHover
            building={building}
            freerooms={freerooms}
            totalRooms={totalRooms}
            distance={distance}
          />
        </div>
      </Fade>
    </div>
  );
};

const MarkerHover: React.FC<{
  building: Building;
  freerooms: number;
  totalRooms: number;
  distance: number | undefined;
}> = ({ building, freerooms, totalRooms, distance }) => {
  const MainBox = styled(Box)<BoxProps>(({ theme }) => ({
    position: "absolute",
    flex: 1,
    backgroundColor: theme.palette.primary.main,
    height: 200,
    width: 300,
    borderRadius: 20,
    overflow: "hidden",
    boxShadow: "1px 1px 5px black",
  }));

  const StyledImage = styled(Image)<ImageProps>(({ theme }) => ({
    objectFit: "cover",
  }));

  const InfoBox = styled(Box)<BoxProps>(({ theme }) => ({
    display: "flex",
    flexDirection: "row",
    pointerEvents: "none",
    alignItems: "center",
    fontSize: "small",
    gap: 10,
  }));

  const TitleBox = styled(Box)<BoxProps>(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: theme.palette.primary.main,
    color: "white",
    borderRadius: 8,
    padding: 8,
    paddingLeft: 12,
    paddingRight: 12,
    margin: 10,
    pointerEvents: "none",
  }));

  return (
    <MainBox>
      <StyledImage
        alt={`Image of ${building.id}`}
        src={`/assets/building_photos/${building.id}.webp`}
        fill={true}
        priority={true}
      />
      <TitleBox>
        <Typography sx={{ fontSize: 15, fontWeight: 500 }}>
          {building.name}
        </Typography>
        <InfoBox>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <MeetingRoomIcon />
            <Typography sx={{ fontSize: 13, fontWeight: 500 }}>
              {`${freerooms}/${totalRooms} available`}
            </Typography>
          </div>
          {distance && (
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <RoomIcon />
              <Typography sx={{ fontSize: 13, fontWeight: 500 }}>
                {`${distance} m`}
              </Typography>
            </div>
          )}
        </InfoBox>
      </TitleBox>
    </MainBox>
  );
};

export default MarkerSymbol;
