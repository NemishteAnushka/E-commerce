import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { CssBaseline } from '@mui/material';
import App from './App';
import store from './store';
import { RoleProvider } from './contexts/RoleContext';
import { ToastProvider } from './contexts/ToastContext';
import './global.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <RoleProvider>
        <ToastProvider>
          <CssBaseline />
          <App />
        </ToastProvider>
      </RoleProvider>
    </Provider>
  </React.StrictMode>
);
