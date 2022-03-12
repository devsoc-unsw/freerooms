import "../styles/globals.css";
import type { AppProps } from "next/app";
import { createTheme } from "@mui/material/styles";
import { orange, pink } from "@mui/material/colors";
import ThemeProvider from "@mui/system/ThemeProvider";

const theme = createTheme({
  palette: {
    primary: {
      main: orange[800],
    },
    secondary: {
      main: pink[500],
    },
  },
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={theme}>
      <Component {...pageProps} />
    </ThemeProvider>
  );
}

export default MyApp;
