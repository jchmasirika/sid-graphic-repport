import { useRoutes } from 'react-router-dom';
import router from 'src/router';

import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';

import { CssBaseline, LinearProgress } from '@mui/material';
import ThemeProvider from './theme/ThemeProvider';
import { Account, AuthtContext, useGetAccount } from './api/account';
import { useEffect, useState } from 'react';

function App() {
  const content = useRoutes(router);
  const [account, setAccount] = useState<Account|undefined>(undefined);

  useEffect(() => {
    fetch('/api/login')
        .then((data) => {
            if(data.ok)
                return data.json();
            throw new Error('Erreur lors de la reception des données');
        })
        .then((data) => {
            if(data?.id){  
              const { account } = useGetAccount("/api/accounts/" + data.id);
              // const { account } = useGetAccount("/api/accounts/141");
              setAccount(account);
            }
        })
        .catch((e) => console.log(e));
  }, []);


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
