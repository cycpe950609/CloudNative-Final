import React, { useState } from 'react'
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
import { DashbardDefineContext, DashbardDefineType, PageInfoType } from './utils/dashboard';

function App() {

    const dashboardDefination: DashbardDefineType = {
        "stadium": [
            { showText: "Info", path: "info", content: <InfoPage /> },
            { showText: "Map", path: "map", content: <MapPage /> },
            { showText: "Open Time", path: "opentime", content: <OpenTimePage /> },
            { showText: "Announce", path: "announce", content: <AnnouncePage /> },
        ],
        "account": [
            { showText: "Account", path: "account", content: <AccountPage /> },
        ]
    }

    const renderDashboardRouter = (pages: PageInfoType[]) => {
        let rtv = [];
        rtv.push(<Route key={"index"} index element={pages[0].content} />)
        pages.forEach((info) => {
            rtv.push(<Route key={info.path} path={info.path} element={info.content} />)
        })
        rtv.push(<Route key={"any"} path="*" element={<Navigate to="" />} />)
        return rtv;
    };

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            width: "100vw",
            height: "100vh",
        }}>
            <DashbardDefineContext.Provider value={dashboardDefination}>
                <HashRouter>
                    <Routes>
                        <Route element={<Dashboard />} >
                            <Route index element={<Home />} />
                        </Route>
                        <Route path="dashboard" element={<Dashboard />} >
                            <Route index element={<Navigate to="/" />} />
                            {
                                Object.keys(dashboardDefination).map((dashboardType) => {
                                    return (
                                        <Route key={dashboardType} path={dashboardType} element={<DashboardContent type={dashboardType} />} >
                                            {renderDashboardRouter(dashboardDefination[dashboardType])}
                                        </Route>
                                    )
                                })
                            }
                            {
                                // <Route path='stadium' element={<DashboardContent type="stadium" />} >
                                //     <Route index element={<InfoPage />} />
                                //     <Route path='info' element={<InfoPage />} />
                                //     <Route path='map' element={<MapPage />} />
                                //     <Route path="opentime" element={<OpenTimePage />} />
                                //     <Route path="announce" element={<AnnouncePage />} />
                                //     <Route path="*" element={<Navigate to="" />} />
                                // </Route>
                                // <Route path='account' element={<DashboardContent type="account" />} >
                                //     <Route index element={<AccountPage />} />
                                //     <Route path='account' element={<AccountPage />} />
                                //     <Route path="*" element={<Navigate to="" />} />
                                // </Route>
                            }
                        </Route>
                        <Route path="*" element={<NotFoundPage />} />
                    </Routes>
                </HashRouter>
            </DashbardDefineContext.Provider>
        </div>

    )
}

export default App
