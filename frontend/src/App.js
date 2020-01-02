import React from 'react';
import { AppBar, Toolbar, Typography } from '@material-ui/core'
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles'
import { blue } from '@material-ui/core/colors'

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#006cef'
    }
  }
})
const App = () => (
  <div className="App">
    <ThemeProvider theme={theme}>
      <AppBar position='static'>
        <Toolbar>
          <Typography variant='h6'>Freerooms</Typography>
        </Toolbar>
      </AppBar>
    </ThemeProvider>

  </div>
)

export default App;
