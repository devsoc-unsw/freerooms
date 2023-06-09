import Button, { ButtonProps } from "@mui/material/Button";
import { styled } from "@mui/material/styles";

const StyledButton = styled(Button)<ButtonProps>(({ theme }) => ({
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
  mx: theme.spacing(1)
}));

export default StyledButton;
