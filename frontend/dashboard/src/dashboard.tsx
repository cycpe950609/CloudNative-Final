import React, { useState } from 'react';
import { Link, Outlet, Route, useNavigate, useParams } from 'react-router-dom';
import { Layout, Drawer, Affix, Menu, Row, Col, Badge, Button, Dropdown } from "antd";
import './dashboard.css'
import './utils/utils.css'
import { DashboardType, PageInfoType, useDashboard, useDashboardType, usePageType } from './utils/dashboard';
import { DribbbleOutlined, HomeOutlined, UserOutlined } from '@ant-design/icons';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
} from '@ant-design/icons';

const { Header: AntHeader, Content, Footer: AntFooter, Sider } = Layout;

type HeaderLinkPropsType = {
    icon: React.ReactNode,
    text: string,
    path: string
}
const HeaderLink = (props: HeaderLinkPropsType) => {
    const navigate = useNavigate();
    return <div style={{ display: "flex", flexDirection: "row", color: "white", cursor: "pointer", padding: "4px" }} onClick={() => { navigate(props.path) }}>
        {props.icon}
        <span style={{ padding: "4px" }}> </span>
        <span>{props.text}</span>
    </div>
}

export const LeftHeader = () => {
    return <div style={{
        // backgroundColor: "red"
        flexWrap: "nowrap",
    }}>
        <div className="header-box" style={{ display: "flex" }}>
            <div className="header-perm" >
                <HeaderLink icon={<HomeOutlined />} text="Stadium Matching System" path="/" />
            </div>
        </div>
    </div>
}

export const MiddleHeader = () => {
    return <div style={{
        // backgroundColor: "wheat"
    }}></div>
}

export const RightHeader = () => {
    return <div style={{
        // backgroundColor: "blue"
        display: "flex", flexDirection: "row", flexWrap: "nowrap",
    }}>
        <div className="header-box" style={{ display: "flex", flexDirection: "row"  }}>
            <div className="header-perm" >
                <HeaderLink icon={<DribbbleOutlined />} text="Stadium" path="/dashboard/stadium/" />
                <HeaderLink icon={<UserOutlined />} text="Account" path="/dashboard/account/" />
            </div>
        </div>
    </div>
}

type HeaderPropsType = {}
export const Header = (props: HeaderPropsType) => {
    return <>
        <div className="header">
            <div className="header-left-part">
                <LeftHeader />
            </div>
            <div className="header-middle-part"><MiddleHeader /></div>
            <div className="header-right-part">
                <RightHeader />
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
    const navigate = useNavigate();

    if (type === undefined || selectedPage === undefined)
        return <></>;

    return <Menu
        theme="dark"
        mode="vertical"
        defaultSelectedKeys={[selectedPage]}
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
    console.log("Dashboard : ", dashboardType);

    const toggleDrawer = () => {
        console.log("toggleDrawer");
        setVisible(!visible);
    };

    return (
        <Layout>
            <Affix>
                <AntHeader>
                    <Header />
                </AntHeader>
            </Affix>

            <Layout hasSider={dashboardType !== undefined && pageType !== undefined} className='w-full'>
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


                <Content className='w-full h-full'>
                    <Affix>
                        <Button onClick={toggleDrawer}>{!visible ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}</Button>
                    </Affix>
                    <Content className='p-1rem overflow-scroll w-full h-full'>
                        <Outlet />
                    </Content>
                </Content>

            </Layout>


        </Layout>
    )
}
export default Dashboard