import Image from "next/image";
import Logo from "../public/assets/favicon/free_rooms_logo.png";
import { Button, Text } from "@mantine/core";
import React from "react";

const StyledButton: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <Button
    sx={(theme) => ({
      backgroundColor: theme.colors.gray[1],
      color: theme.colors.gray[7],
      transition: "all 0.1s ease-in-out",
      "&:hover": {
        color: theme.colors.gray[0],
      },
    })}
    radius="md"
    size="md"
  >
    {children}
  </Button>
);

export default StyledButton;
