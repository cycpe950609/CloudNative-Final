import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import axios from 'axios';

declare global {
  interface Window {
    backend: {
      api: {
        stadium: any;
        court: any;
      }
    };
  }
}

document.addEventListener("DOMContentLoaded", async () => {

  const accessToken = localStorage.getItem('access_token');
  axios.defaults.headers.common['Authorization'] = 'Bearer ' + accessToken

  window.backend = { api: {
    stadium: {},
    court: {}
  } };
  window.backend.api.stadium.list = () => axios.get(`/api/stadium/site?type=name`).then((val) => JSON.parse(val.data))
  window.backend.api.stadium.create = (name: string) => axios.post(`/api/stadium/site`, { "name": name }).then((val) => JSON.parse(val.data))
  window.backend.api.stadium.update = (id: number, name: string) => axios.put(`/api/stadium/site`, { "id": id, "name": name }).then((val) => JSON.parse(val.data))
  window.backend.api.stadium.delete = (id: number) => axios.delete(`/api/stadium/site`, {data:{ "id": id}}).then((val) => JSON.parse(val.data))

  window.backend.api.court.list   = (stadiumID: number) => axios.get(`/api/stadium/court?stadium=${stadiumID}`).then((val) => JSON.parse(val.data))
  window.backend.api.court.create  = (stadiumID: number, name: string, maxCap: number) => axios.post(`/api/stadium/court`, { "stadium": stadiumID, "name": name, "max_capacity" : maxCap }).then((val) => JSON.parse(val.data))
  window.backend.api.court.update  = (stadiumID: number,id: number, name: string, maxCap: number) => axios.put(`/api/stadium/court`, { "stadium": stadiumID, "id": id, "name": name, "max_capacity" : maxCap }).then((val) => JSON.parse(val.data))
  window.backend.api.court.delete  = (stadiumID: number,id: number) => axios.delete(`/api/stadium/court`, {data:{ "stadium": stadiumID, "id": id}}).then((val) => JSON.parse(val.data))


  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  )

})
