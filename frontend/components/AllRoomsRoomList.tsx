import { LinearProgress, Typography } from "@mui/material";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/system";

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
        <Stack maxWidth={540} width="100vw">
          <LinearProgress />
          <Typography alignSelf="center" marginTop={1}>
            Loading free rooms
          </Typography>
        </Stack>
      ) : (
        children
      )}
    </StyledStack>
  );
};

export default RoomList;
