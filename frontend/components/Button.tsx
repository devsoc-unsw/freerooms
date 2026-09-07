import Button, { ButtonProps } from "@mui/material/Button";
import { styled } from "@mui/material/styles";

const StyledButton = styled(Button)<ButtonProps>(({ theme }) => ({
  borderRadius: "10px",
  padding: theme.spacing(1.5, 3),
  backgroundColor: theme.colours.surface.muted,
  color: theme.colours.text.primary,
  textTransform: "none",
  transition: "all 0.1s ease-in-out",
  "&:hover": {
    backgroundColor: theme.palette.primary.main,
    color: theme.colours.text.onAccent,
  },
}));

export default StyledButton;
