import "../styles/globals.css";

// TODO: Figure out how to migrate this file to the app directory
import { orange, pink } from "@mui/material/colors";
import { createTheme } from "@mui/material/styles";
import ThemeProvider from "@mui/system/ThemeProvider";
import axios from "axios";
import type { AppProps } from "next/app";
import { SWRConfig } from "swr";

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

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SWRConfig
      value={{
        refreshInterval: 30000, // update every 30 seconds
        fetcher: fetcher,
      }}
    >
      <ThemeProvider theme={theme}>
        <Component {...pageProps} />
      </ThemeProvider>
    </SWRConfig>
  );
}

export default MyApp;
