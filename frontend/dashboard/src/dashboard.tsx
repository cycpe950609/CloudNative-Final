import React, { useState } from 'react';
import { Outlet, Route, useParams } from 'react-router-dom';
import { Layout, Drawer, Affix } from "antd";
import './dashboard.css'
import './utils/utils.css'
import DashboardType from './utils/dashboardType';

const { Header: AntHeader, Content, Footer: AntFooter, Sider } = Layout;

export const Header = () => {
    return <div>Header</div>;
};

export const Footer = () => {
    return <div>Footer</div>;
};

type SidebarPropsType = {
    type: DashboardType
}
export const SideBar = (props: SidebarPropsType) => {
    console.log(props.type);
    return <div>SideBar</div>;
}

const SidebarWidth = 350;
export const Dashboard = () => {
    return (
        <Layout style={{
            display: "flex",
            flexDirection: "column",
        }}>
            <Affix>
                <AntHeader>
                    <Header />
                </AntHeader>
            </Affix>
            <Outlet />
            <AntFooter><Footer /></AntFooter>
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
                    theme="light"
                >
                    <div className='p-2rem'>
                        <SideBar type={props.type}/>
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
                theme="light"
            >
                <div className='p-2rem'>
                    <SideBar type={props.type} />
                </div>
            </Sider>
            <Content className='p-2rem'><Outlet /></Content>
        </Content>
    )
}
