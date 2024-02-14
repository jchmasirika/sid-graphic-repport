import { useRoutes } from 'react-router-dom';
import router from 'src/router';

import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';

import { CssBaseline, LinearProgress } from '@mui/material';
import ThemeProvider from './theme/ThemeProvider';
import { AuthtContext, useGetAccount } from './api/account';

function App() {
  const content = useRoutes(router);
  const { account } = useGetAccount("/api/accounts/141");

  if(!account) {
    return (
      <ThemeProvider>
        <CssBaseline/>
        <LinearProgress sx={{ margin: 5 }} />
      </ThemeProvider>
    )
  }
  return (
    <AuthtContext.Provider value={account}>
      <ThemeProvider>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <CssBaseline />
          {content}
        </LocalizationProvider>
      </ThemeProvider>
    </AuthtContext.Provider>
  );
}
export default App;
