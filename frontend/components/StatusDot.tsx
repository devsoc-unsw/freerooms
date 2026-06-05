import Box from "@mui/material/Box";

const StatusDot: React.FC<{ colour: "green" | "orange" | "red" }> = ({
  colour,
}) => {
  return (
    <Box
      sx={(theme) => ({
        width: 8,
        height: 8,
        borderRadius: "50%",
        backgroundColor:
          colour === "green"
            ? theme.palette.success.light
            : colour === "orange"
              ? theme.palette.warning.light
              : theme.palette.error.light,
      })}
    />
  );
};

export default StatusDot;
