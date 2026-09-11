import type { AppStore, RootState } from "@frontend/redux/store";
import { setupStore } from "@frontend/redux/store";
import { createAppTheme } from "@frontend/theme";
import { CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import type { RenderOptions } from "@testing-library/react";
import { render } from "@testing-library/react";
import React, { PropsWithChildren } from "react";
import { Provider } from "react-redux";

// This type interface extends the default options for render from RTL, as well
// as allows the user to specify other things such as initialState, store.
interface ExtendedRenderOptions extends Omit<RenderOptions, "queries"> {
  preloadedState?: Partial<RootState>;
  store?: AppStore;
}

export function renderWithTheme(
  ui: React.ReactElement,
  {
    wrapper: CustomWrapper,
    ...renderOptions
  }: Omit<RenderOptions, "queries"> = {}
) {
  const theme = createAppTheme("light");

  function Wrapper({ children }: PropsWithChildren<{}>): React.JSX.Element {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {CustomWrapper ? <CustomWrapper>{children}</CustomWrapper> : children}
      </ThemeProvider>
    );
  }

  return render(ui, { wrapper: Wrapper, ...renderOptions });
}

/**
 * Usage:
 *  renderWithRedux(<MyComponent />, {
 *    preloadedState: {
 *      currentBuilding: nul
 *    }
 *  });
 */
export default function renderWithRedux(
  ui: React.ReactElement,
  {
    preloadedState = {},
    store = setupStore(preloadedState),
    wrapper: CustomWrapper,
    ...renderOptions
  }: ExtendedRenderOptions = {}
) {
  function Wrapper({ children }: PropsWithChildren<{}>): React.JSX.Element {
    return (
      <Provider store={store}>
        {CustomWrapper ? <CustomWrapper>{children}</CustomWrapper> : children}
      </Provider>
    );
  }

  return {
    store,
    ...renderWithTheme(ui, { wrapper: Wrapper, ...renderOptions }),
  };
}
