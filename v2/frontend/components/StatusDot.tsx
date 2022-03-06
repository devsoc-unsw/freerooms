import { Box } from "@mantine/core";

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
            ? theme.colors.green[5]
            : colour === "orange"
            ? theme.colors.orange[5]
            : theme.colors.red[5],
        marginRight: 5,
      })}
    />
  );
};

export default StatusDot;
