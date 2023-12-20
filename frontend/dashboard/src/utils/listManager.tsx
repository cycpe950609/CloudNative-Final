import React, { useEffect, useState } from "react";
import type { MenuProps } from 'antd';
import { Button, Dropdown, Modal, Space, Table } from 'antd';
import { DeleteOutlined, DownOutlined, EditOutlined } from '@ant-design/icons';
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

export type ListManagerEntry = {
    key: React.Key;
    name: string;
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
        console.log("key : ", params.get("key"));
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

    const dropdownItems: MenuProps['items'] = Object.keys(dropdownList).map((key) => {
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

    dropdownItems.push(
        {
            type: 'divider',
        },
    )
    dropdownItems.push(
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

    const handleDelete = (record: ListManagerEntry) => {
        Modal.confirm({
            title: 'Continue deleting ?',
            content: 'Couldn\'t recover after deleted',
            onOk: () => { },
            onCancel: () => { },
        });
    };

    const showManagerEditModal = (entry: ListManagerEntry) => {
        // setModalVisible(true);
        // if (record) {
        //     // edit
        //     form.setFieldsValue({
        //         ...record,
        //         dateRange: [dayjs(record.startDate), dayjs(record.endDate)],
        //     });
        // }
    };

    const tableColumns = [
        {
            title: 'Index',
            dataIndex: 'index',
            key: 'idxStadium',
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'nameStadium',
        },

        {
            title: 'Edit/Delete',
            key: 'editOrDelete',
            render: (_: any, entry: ListManagerEntry) => (
                <Space size="middle">
                    <Button type="primary" icon={<EditOutlined />} onClick={() => showManagerEditModal(entry)} />
                    <Button type="primary" danger icon={<DeleteOutlined />} onClick={() => handleDelete(entry)} />
                </Space>
            ),
        },
    ];

    const tableItems = Object.keys(dropdownList).map((key,index) => {
        return {
            index: index+1,
            key: key,
            name: dropdownList[key].name,
        }
    })

    return <>
        {
            showDropdown && <div style={{ marginLeft: "1rem" }}>
                <Dropdown menu={{ items: dropdownItems }}>
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
            title={`${props.title || "Empty"} Manager`}
            centered
            open={openModal}
            footer={null}
            onCancel={() => setOpenModal(false)}
            maskClosable={false}
        >
            <Table columns={tableColumns} dataSource={tableItems} />
        </Modal>
    </>

}

export default StadiumListManager;