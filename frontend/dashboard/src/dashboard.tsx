import React from 'react';
import { Outlet, Route, useParams } from 'react-router-dom';

export const Dashboard = () => {
    return (
        <div>
            <h1>Dashboard</h1>
            <Outlet />
        </div>
    )
}
export default Dashboard

export type DashboardContentType = {
    type: string,
}
export const DashboardContent = (props: DashboardContentType) => {
    const { dashboardType } = useParams();
    console.log(dashboardType);
    return (
        <div>
            <h1>DashboardContent {props.type}</h1>
            <Outlet />
        </div>
    )
}
