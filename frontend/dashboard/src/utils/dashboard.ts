import React, { useContext } from "react";

export type DashboardType = "stadium" | "account" | string;

export type PageInfoType = {
    showText: string,
    path: string,
    content: JSX.Element,
    icon: React.ReactNode, // Icon name
    preview: string, // Image name
    description: string,
};
export type DashbardDefineType = { 
    [type: string]: {
        showText: string,
        icon: React.ReactNode,
        pages: PageInfoType[]
    } 
};

export const DashbardDefineContext = React.createContext({} as DashbardDefineType)

export const useDashboards = () => useContext(DashbardDefineContext)

export const useDashboard = (type: string) => {
    const dashboard = useContext(DashbardDefineContext)
    return dashboard[type]
}

export const useDashboardType = () => {
    const hashName = window.location.hash
    const pathList = hashName.split("/")
    return pathList[2]
}

export const usePageType = () => {
    const hashName = window.location.hash
    const pathList = hashName.split("/")
    return pathList[3]
}