import Box from "@mui/material/Box";
import React, { createContext, ReactNode, useContext, useState } from "react";

// Lets menus in a toolbar row open over the whole row instead of under their own button

const TopBarGroupContext = createContext<HTMLElement | null>(null);

export const useTopBarGroup = () => useContext(TopBarGroupContext);

const TopBarGroup = ({ children }: { children: ReactNode }) => {
  const [element, setElement] = useState<HTMLElement | null>(null);

  return (
    <TopBarGroupContext.Provider value={element}>
      <Box
        ref={setElement}
        sx={(theme) => ({
          display: "flex",
          alignItems: "center",
          alignSelf: "center",
          justifyContent: "space-between",
          gap: `${theme.space.md}px`,
          width: "100%",
          [theme.breakpoints.up("sm")]: { flex: "1 1 100%", width: "auto" },
          [theme.breakpoints.up(theme.sizes.toolbar.singleRowMinWidth)]: {
            flex: "0 0 auto",
          },
        })}
      >
        {children}
      </Box>
    </TopBarGroupContext.Provider>
  );
};

export default TopBarGroup;
