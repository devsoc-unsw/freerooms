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
            ? theme.colours.status.available.main
            : colour === "orange"
              ? theme.colours.status.soon.main
              : theme.colours.status.unavailable.main,
      })}
    />
  );
};

export default StatusDot;
