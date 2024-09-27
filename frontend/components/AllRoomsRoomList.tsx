import Stack from "@mui/material/Stack";
import { styled } from "@mui/system";

const RoomList = styled(Stack)(({ theme }) => ({
  flexDirection: "column",
  flexGrow: 5,
  maxHeight: "calc(100vh - 225px)",
  overflowY: "auto",
  [theme.breakpoints.down("md")]: {
    width: "100%",
    marginTop: 14,
  },
  [theme.breakpoints.up("md")]: {
    width: "75%",
    marginLeft: 0,
    marginTop: 0,
  },
}));

export default RoomList;
