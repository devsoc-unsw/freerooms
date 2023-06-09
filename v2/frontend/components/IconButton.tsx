import Button, { ButtonProps } from "@mui/material/Button";
import React from "react";

const StyledIconButton: React.FC<ButtonProps> = (
  { children, ...otherProps }
) => (
  <Button
    sx={theme => ({
      padding: theme.spacing(1),
      minWidth: 0,
    })}
    variant="outlined"
    color="primary"
    {...otherProps}
  >
    {children}
  </Button>
)

export default StyledIconButton;
