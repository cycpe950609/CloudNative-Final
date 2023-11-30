import { useState } from 'react'
import './App.css'
import { HashRouter, Navigate, Route, Router, Routes, useParams } from 'react-router-dom'
import Home from './home';
import Dashboard, { DashboardContent } from './dashboard';
import MapPage from './pages/map/map';
import NotFoundPage from './utils/404';
import InfoPage from './pages/info/info';
import OpenTimePage from './pages/open_time/openTime';
import AnnouncePage from './pages/announce/announce';
import AccountPage from './pages/account/account';

function App() {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            width: "100vw",
            height: "100vh",
        }}>
            <HashRouter>
                <Routes>
                    <Route element={<Dashboard />} >
                        <Route index element={<Home />} />
                    </Route>
                    <Route path="dashboard" element={<Dashboard />} >
                        <Route index element={<Navigate to="/"/>} />
                        <Route path='stadium' element={<DashboardContent type="stadium"/>} >
                            <Route index element={<InfoPage />} />
                            <Route path='info' element={<InfoPage />} />
                            <Route path='map' element={<MapPage />} />
                            <Route path="opentime" element={<OpenTimePage />} />
                            <Route path="announce" element={<AnnouncePage /> } />
                            <Route path="*" element={<Navigate to=""/>} />
                        </Route>
                        <Route path='account' element={<DashboardContent type="account"/>} >
                            <Route index element={<AccountPage />} />
                            <Route path='account' element={<AccountPage />} />
                            <Route path="*" element={<Navigate to=""/>} />
                        </Route>
                    </Route>
                    <Route path="*" element={<NotFoundPage />} />
                </Routes>
            </HashRouter>

        </div>

    )
}

export default App
