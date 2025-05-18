import { Building } from "@common/types";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import { alpha } from "@mui/material";
import { Fade } from "@mui/material";
import { Typography } from "@mui/material";
import Box, { BoxProps } from "@mui/material/Box";
import { styled, useTheme } from "@mui/material/styles";
import Image, { ImageProps } from "next/image";
import React from "react";

import {
  selectCurrentBuilding,
} from "../redux/currentBuildingSlice";
import { useDispatch, useSelector } from "../redux/hooks";

const FlagMarker: React.FC<{
  currentHover: Building | null;
  setCurrentHover: (building: Building | null) => void;
}> = ({ currentHover, setCurrentHover }) => {
  const inconspeciousBuilding: Building = {
    name: "???",
    id: "???",
    lat: -33.917,
    long: 151.235664,
    aliases: [],
  };
  const building = inconspeciousBuilding;
  const theme = useTheme();

  const freerooms = 0;
  const totalRooms = 0;

  const dispatch = useDispatch();
  const currentBuilding = useSelector(selectCurrentBuilding);
  const isCurrentBuilding = currentBuilding?.id === building?.id;

  const [showPopup, setShowPopup] = React.useState(false);
  // React.useEffect(() => {
  //   setShowPopup(currentHover?.id === building?.id);
  // }, [currentHover, building]);

  const [colour, setColour] = React.useState("#e57373");
    React.useEffect(() => {
      setShowPopup(currentHover?.id === building?.id);
    }, [currentHover, building]);

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
        setCurrentHover(inconspeciousBuilding);
      }}
      onMouseLeave={() => {
        setCurrentHover(null);
      }}
    >
      <Typography
        sx={{
          fontSize: 11,
          fontWeight: 500,
          textShadow:
            theme.palette.mode === "light"
              ? "-.5px -.5px 1px #f2f2f2, .5px -.5px 1px #f2f2f2, -.5px .5px 1px #f2f2f2, .5px .5px 1px #f2f2f2"
              : "",
          color: theme.palette.text.primary,
        }}
      >
        Flag
      </Typography>
      <Box
        sx={(theme) => ({
          width: 18,
          height: 18,
          borderRadius: "50%",
          border: isCurrentBuilding ? `5px solid ${colour}` : "4px solid white",
          backgroundColor: isCurrentBuilding ? "white" : colour,
          boxShadow: isCurrentBuilding
            ? `0px 0px 6px 4px ${alpha(colour, 0.5)}`
            : "",
          position: "relative",
          "&:hover": {
            cursor: "pointer",
          },
        })}
        onClick={() => console.log("flag found!")}
      />
      <Fade in={showPopup} timeout={200}>
        <div style={{ position: "relative", bottom: -3 }}>
          <MarkerHover freerooms={freerooms} totalRooms={totalRooms} />
        </div>
      </Fade>
    </div>
  );
};

const MarkerHover: React.FC<{
  freerooms: number;
  totalRooms: number;
}> = ({ freerooms, totalRooms }) => {
  const MainBox = styled(Box)<BoxProps>(({ theme }) => ({
    position: "absolute",
    flex: 1,
    backgroundColor: theme.palette.primary.main,
    height: 200,
    width: 300,
    borderRadius: 20,
    overflow: "hidden",
    boxShadow: "1px 1px 5px #1f1f1f",
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
        alt={`Image of ???`}
        src={`/assets/building_photos/flag.webp`}
        fill={true}
        priority={true}
      />
      <TitleBox>
        <Typography sx={{ fontSize: 15, fontWeight: 500 }}>???</Typography>
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
        </InfoBox>
      </TitleBox>
    </MainBox>
  );
};

export default FlagMarker;
