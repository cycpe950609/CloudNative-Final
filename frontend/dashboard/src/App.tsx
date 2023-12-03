import React, { useState } from 'react'
import './App.css'
import { HashRouter, Navigate, Route, Router, Routes, useParams } from 'react-router-dom'
import Home from './home';
import Dashboard from './dashboard';
import MapPage from './pages/map/map';
import NotFoundPage from './utils/404';
import InfoPage from './pages/info/info';
import OpenTimePage from './pages/open_time/openTime';
import AnnouncePage from './pages/announce/announce';
import AccountPage from './pages/account/account';
import { DashbardDefineContext, DashbardDefineType, PageInfoType } from './utils/dashboard';
import { DribbbleOutlined, UserOutlined } from '@ant-design/icons';

function App() {

    const dashboardDefination: DashbardDefineType = {
        "stadium": {
            showText: "Stadium",
            icon: <DribbbleOutlined />,
            pages: [
                { showText: "Info"      , path: "info"      , content: <InfoPage />     , icon: "", preview: "" , description: "Infomation"},
                { showText: "Map"       , path: "map"       , content: <MapPage />      , icon: "", preview: "" , description: "Edit the map of courts"},
                { showText: "Open Time" , path: "opentime"  , content: <OpenTimePage /> , icon: "", preview: "" , description: "Times that the court is opened"},
                { showText: "Announce"  , path: "announce"  , content: <AnnouncePage /> , icon: "", preview: "" , description: "Announcements"},
            ],
        },
        
        "account": {
            showText: "Account",
            icon: <UserOutlined />,
            pages: [
                { showText: "Account"   , path: "account"   , content: <AccountPage />  , icon: "", preview: "" , description: "Users, Blacklist, etc."},
            ]
        }
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
                                        <Route key={dashboardType} path={dashboardType}>
                                            {renderDashboardRouter(dashboardDefination[dashboardType].pages)}
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
