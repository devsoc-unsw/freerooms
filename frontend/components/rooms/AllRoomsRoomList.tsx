import AllRoomsSearchBar from "@frontend/components/rooms/AllRoomsSearchBar";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/system";

const StyledStack = styled(Stack)(({ theme }) => ({
  flexDirection: "column",
  overflowY: "scroll",
  flexGrow: 1,
  minWidth: 0,
  [theme.breakpoints.down("sm")]: {
    maxHeight: "calc(100vh - 90px)",
  },
  [theme.breakpoints.up("sm")]: {
    maxHeight: "calc(100vh - 225px)",
  },
}));

const RoomList = ({ children }: { children: React.ReactNode }) => {
  return (
    <StyledStack>
      <AllRoomsSearchBar />
      {children}
    </StyledStack>
  );
};

export default RoomList;
