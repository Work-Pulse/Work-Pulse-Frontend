// main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import axios from 'axios';
import { getAuth } from 'firebase/auth';
import App from './App.tsx';
import './index.css';

// 1️⃣ Axios interceptor: automatically attach your Firebase ID token
axios.interceptors.request.use(
  async (config) => {
    const user = getAuth().currentUser;
    if (user) {
      const token = await user.getIdToken();
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 2️⃣ Now render your React app
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

// 3️⃣ Your Electron contextBridge listener
window.ipcRenderer.on('main-process-message', (_event, message) => {
  console.log('From main process:', message);
});
