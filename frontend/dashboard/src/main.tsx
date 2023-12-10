import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import axios from 'axios';

declare global {
  interface Window {
    backend: {
      api: any
    };
  }
}

document.addEventListener("DOMContentLoaded", async () => {

  window.backend = { api: {} };
  window.backend.api.listName = (path: string) => axios.get(`/api/${path}/list?type=name`).then((val) => val.data)
  
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  )

})
