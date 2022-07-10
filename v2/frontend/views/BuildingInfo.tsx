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
import { ContactPageSharp } from "@mui/icons-material";

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
  justifyContent: "right",
  alignItems: "center",
  borderRadius: 15,
  backgroundColor: "white",
  //padding: 10,
  paddingLeft: 15,
  paddingRight: 65,
  marginBottom: 0,
  marginTop: 15,
  marginRight: 10,
  marginLeft: 10,
  //marginRight: 10,
  pointerEvents: "none",
  color: "black",
  height: 75,
}));

const TitleBox = styled(Box)<BoxProps>(({ theme }) => ({
  display: "flex",
  borderRadius: 10,
  position: "absolute",
  justifyContent: "left",
  alignItems: "center",
  height: 50,
  width: 225,
  top: 5,
  left: 0,
  right: 0,
  backgroundColor: "white",
  //backgroundColor: theme.palette.primary.main,
  color: "Black",
  paddingTop: 15,
  paddingLeft: 20,
  paddingRight: 20,
  //paddingBottom: 20,
  margin: 10,
  marginTop: 15,
  pointerEvents: "none",
}));

const RoomBox = styled(Box)<BoxProps>(({ theme }) => ({
  display: "flex",
  height: 385,
  borderRadius: 10,
  position: "absolute",
  bottom: 0,
  left: 0,
  right: 0,
  backgroundColor: '#F1F1F1',
  margin: 10,
  marginTop: 0,
}));

const IndiviRoomBox = styled(Box)<BoxProps>(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  borderRadius: 10,
  position: "absolute",
  height: 75,
  left: 0,
  right: 0,
  fontSize: 20,
  fontWeight: 500,
  backgroundColor: '#FFFFFF',
  color: "black",
  padding: 5,
  paddingLeft: 20,
  paddingRight: 20,
  margin: 10,
  marginTop: 0,
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



  const rooms = (roomsData && roomsData['rooms'] ? Object.values(roomsData['rooms']) : null)


  return (
    <MainBox>
      <StatusBox>
        <TitleBox>
          <Typography sx={{ fontSize: 16, fontWeight: 500 }}>
            {building!.name}
          </Typography>
        </TitleBox>
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
                  ) : "red"
                }
              />
            )}
            <Typography sx={{ fontSize: 12, fontWeight: 500 }}>

              {(roomsData && !roomsError && rooms)
                ? `${(rooms.filter((r: { status: string; }) => r.status === "free").length)} / ${rooms.length}`
                : "data unavailable"}
            </Typography>
          </>
        ) : (
          // apparently all the things above failed and this one is not working :))
          <CircularProgress size={20} thickness={5} disableShrink />
        )}
      </StatusBox>`



      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          flexWrap: "wrap",
          margin: 10,
          marginTop: 0
          //paddingTop: 25
        }}
      >
        <StyledImage
          src={`/assets/building_photos/${building!.id}.png`}

          width="946px"
          height="648px"
          //layout = "fill"
          objectFit="cover"
          priority={true}
        />
      </div>


      <RoomBox>
        <ul style={{
          width: "100%",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gridGap: "20px",

        }}>
          {roomsData && rooms ? (Object.keys(roomsData['rooms']).map((room_name) => {

            const room = roomsData['rooms'][room_name]
            return (
              room['status'] === 'free' ? <li><IndiviRoomBox>
                {room_name} <text style={{
                  color: '#2AA300', 
                  flex: 1,
                  textAlign: 'center',
                }}> Available Now </text>
              </IndiviRoomBox></li> : <IndiviRoomBox><Typography sx={{ fontSize: 20, fontWeight: 500 }}>
                {room_name} <text style={{ color: '#D30000' }}>  Unavailable</text>
              </Typography></IndiviRoomBox>
            )
          })) : null}
        </ul>


      </RoomBox>

      {/* allowing this will block the status box info ? maybe we should just have the building name below */}
      {/* <TitleBox>
        <Typography sx={{ fontSize: 16, fontWeight: 500 }}>
          {building!.name}
        </Typography>
      </TitleBox> */}


    </MainBox>
  );
};

export default BuildingInfo;
