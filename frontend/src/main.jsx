import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import router from './router/Router';
import './index.css';
import { store } from './redux/store';
import {Toaster} from 'react-hot-toast';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
       <Toaster
        position="top-center"
        reverseOrder={false}
        gutter={8}
        toastOptions={{
          duration: 3000,
          style: {
            padding: '12px 16px',
            fontWeight: 600,
            borderRadius: 12,
            boxShadow: '0 6px 18px rgba(0,0,0,0.08)'
          },
          // Custom types
          success: {
            duration: 2500,
            icon: '✅',
          },
          error: {
            duration: 4000,
            icon: '❌',
          }
        }}
      /> 
    </Provider>
  </React.StrictMode>
);
