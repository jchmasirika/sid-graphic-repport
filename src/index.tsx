import ReactDOM from 'react-dom';
import { HelmetProvider } from 'react-helmet-async';
import { HashRouter } from 'react-router-dom';

import 'nprogress/nprogress.css';
import App from 'src/App';
import { SidebarProvider } from 'src/contexts/SidebarContext';
import * as serviceWorker from 'src/serviceWorker';

ReactDOM.render(
  <HelmetProvider>
    <SidebarProvider>
      <HashRouter>
        <App />
      </HashRouter>
    </SidebarProvider>
  </HelmetProvider>,
  document.getElementById('root')
);

serviceWorker.unregister();
