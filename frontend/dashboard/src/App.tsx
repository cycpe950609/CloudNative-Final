import React, { useEffect, useState } from 'react'
import './App.css'
import { HashRouter, Navigate, Route, Router, Routes, useNavigate, useParams } from 'react-router-dom'
import Home from './home';
import Dashboard from './dashboard';
import MapPage from './pages/map/map';
import NotFoundPage from './utils/404';
import InfoPage from './pages/info/info';
import OpenTimePage from './pages/open_time/openTime';
import AnnouncePage from './pages/announce/announce';
import AccountPage from './pages/account/account';
import { DashbardDefineContext, DashbardDefineType, PageInfoType, PathContext } from './utils/dashboard';
import { DribbbleOutlined, InfoCircleOutlined, UserOutlined } from '@ant-design/icons';
import { FaMapMarkedAlt, FaRegClock, FaCommentAlt, FaUser } from "react-icons/fa";
import { ConfigProvider } from 'antd';


function App() {
    const [path, setPath] = useState(window.location.href);
    const [query, setQuery] = useState(window.location.search);
    const pathCtx = {
        path: path,
        navigate: setPath,
        query: query,
        setQuery: setQuery,
    }

    const dashboardDefination: DashbardDefineType = {
        "stadium": {
            showText: "Stadium",
            icon: <DribbbleOutlined />,
            pages: [
                { showText: "Info", path: "info", content: <InfoPage />, icon: <InfoCircleOutlined />, preview: "preview_info", description: "Infomation" },
                { showText: "Map", path: "map", content: <MapPage />, icon: <FaMapMarkedAlt />, preview: "preview_map", description: "Edit the map of courts" },
                { showText: "Open Time", path: "opentime", content: <OpenTimePage />, icon: <FaRegClock />, preview: "preview_opentime", description: "Times that the court is opened" },
                { showText: "Announce", path: "announce", content: <AnnouncePage />, icon: <FaCommentAlt />, preview: "preview_announce", description: "Announcements" },
            ],
        },

        "account": {
            showText: "Account",
            icon: <UserOutlined />,
            pages: [
                { showText: "Account", path: "account", content: <AccountPage />, icon: <FaUser />, preview: "preview_account", description: "Users, Blacklist, etc." },
            ]
        }
    }

    const renderDashboardRouter = (pages: PageInfoType[]) => {
        let rtv = [];
        rtv.push(<Route key={"index"} index element={<Navigate to={pages[0].path} />} />)
        pages.forEach((info) => {
            rtv.push(<Route key={info.path} path={info.path} element={info.content} />)
        })
        rtv.push(<Route key={"any"} path="*" element={<Navigate to="" />} />)
        return rtv;
    };

    return (
        <div autoFocus style={{
            display: 'flex',
            flexDirection: 'column',
            width: "100vw",
            height: "100vh",
        }}>
            <DashbardDefineContext.Provider value={dashboardDefination}>
                <PathContext.Provider value={pathCtx}>
                    <ConfigProvider theme={{
                        components: {
                            Layout: {
                                headerPadding: "0px 20px",
                            },
                        },
                    }}>
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
                    </ConfigProvider>
                </PathContext.Provider>
            </DashbardDefineContext.Provider>
        </div>

    )
}

export default App
