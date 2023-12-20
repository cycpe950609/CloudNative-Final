import React, { useEffect, useState } from 'react';
import { Link, Outlet, Route, useParams } from 'react-router-dom';
import { Layout, Drawer, Affix, Menu, Row, Col, Badge, Button, Dropdown } from "antd";
import './dashboard.css'
import './utils/utils.css'
import { DashboardType, PageInfoType, useDashboard, useDashboardType, useNavigator, usePageType } from './utils/dashboard';
import { DribbbleOutlined, HomeOutlined, InfoCircleFilled, InfoCircleOutlined, UserOutlined } from '@ant-design/icons';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
} from '@ant-design/icons';
import StadiumListManager from './utils/listManager';

const { Header: AntHeader, Content, Footer: AntFooter, Sider } = Layout;

type HeaderLinkPropsType = {
    icon: React.ReactNode,
    text: string,
    path: string
}
const HeaderLink = (props: HeaderLinkPropsType) => {
    const {navigate} = useNavigator();
    return <div style={{ display: "flex", flexDirection: "row", color: "white", cursor: "pointer", padding: "4px" }} onClick={() => { navigate(props.path) }}>
        {props.icon}
        <span style={{ padding: "4px" }}> </span>
        <span>{props.text}</span>
    </div>
}

type HeaderPropsType = {
    defaultPage?: string
}
export const Header = (props: HeaderPropsType) => {
    const dashboardType = useDashboardType();
    const pageType = usePageType();
    // console.log("pageType : ", pageType);
    const showDropDownList = dashboardType !== undefined && pageType !== undefined

    return <>
        <div className="header">
            <div className="header-left-part">
                {/* <LeftHeader /> */}
                <div style={{
                    // backgroundColor: "red"
                    flexWrap: "nowrap",
                }}>
                    <div className="header-box" style={{ display: "flex" }}>
                        <div className="header-perm" >
                            <HeaderLink icon={<HomeOutlined />} text="MAX Dashboard" path="/" />
                            {
                                showDropDownList && <StadiumListManager
                                    backendPath={`/stadium`}
                                    frontendPath={`/dashboard/${dashboardType}`}
                                    defaultPath={props.defaultPage || ""}
                                    title='Stadium'
                                />
                            }
                        </div>
                    </div>
                </div>
            </div>
            <div className="header-middle-part">
                {/* <MiddleHeader /> */}
                <div style={{
                    // backgroundColor: "wheat"
                }}></div>
            </div>
            <div className="header-right-part">
                {/* <RightHeader /> */}
                <div style={{
                    // backgroundColor: "blue"
                    display: "flex", flexDirection: "row", flexWrap: "nowrap",
                }}>
                    <div className="header-box" style={{ display: "flex", flexDirection: "row" }}>
                        <div className="header-perm" >
                            <HeaderLink icon={<InfoCircleOutlined />} text="Info" path="/dashboard/info/info" />
                            <HeaderLink icon={<DribbbleOutlined />} text="Stadium" path="/dashboard/stadium/courts" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
};

export const Footer = () => {
    return <div>Footer</div>;
};

export const SideBar = () => {
    const type = useDashboardType();
    const selectedPage = usePageType();
    const dashboard = useDashboard(type);
    const pages = dashboard.pages;
    const {navigate} = useNavigator();

    if (type === undefined || selectedPage === undefined)
        return <></>;

    return <Menu
        theme="dark"
        mode="vertical"
        defaultSelectedKeys={[selectedPage]}
        selectedKeys={[selectedPage]}
        items={pages.map((info: PageInfoType) => {
            return {
                key: info.path,
                label: info.showText,
                onClick: () => { navigate(`${type}/${info.path}`) }
            }
        })} />
}

const SidebarWidth = 350;
export const Dashboard = () => {
    const [visible, setVisible] = useState(true);
    const [useDrawer, setUseDrawer] = useState(false);
    const dashboardType = useDashboardType();
    const pageType = usePageType();
    // console.log("hasSider : ",window.location.hash, dashboardType, pageType, dashboardType !== undefined && pageType !== undefined);
    const dashboard = useDashboard(dashboardType);
    // console.log("Dashboard default page: ", dashboard.pages[0].path);
    const defaultPage = dashboard ? dashboard.pages[0].path : "";

    const toggleDrawer = () => {
        // console.log("toggleDrawer");
        setVisible(!visible);
    };

    return (
        <Layout>
            <Affix>
                <AntHeader>
                    <Header defaultPage={defaultPage} />
                </AntHeader>
            </Affix>
            <Layout hasSider={dashboardType !== undefined && pageType !== undefined} className='w-full overflow-scroll'>
                {
                    dashboardType && pageType && <>
                        <Sider
                            trigger={null}
                            width={useDrawer && visible ? SidebarWidth : 0}
                            theme="dark"
                        >
                            <div className='p-2rem'>
                                <SideBar />
                            </div>
                        </Sider>
                        <Sider
                            breakpoint="lg"
                            collapsedWidth="0"
                            onCollapse={(collapsed, type) => {
                                // console.log(collapsed, type);
                                setUseDrawer(collapsed)
                                // If screen width is too small, closed drawer is default
                                // If screen width is big enough, opened sidebar is default
                                setVisible(!collapsed)
                            }}
                            trigger={null}
                            width={visible ? SidebarWidth : 0}
                            theme="dark"
                        >
                            {
                                (visible) && <div className='p-2rem'>
                                    <SideBar />
                                </div>
                            }
                        </Sider>
                    </>
                }
                <Content className='w-full'>
                    {
                        dashboardType && pageType ? <>
                            <Affix>
                                <Button onClick={toggleDrawer}>{!visible ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}</Button>
                            </Affix>
                            <div className='p-1rem overflow-scroll w-full dashboard-content-with-sidebar' >
                                <Outlet />
                            </div>
                        </>
                            :
                            <>
                                <div className='p-1rem overflow-scroll w-full dashboard-content-no-sidebar' >
                                    <Outlet />
                                </div>
                            </>
                    }
                </Content>
            </Layout>
        </Layout>
    )
}
export default Dashboard