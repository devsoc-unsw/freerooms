import Button, { ButtonProps } from "@mui/material/Button";
import React from "react";

const StyledButton: React.FC<{
  children: React.ReactNode;
  props?: ButtonProps;
}> = ({ children, props }) => (
  <Button
    {...props}
    sx={(theme) => ({
      borderRadius: "10px",
      padding: theme.spacing(1, 3),
      backgroundColor: "#eee",
      color: "#333",
      textTransform: "none",
      transition: "all 0.1s ease-in-out",
      "&:hover": {
        backgroundColor: theme.palette.primary.main,
        color: "#fff",
      },
    })}
  >
    {children}
  </Button>
);

export default StyledButton;
