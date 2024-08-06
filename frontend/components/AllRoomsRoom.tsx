import { Typography } from "@mui/material";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/system";

const Room: React.FC<{
  building: string;
  string: string;
}> = ({ building, string }) => {
  return (
    <>
      <RoomDetails>
        <Typography
          sx={{
            fontWeight: "bold",
            fontSize: { sm: "0.9em", md: "0.95em" },
          }}
        >
          {building}
        </Typography>
        <Typography
          sx={{
            fontSize: { sm: "0.9em", md: "0.95em" },
          }}
        >
          {string}
        </Typography>
      </RoomDetails>
    </>
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
  margin: theme.spacing(0, 1.25, 1.25, 1.25),
  padding: theme.spacing(1.25, 2.5, 1.25, 2.25),
}));

export default Room;
