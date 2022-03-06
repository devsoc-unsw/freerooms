import Image from "next/image";
import { Box, Text, createStyles } from "@mantine/core";
import StatusDot from "./StatusDot";

const useStyles = createStyles((theme) => ({
  image: {
    borderRadius: theme.radius.md,
    transition: "all 0.1s ease-in-out",
    "&:hover": {
      opacity: 0.6,
    },
  },
  status: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: "white",
    padding: 10,
    paddingLeft: 15,
    paddingRight: 15,
    margin: 10,
    pointerEvents: "none",
  },
  title: {
    display: "flex",
    borderRadius: theme.radius.md,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
    padding: 15,
    paddingLeft: 20,
    paddingRight: 20,
    margin: 10,
    pointerEvents: "none",
  },
}));

interface BCProps {
  name: string;
  freerooms: number;
  image: string;
}

const BuildingCard: React.FC<BCProps> = ({ name, freerooms, image }) => {
  const { classes } = useStyles();

  return (
    <Box
      sx={(theme) => ({
        position: "relative",
        flex: 1,
        backgroundColor: theme.colors.orange[5],
        height: 385,
        borderRadius: theme.radius.md,
        "&:hover": {
          cursor: "pointer",
        },
      })}
      onClick={() => {}}
    >
      <Image
        src={image}
        layout="fill"
        objectFit="cover"
        className={classes.image}
      />
      <Box className={classes.status}>
        <StatusDot
          colour={freerooms >= 5 ? "green" : freerooms !== 0 ? "orange" : "red"}
        />
        <Text size="sm" weight={500}>
          {freerooms} rooms available
        </Text>
      </Box>
      <Box className={classes.title}>
        <Text size="lg" weight={500}>
          {name}
        </Text>
      </Box>
    </Box>
  );
};

export default BuildingCard;
