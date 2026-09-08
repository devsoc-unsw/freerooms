import { LinearProgress, Typography } from "@mui/material";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/system";
import AllRoomsSearchBar from "components/AllRoomsSearchBar";

import AllRoomsRoomListSkeleton from "./skeletons/AllRoomsRoomListSkeleton";

const StyledStack = styled(Stack)(({ theme }) => ({
  flexDirection: "column",
  overflowY: "scroll",
  [theme.breakpoints.down("sm")]: {
    maxHeight: "calc(100vh - 90px)",
  },
  [theme.breakpoints.up("sm")]: {
    maxHeight: "calc(100vh - 225px)",
  },
}));

const RoomList = ({
  isValidating,
  children,
}: {
  isValidating: boolean;
  children: React.ReactNode;
}) => {
  return (
    <StyledStack>
      <AllRoomsSearchBar />
      {isValidating ? (
        <AllRoomsRoomListSkeleton />
      ) : (
        children
      )}
    </StyledStack>
  );
};

export default RoomList;
