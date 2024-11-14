import { CircularProgress } from "@mui/material";
import Stack from "@mui/material/Stack";
import { Box, styled } from "@mui/system";

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
      {isValidating ? (
        <Box
          display="flex"
          height="100%"
          alignItems="center"
          justifyContent="center"
        >
          <CircularProgress size={50} thickness={5} disableShrink />
        </Box>
      ) : (
        children
      )}
    </StyledStack>
  );
};

export default RoomList;
