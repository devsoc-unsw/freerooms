import Button, { ButtonProps } from "@mui/material/Button";
import { styled } from "@mui/material/styles";

const StyledButton = styled(Button)<ButtonProps>(({ theme }) => ({
  borderRadius: "10px",
  padding: theme.spacing(1.5, 3),
  textTransform: "none",
  transition: "all 0.1s ease-in-out",
}));

export default StyledButton;