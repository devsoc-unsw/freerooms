import Stack from "@mui/material/Stack";
import { styled } from "@mui/system";

const RoomList = styled(Stack)(({ theme }) => ({
  flexDirection: "column",
  flexGrow: 5,
  [theme.breakpoints.down("md")]: {
    width: "100%",
    marginTop: 14,
  },
  [theme.breakpoints.up("md")]: {
    width: "75%",
    marginLeft: 10,
    marginTop: 8,
  },
}));

export default RoomList;
