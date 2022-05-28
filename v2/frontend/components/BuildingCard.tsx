import React, { useRef } from "react";
import useSWR from "swr";
import { server } from "../config";
import { Building, BuildingRoomReturnStatus } from "../types";

import Image, { ImageProps } from "next/image";
import { styled } from "@mui/material/styles";
import Box, { BoxProps } from "@mui/material/Box";
import StatusDot from "./StatusDot";
import { Typography } from "@mui/material";
import Link from "next/link";
import CircularProgress from "@mui/material/CircularProgress";
import useOnScreen from "../hooks/useOnScreen";

const INITIALISING = -2;
const FAILED = -1;

const MainBox = styled(Box)<BoxProps>(({ theme }) => ({
  position: "relative",
  flex: 1,
  backgroundColor: theme.palette.primary.main,
  height: 385,
  borderRadius: 10,
  "&:hover": {
    cursor: "pointer",
  },
}));

const StyledImage = styled(Image)<ImageProps>(({ theme }) => ({
  borderRadius: 10,
  transition: "all 0.1s ease-in-out",
  "&:hover": {
    opacity: 0.7,
  },
}));

const StatusBox = styled(Box)<BoxProps>(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  borderRadius: 15,
  position: "absolute",
  top: 0,
  right: 0,
  backgroundColor: "white",
  padding: 10,
  paddingLeft: 15,
  paddingRight: 15,
  margin: 10,
  pointerEvents: "none",
}));

const TitleBox = styled(Box)<BoxProps>(({ theme }) => ({
  display: "flex",
  borderRadius: 10,
  position: "absolute",
  bottom: 0,
  left: 0,
  right: 0,
  backgroundColor: theme.palette.primary.main,
  color: "white",
  padding: 15,
  paddingLeft: 20,
  paddingRight: 20,
  margin: 10,
  pointerEvents: "none",
}));

const calculateFreerooms = (data: BuildingRoomReturnStatus) => {
  if (!data || !data.rooms) return FAILED;
  let freerooms = 0;
  for (const [key, value] of Object.entries(data.rooms)) {
    if (value.status === "free") freerooms++;
  }
  return freerooms;
};

const BuildingCard: React.FC<{
  building: Building;
  setBuilding: (building: Building) => void;
}> = ({ building, setBuilding }) => {
  const ref = useRef();
  const isVisible = useOnScreen(ref);

  const { data, error } = useSWR<BuildingRoomReturnStatus>(
    isVisible ? server + "/buildings/" + building.id : null
  );
  const [freerooms, setFreeRooms] = React.useState(INITIALISING);

  React.useEffect(() => {
    if (isVisible && data) {
      setFreeRooms(calculateFreerooms(data));
    }
  }, [data, isVisible, setFreeRooms, calculateFreerooms]);

  return (
    <MainBox ref={ref} onClick={() => setBuilding(building)}>
      <StyledImage
        src={`/assets/building_photos/${building.id}.png`}
        layout="fill"
        objectFit="cover"
        priority={true}
      />
      <StatusBox>
        {freerooms > INITIALISING ? (
          <>
            {error || freerooms !== FAILED ? (
              <StatusDot
                colour={
                  freerooms >= 5 ? "green" : freerooms !== 0 ? "orange" : "red"
                }
              />
            ) : null}
            <Typography sx={{ fontSize: 12, fontWeight: 500 }}>
              {error || freerooms !== FAILED
                ? `${freerooms} room${freerooms === 1 ? "" : "s"} available`
                : "data unavailable"}
            </Typography>
          </>
        ) : (
          <CircularProgress size={20} thickness={5} disableShrink />
        )}
      </StatusBox>
      <TitleBox>
        <Typography sx={{ fontSize: 16, fontWeight: 500 }}>
          {building.name}
        </Typography>
      </TitleBox>
    </MainBox>
  );
};

export default BuildingCard;
