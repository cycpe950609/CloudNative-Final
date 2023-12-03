import React, { useState } from 'react';
import { Outlet, Route, useNavigate, useParams } from 'react-router-dom';
import { Layout, Drawer, Affix, Menu } from "antd";
import './dashboard.css'
import './utils/utils.css'
import { DashboardType, PageInfoType, useDashboard, useDashboardType, usePageType } from './utils/dashboard';

const { Header: AntHeader, Content, Footer: AntFooter, Sider } = Layout;

export const Header = () => {
    return <div>Header</div>;
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
    const [visible, setVisible] = useState(false);
    const dashboardType = useDashboardType();
    const pageType = usePageType();
    console.log("Dashboard : ", dashboardType);
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
                    </>
                }


                <Content className='p-1rem overflow-scroll w-full h-full'>
                    {/* <div className='w-full h-full'> */}
                        <Outlet />
                    {/* </div> */}
                </Content>

            </Layout>


        </Layout>
    )
}
export default Dashboard