import { Typography } from "@mui/material";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/system";
import Link from "next/link";
import { RoomAvailabilityBoxProps } from "views/RoomAvailabilityBox";

import RoomAvailability from "./RoomAvailability";

type AllRoomsRoomProps = Pick<
  RoomAvailabilityBoxProps,
  "roomNumber" | "roomStatus"
>;

const Room: React.FC<AllRoomsRoomProps> = ({ roomNumber, roomStatus }) => {
  return (
    <Link href={`/room/${roomNumber}`}>
      <RoomDetails>
        <Typography
          sx={{
            fontWeight: "bold",
            fontSize: { sm: "0.9em", md: "0.95em" },
          }}
        >
          {roomNumber}
        </Typography>
        <RoomAvailability roomStatus={roomStatus} />
      </RoomDetails>
    </Link>
  );
};

const RoomDetails = styled(Stack)(({ theme }) => ({
  flexDirection: "row",
  justifyContent: "space-between",
  height: "fit-content",
  borderRadius: 4,
  borderStyle: "solid",
  borderColor: "black",
  borderWidth: "thin",
  margin: theme.spacing(0, 0, 1.25),
  padding: theme.spacing(1.25, 2.5, 1.25, 2.25),
  cursor: "pointer",
  "&:hover": {
    border: "1px solid",
    borderColor: theme.palette.primary.main,
  },
}));

export default Room;
