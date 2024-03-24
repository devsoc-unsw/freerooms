import Box from "@mui/material/Box";

const StatusDot: React.FC<{ colour: "green" | "orange" | "red" }> = ({
  colour,
}) => {
  return (
    <Box
      sx={(theme) => ({
        width: 10,
        height: 10,
        borderRadius: "50%",
        backgroundColor:
          colour === "green"
            ? theme.palette.success.light
            : colour === "orange"
              ? theme.palette.warning.light
              : theme.palette.error.light,
        marginRight: theme.spacing(1.25),
      })}
    />
  );
};

export default StatusDot;
