import Button, { ButtonProps } from "@mui/material/Button";
import React from "react";

interface StyledIconButtonProps extends ButtonProps {
  active?: boolean
}

const StyledIconButton: React.FC<StyledIconButtonProps> = (
  { children, active, ...otherProps }
) => (
  <Button
    {...otherProps}
    sx={theme => ({
      padding: theme.spacing(1),
      minWidth: 0,
    })}
    variant={active ? "contained" : "outlined"}
    color="primary"
    disableElevation
  >
    {children}
  </Button>
)

export default StyledIconButton;
