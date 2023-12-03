import React, { useState } from 'react';
import { Outlet, Route, useNavigate, useParams } from 'react-router-dom';
import { Layout, Drawer, Affix, Menu } from "antd";
import './dashboard.css'
import './utils/utils.css'
import { DashboardType, PageInfoType, useDashboard, useDashboardType, usePagePath } from './utils/dashboard';

const { Header: AntHeader, Content, Footer: AntFooter, Sider } = Layout;

export const Header = () => {
    return <div>Header</div>;
};

export const Footer = () => {
    return <div>Footer</div>;
};

export const SideBar = () => {
    const type = useDashboardType();
    const selectedPage = usePagePath();
    const dashboard = useDashboard(type);
    const pages = dashboard.pages;
    const navigate = useNavigate();

    return <Menu
        theme="dark"
        mode="vertical"
        defaultSelectedKeys={[selectedPage]}
        items={pages.map((info: PageInfoType) => {
            return {
                key: info.path,
                label: info.showText,
                onClick: () => { navigate(info.path) }
            }
        })} />
}

const SidebarWidth = 350;
export const Dashboard = () => {
    return (
        <Layout style={{
            display: "flex",
            flexDirection: "column",
        }}
        hasSider
        >
            <Affix>
                <AntHeader>
                    <Header />
                </AntHeader>
            </Affix>
            
            <Outlet />
        </Layout>
    )
}
export default Dashboard

export type DashboardContentType = {
    type: DashboardType,
}
export const DashboardContent = (props: DashboardContentType) => {
    const [visible, setVisible] = useState(false);
    return (
        <Content style={{
            display: "flex",
            flexDirection: "row",
        }}>

            <Drawer
                title={false}
                placement={"left"}
                closable={false}
                onClose={() => setVisible(false)}
                open={visible}
                key={"drawer"}
                width={SidebarWidth}
            >
                <Sider
                    trigger={null}
                    width={SidebarWidth}
                    theme="dark"
                >
                    <div className='p-2rem'>
                        <SideBar />
                    </div>
                </Sider>
            </Drawer>
            <Sider
                breakpoint="lg"
                collapsedWidth="0"
                onCollapse={(collapsed, type) => {
                    // console.log(collapsed, type);
                }}
                trigger={null}
                width={SidebarWidth}
                theme="dark"
            >
                <div className='p-2rem'>
                    <SideBar />
                </div>
            </Sider>
            <Content className='p-2rem'><Outlet /></Content>
        </Content>
    )
}
