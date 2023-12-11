import React, { useEffect, useState } from "react";
import type { MenuProps } from 'antd';
import { Dropdown, Modal, Space } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { useDashboardType, useNavigator, usePageType } from "./dashboard";

export type ListManagerPropsType = {
    title?: string,
    backendPath: string,
    frontendPath: string,
    defaultPath: string,
}

export type ListManagerNameEntryType = {
    "name": string,
    "key": string
}
export type ListManagerNameDictType = {
    [key: string]: ListManagerNameEntryType
}

const StadiumListManager = (props: ListManagerPropsType) => {
    const [dropdownList, setDropdownList] = useState({} as ListManagerNameDictType);
    const { navigate } = useNavigator();
    const pageType = usePageType();
    const showDropdown = (props.title || "").length > 0;

    const [openModal, setOpenModal] = useState(false);

    const params: URLSearchParams = new URLSearchParams(window.location.hash.split("?")[1]);
    const currentKey = params.get("key");

    useEffect(() => {
        console.log("key : ",params.get("key"));
        if (
            (showDropdown && params.get("key") === null && Object.keys(dropdownList).length > 0) 
            || (params.get("key") !== null && Object.keys(dropdownList).length > 0 && dropdownList[params.get("key") as string] === undefined) // key not exists
        ) {
            console.log("No valid key found in URL");
            const navigatePath = pageType ? `${props.frontendPath}/${pageType}` : `${props.frontendPath}/${props.defaultPath}`;
            setTimeout(() => navigate(`${navigatePath}?key=${Object.keys(dropdownList)[0]}`), 100);
        }
    })
    // console.log("currentKey : ",currentKey , dropdownList);

    useEffect(() => {
        const getList = async () => {
            const lst = await window.backend.api.listStadiumName()
            setDropdownList(lst)
        }
        getList()
    }, [])

    const items: MenuProps['items'] = Object.keys(dropdownList).map((key) => {
        return {
            label: (
                // Default path for Stadium : /dashboard/stadium/info?key=${key}
                <a rel="noopener noreferrer" onClick={() => navigate(`${props.frontendPath}/${props.defaultPath}?key=${key}`)}>
                    {dropdownList[key].name}
                </a>
            ),
            key: key,
        }
    })

    items.push(
        {
            type: 'divider',
        },
    )
    items.push(
        {
            label: `Manage ${props.title}`,
            key: 'manager',
            onClick: () => {
                console.log("Open manager");
                setOpenModal(true);
            }
        },
    )

    const lenDropdownList = Object.keys(dropdownList).length;
    const listTitle = currentKey && lenDropdownList > 0 && dropdownList[currentKey] ? dropdownList[currentKey].name : `Select ${props.title || ""}`;

    return <>
        {
            showDropdown && <div style={{ marginLeft: "1rem" }}>
                <Dropdown menu={{ items }}>
                    <a onClick={(e) => e.preventDefault()}>
                        <Space>
                            {listTitle}
                            <DownOutlined />
                        </Space>
                    </a>
                </Dropdown>
            </div>
        }
        <Modal
            title={`${props.title || "Empty" } Manager`}
            centered
            open={openModal}
            footer={null}
            onCancel={() => setOpenModal(false)}
            maskClosable={false}
        >
            <p>some contents...</p>
            <p>some contents...</p>
            <p>some contents...</p>
        </Modal>
    </>

}

export default StadiumListManager;