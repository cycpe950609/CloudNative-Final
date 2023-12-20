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

  const accessToken = localStorage.getItem('access_token');
  // axios.defaults.headers.common['Authorization'] = 'Bearer ' + accessToken

  window.backend = { api: {} };
  window.backend.api.listStadiumName = () => axios.get(`/api/stadium/site?type=name`).then((val) => JSON.parse(val.data))
  window.backend.api.createStadium = (name: string) => axios.post(`/api/stadium/site`, { "name": name }).then((val) => JSON.parse(val.data))
  window.backend.api.updateStadium = (id: number, name: string) => axios.put(`/api/stadium/site`, { "id": id, "name": name }).then((val) => JSON.parse(val.data))
  window.backend.api.deleteStadium = (id: number) => axios.delete(`/api/stadium/site`, {data:{ "id": id}}).then((val) => JSON.parse(val.data))

  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  )

})
