import React from "react";
import useSWR from "swr";
import { BuildingData, BuildingRoomStatus } from "../types";
import Image, { ImageProps } from "next/image";
import { styled } from "@mui/material/styles";
import Box, { BoxProps } from "@mui/material/Box";
import StatusDot from "./StatusDot";
import { Typography } from "@mui/material";
import Link from "next/link";

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

const calculateFreerooms = (rooms: BuildingRoomStatus[]) => {
  let freerooms = 5;
  // {message: 'unable to verify the first certificate', status: 400}
  console.log(rooms);
  return freerooms;
};

const BuildingCard: React.FC<{
  building: BuildingData;
}> = ({ building }) => {
  const { data, error } = useSWR<BuildingRoomStatus[]>(
    // TODO: change this when deploying
    "/buildings/" + building.id
  );
  const [freerooms, setFreeRooms] = React.useState(0);
  React.useEffect(() => {
    if (data && !error) setFreeRooms(calculateFreerooms(data));
  }, [data]);

  return (
    <Link scroll={false} href={`/?building=${building.id}`}>
      <MainBox>
        <StyledImage
          src={`/assets/building_photos/${building.id}.png`}
          layout="fill"
          objectFit="cover"
        />
        <StatusBox>
          <StatusDot
            colour={
              freerooms >= 5 ? "green" : freerooms !== 0 ? "orange" : "red"
            }
          />
          <Typography sx={{ fontSize: 12, fontWeight: 500 }}>
            {freerooms} rooms available
          </Typography>
        </StatusBox>
        <TitleBox>
          <Typography sx={{ fontSize: 16, fontWeight: 500 }}>
            {building.name}
          </Typography>
        </TitleBox>
      </MainBox>
    </Link>
  );
};

export default BuildingCard;
