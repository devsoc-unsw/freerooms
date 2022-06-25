import React, { useRef } from "react";
import useSWR from "swr";
import { DateTime } from "luxon";
import { server } from "../config";
import {
  Room,
  RoomStatus,
  Building,
  BuildingReturnData,
  BuildingRoomReturnStatus,
} from "../types";

import Image, { ImageProps } from "next/image";
import { styled } from "@mui/material/styles";
import Box, { BoxProps } from "@mui/material/Box";
import StatusDot from "../components/StatusDot";
import { Typography } from "@mui/material";
import MuiAppBar from "@mui/material/AppBar";
import CircularProgress from "@mui/material/CircularProgress";

const INITIALISING = -2;
const FAILED = -1;

const AppBar = styled(MuiAppBar)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  color: theme.palette.getContrastText(theme.palette.background.default),
  boxShadow: "none",
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  padding: theme.spacing(2, 1),
}));

const MainBox = styled(Box)<BoxProps>(({ theme }) => ({
  position: "relative",
  flex: 1,
  backgroundColor: '#FAFAFA',
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
  backgroundColor: "white",
  padding: 10,
  paddingLeft: 15,
  paddingRight: 15,
  margin: 10,
  pointerEvents: "none",
  color: "black",
}));

const TitleBox = styled(Box)<BoxProps>(({ theme }) => ({
  display: "flex",
  borderRadius: 10,
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  backgroundColor: "white", 
  //backgroundColor: theme.palette.primary.main,
  color: "Black",
  padding: 15,
  paddingLeft: 20,
  paddingRight: 20,
  margin: 10,
  pointerEvents: "none",
}));


const BuildingInfo: React.FC<{
  building: Building | null;
  onClose?: () => void;
}> = ({ building }) => {
  if (!building) return <></>;

  const [date, setDate] = React.useState<DateTime>(DateTime.now());
  const [sort, setSort] = React.useState<"name" | "available">("name");
  

  const { data: roomsData, error: roomsError } =
      (useSWR<BuildingRoomReturnStatus>(
        building ? server + "/buildings/" + building!.id : null
    ));
    
  const rooms = (roomsData ? Object.values(roomsData['rooms']) : null)


  return (
    <MainBox>

      <StatusBox>
        {/* allowing this will block the status box info ? maybe we should just have the building name below */}
        {/* <TitleBox>
          <Typography sx={{ fontSize: 16, fontWeight: 500 }}>
            {building!.name}
          </Typography>
        </TitleBox> */}
        {/* apparently for every if statement if we reverse it would be right but I don't understand why??? */}
        
        
        {roomsData ? (
          <>
            {roomsError ? null : (
              <StatusDot
                
                
                colour={
                  rooms ? (
                    (rooms.filter((r: { status: string; }) => r.status === "free").length) >= 5
                      ? "green"
                      : rooms.filter((room: { status: string; }) => room.status === "free").length !== 0
                      ? "orange"
                      : "red"
                  ): "red"
                }
              />
            ) }
            <Typography sx={{ fontSize: 12, fontWeight: 500 }}>
              {/* this allows the appear of building name */}
              {/* <TitleBox>
                <Typography sx={{ fontSize: 16, fontWeight: 500 }}>
                  {building!.name}
                </Typography>
              </TitleBox> */}
              {building!.name}
              <br />
              {(roomsData && !roomsError)
                ? `${(rooms.filter((r: { status: string; }) => r.status === "free").length)} room${
                  (rooms.filter((r: { status: string; }) => r.status === "free").length) === 1 ? "" : "s"
                  } available`
                : "data unavailable"}
            </Typography>
          </>
        ) : (
          // apparently all the things above failed and this one is not working :))
          <CircularProgress size={20} thickness={5} disableShrink />
        )}
      </StatusBox>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          flexWrap: "wrap",
          margin: 10,
          paddingTop: 25
        }}
      >
        <StyledImage
          src={`/assets/building_photos/${building!.id}.png`}

          width = "946px"
          height= "648px"
          //layout = "fill"
          objectFit="cover"
          priority={true}
        />
      </div>

      
    </MainBox>
  );
};

export default BuildingInfo;
