import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import Branding from "@frontend/components/landing/Branding";


const FooterContainer = styled(Box)(({ theme }) => ({
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gridTemplateRows: "1fr",
    alignItems: "center",
    justifyItems: "center",
    columnGap: theme.space.xl,
    rowGap: theme.space.md,
    backgroundColor: theme.colours.accent.primary,
    [theme.breakpoints.down("sm")]: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: theme.space.sm,
    },
}));

const Footer: React.FC = ( theme ) => (
  <FooterContainer>
    <Stack>
        <Branding textColor={} />
        <p>hi</p>
    </Stack>
    <p>wahwbkhbakbhd</p>
  </FooterContainer>
);

export default Footer;