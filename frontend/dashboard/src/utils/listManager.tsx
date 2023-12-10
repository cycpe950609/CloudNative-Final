import React, { useEffect, useState } from "react";
import type { MenuProps } from 'antd';
import { Dropdown, Space } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { useNavigate } from "react-router-dom";

export type ListManagerPropsType = {
    title?: string,
    backendPath: string,
    defaultPath: string,
}

export type ListManagerNameEntryType = {
    "name": string,
    "key": string
}
export type ListManagerNameDictType = { 
    [key: string]: ListManagerNameEntryType
}

const ListManager = (props: ListManagerPropsType) => {
    const [dropdownList, setDropdownList] = useState({} as ListManagerNameDictType);
    const navigate = useNavigate();
    const showDropdown = (props.title || "").length > 0;
    
    const params: URLSearchParams = new URLSearchParams(window.location.hash.split("?")[1]);
    const currentKey = params.get("key");
    
    useEffect(() => {
        if(showDropdown && params.get("key") === null && Object.keys(dropdownList).length > 0) {
            console.log("No key found in URL");
            // setTimeout(() => navigate(`/dashboard/stadium/info?key=${Object.keys(dropdownList)[0]}`), 100);
        }
    })
    console.log("currentKey : ",currentKey , dropdownList);

    useEffect(() => {
        const getList = async () => {
            const lst = await window.backend.api.listName(props.backendPath)
            setDropdownList(lst)
        }
        getList()
    }, [])

    const items: MenuProps['items'] = Object.keys(dropdownList).map((key) => {
        return {
            label: (
                // Default path for Stadium : /dashboard/stadium/info?key=${key}
                <a rel="noopener noreferrer" onClick={() => navigate(`${props.defaultPath}?key=${key}`)}>
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
        },
    )

    const lenDropdownList = Object.keys(dropdownList).length;
    const listTitle = currentKey && lenDropdownList > 0 ? dropdownList[currentKey].name : `Select ${props.title || ""}`;

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
    </>

}

export default ListManager;