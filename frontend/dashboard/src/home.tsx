import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { PageInfoType, useDashboard, useDashboards } from './utils/dashboard';
import { Breadcrumb, Card, Col, Row } from 'antd';
import { DribbbleOutlined, HomeOutlined } from '@ant-design/icons';
const { Meta } = Card;

type DashboardHorizonListPropsType = {
    type: string,
    icon: React.ReactNode
}
const DashboardHorizonList = (props: DashboardHorizonListPropsType) => {
    const board = useDashboard(props.type);
    const navigate = useNavigate();
    return <div className='w-full p-1rem flex flex-col overflow-x-scroll'>
        <Breadcrumb items={[
            {
                title: <HomeOutlined />,
            },
            {

                title: (
                    <>
                        {props.icon}
                        <span>{board.showText}</span>
                    </>
                )
            }

        ]} />;
        <Row gutter={16} wrap={false}>
            {board.pages.map((info: PageInfoType, idx: number) => <Col key={idx}>
                <Card
                    hoverable
                    style={{ minWidth: 256, maxWidth: 256 }}
                    cover={<img alt={info.showText} src={`img/${info.preview}.png`} />}
                    key={idx}
                    onClick={()=> navigate(`dashboard/${props.type}/${info.path}`)}
                >
                    <Meta title={
                        <>
                            {info.icon}
                            <span style={{padding: "1px"}}> </span>
                            {info.showText}
                        </>                        
                        } description={info.description} />
                </Card>
            </Col>)}

        </Row>
    </div>
}

const Home = () => {
    const dashboardList = useDashboards()
    const types = Object.keys(dashboardList)

    return (
        <div className='flex flex-col'>
            {types.map((type) => <DashboardHorizonList key={type} type={type} icon={dashboardList[type].icon} />)}
        </div>
    )
}

export default Home