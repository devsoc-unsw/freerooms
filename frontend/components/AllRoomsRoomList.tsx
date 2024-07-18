import Stack from "@mui/material/Stack";
import { styled } from "@mui/system";

const RoomList = styled(Stack)(({ theme }) => ({
  flexDirection: "column",
  flexGrow: 5,
  [theme.breakpoints.down("md")]: {
    width: "100%",
    marginTop: 10,
  },
  [theme.breakpoints.up("md")]: {
    width: "75%",
    marginLeft: 10,
  },
  backgroundColor: "blue",
}));

export default RoomList;
