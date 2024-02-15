import { useRoutes } from 'react-router-dom';
import router from 'src/router';

import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';

import { CssBaseline, Grid, LinearProgress, Typography } from '@mui/material';
import ThemeProvider from './theme/ThemeProvider';
import { Account, AuthtContext, GET_ACCOUNT } from './api/account';
import { useEffect, useState } from 'react';
import { useLazyQuery } from '@apollo/client';
import { WifiOff } from '@mui/icons-material';
import Status500 from './content/pages/Status/Status500';

function App() {
  const content = useRoutes(router);
  const [fetchUser, {data, error}] = useLazyQuery<{ account: Account}, {id: string }>(GET_ACCOUNT);
  const [loading, setLoading] = useState(false);

  const getUser = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/login');
      if(!response.ok) {
        throw new Error('Erreur lors de la réception des données');
      }

      const data = await response.json();
      if(data?.id) {
        await fetchUser({ variables: { id: '/api/accounts/' + data.id }});
      } else {
        throw new Error('Reponse incorrecte');
      }
    } catch (error) {
      console.log(error); 
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getUser();
  }, []);


  if(loading) {
    return (
      <ThemeProvider>
        <CssBaseline/>
        <LinearProgress sx={{ margin: 5 }} />
        <Typography sx={{ margin: 5, textAlign: 'center' }}>Chargement du compte utilisateur</Typography>
      </ThemeProvider>
    )
  };
  if(error || !data?.account) {
    return (
      <ThemeProvider>
        <CssBaseline/>
        <Status500 reason='Impossible de récuperer le compte utilisateur'/>
      </ThemeProvider>
    )
  }


  return (
    <AuthtContext.Provider value={data?.account}>
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
