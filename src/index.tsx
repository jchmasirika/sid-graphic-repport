import ReactDOM from 'react-dom';
import { HelmetProvider } from 'react-helmet-async';
import { HashRouter } from 'react-router-dom';

import 'nprogress/nprogress.css';
import App from 'src/App';
import { SidebarProvider } from 'src/contexts/SidebarContext';
import * as serviceWorker from 'src/serviceWorker';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';

const client = new ApolloClient({
  uri: 'https://www.sid-sarl.net/api/graphql',
  // uri: 'https://127.0.0.1:8000/api/graphql',
  cache: new InMemoryCache(),
});

ReactDOM.render(
  <HelmetProvider>
    <SidebarProvider>
      <HashRouter>
        <ApolloProvider client={client}>
          <App />
        </ApolloProvider>
      </HashRouter>
    </SidebarProvider>
  </HelmetProvider>,
  document.getElementById('root')
);

serviceWorker.unregister();
