import React from 'react';
import { AppBar, Toolbar, Typography } from '@material-ui/core'

const App = () => (
  <div className="App">
    <AppBar position='static'>
      <Toolbar>
        <Typography variant='h6'>Freerooms</Typography>
      </Toolbar>
    </AppBar>
  </div>
)

export default App;
