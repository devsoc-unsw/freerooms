import Container from "@mui/material/Container";
import { styled } from "@mui/material/styles";

const PageContainer = styled(Container)(({ theme }) => ({
  paddingLeft: theme.space.md,
  paddingRight: theme.space.md,
  [theme.breakpoints.up("sm")]: {
    paddingLeft: theme.space.lg,
    paddingRight: theme.space.lg,
  },
}));

export default PageContainer;
