import { CircularProgress } from "@mui/material";
import Stack from "@mui/material/Stack";
import { Box, styled } from "@mui/system";

const StyledStack = styled(Stack)(({ theme }) => ({
  flexDirection: "column",
  flexGrow: 5,
  maxHeight: "calc(100svh - 225px)",
  overflowY: "auto",
  alignItems: "centred",
  justifyContent: "centred",
  height: "100%",
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

const RoomList = ({ isValidating, children } : { isValidating : boolean, children: React.ReactNode }) => {
  return (
    <StyledStack>
      {isValidating ?
        <Box display="flex" height="100%" alignItems="center" justifyContent="center">
          <CircularProgress size={50} thickness={5} disableShrink />
        </Box>
        : children}
    </StyledStack>
  );
}

export default RoomList;
