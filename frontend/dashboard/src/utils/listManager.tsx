import React, { useEffect, useState } from "react";
import type { MenuProps } from 'antd';
import { Button, Dropdown, Form, Input, Modal, Space, Table } from 'antd';
import { DeleteOutlined, DownOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
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

export type ListManagerEntry = {
    key: number;
    name: string;
}

const StadiumListManager = (props: ListManagerPropsType) => {
    const [dropdownList, setDropdownList] = useState([] as ListManagerEntry[]);
    const { navigate } = useNavigator();
    const pageType = usePageType();
    const showDropdown = (props.title || "").length > 0;

    const [openModal, setOpenModal] = useState(false);

    const params: URLSearchParams = new URLSearchParams(window.location.hash.split("?")[1]);
    const currentKey = parseInt(params.get("key") as string);

    useEffect(() => {
        // console.log("key : ", params.get("key"));
        const currentKey = parseInt(params.get("key") as string);

        if (
            (showDropdown && params.get("key") === null && Object.keys(dropdownList).length > 0)
            || (params.get("key") !== null && dropdownList.length > 0 && dropdownList.findIndex((item) => item.key === currentKey) === -1) // key not exists
        ) {
            console.log("No valid key found in URL");
            const navigatePath = pageType ? `${props.frontendPath}/${pageType}` : `${props.frontendPath}/${props.defaultPath}`;
            setTimeout(() => navigate(`${navigatePath}?key=${dropdownList[0].key}`), 100);
        }
    })
    // console.log("currentKey : ",currentKey , dropdownList);

    useEffect(() => {
        const getList = async () => {
            const lst = await window.backend.api.listStadiumName()
            // console.log("lst : ", lst);
            setDropdownList(lst)
        }
        getList()
    }, [])

    const dropdownItems: MenuProps['items'] = dropdownList.map((lbl, index) => {
        return {
            label: (
                // Default path for Stadium : /dashboard/stadium/info?key=${key}
                <a rel="noopener noreferrer" onClick={() => navigate(`${props.frontendPath}/${props.defaultPath}?key=${lbl.key}`)}>
                    {lbl.name}
                </a>
            ),
            key: lbl.key,
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
    const idxOfKeyInDropLst = dropdownList.findIndex((item) => item.key === currentKey)
    const isCurrentKeyExist = lenDropdownList > 0 && idxOfKeyInDropLst !== -1 ;
    const listTitle = currentKey && lenDropdownList > 0 && isCurrentKeyExist ? dropdownList[idxOfKeyInDropLst].name : `Select ${props.title || ""}`;

    const handleDelete = (record: ListManagerEntry) => {
        Modal.confirm({
            title: 'Continue deleting ?',
            content: 'Couldn\'t recover after deleted',
            onOk: () => { 
                // 需要delete資料
                const newData = dropdownList.filter((item) => item.key !== record.key);
                setDropdownList(newData);
            },
            onCancel: () => {},
        });
    };

    const [addEditModalVisible, setAddEditModalVisible] = useState(false);
    const [addEditForm] = Form.useForm();
    const showAddEditModal = (record?: ListManagerEntry) => {
        setAddEditModalVisible(true);
        if (record) {
            // edit
            addEditForm.setFieldsValue({
                ...record,
                // dateRange: [dayjs(record.startDate), dayjs(record.endDate)],
            });
        }
        else { // Initial Value
            const keyList = dropdownList.map((item) => item.key);
            const maxKey = Math.max(...keyList);
            addEditForm.setFieldsValue({
                key: 'new',
                name: `Stadium ${maxKey + 1}`
            });
        }
    };
    const handleAddEditStadium = (values: any) => {
        const newData = [...dropdownList];
        const index = newData.findIndex((item) => item.key === values.key);

        if (index !== -1) {
            // edit
            // 需要update資料
            newData[index] = { ...values };
        } else {
            // add
            // 需要insert資料
            const keyList = dropdownList.map((item) => item.key);
            const maxKey = Math.max(...keyList);
            newData.push({
                ...values,
                key: maxKey + 1,
            });
        }

        setDropdownList(newData);
        setAddEditModalVisible(false);
        addEditForm.resetFields();
    }

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
                    <Button type="primary" icon={<EditOutlined />} onClick={() => showAddEditModal(entry)} />
                    <Button type="primary" danger icon={<DeleteOutlined />} onClick={() => handleDelete(entry)} />
                </Space>
            ),
        },
    ];

    const tableItems = dropdownList.map((item, index) => {
        return {
            index: index + 1,
            key: item.key,
            name: item.name,
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
            destroyOnClose
        >
            <div style={{ marginBottom: '16px' }}>
                <span style={{ marginRight: "1rem" }}>You can manage your stadiums here.</span>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => showAddEditModal()} />
            </div>
            <Table columns={tableColumns} dataSource={tableItems} />
        </Modal>

        <Modal
            // forceRender
            title="Add/Edit"
            open={addEditModalVisible}
            onOk={addEditForm.submit}
            onCancel={() => { setAddEditModalVisible(false); addEditForm.resetFields(); }}
            centered
            destroyOnClose
        >
            <Form
                form={addEditForm}
                onFinish={handleAddEditStadium}
                initialValues={{ key: 'new', name: `Stadium ${lenDropdownList + 1}` }}
                labelCol={{ span: '6px' }}
                wrapperCol={{ span: '18px' }}
            >
                <Form.Item name="key" hidden />
                <Form.Item
                    name="name"
                    label="Stadium's Name"
                    rules={[{ required: true, message: 'Please input stadium\'s name!' }]}
                >
                    <Input showCount maxLength={20} />
                </Form.Item>
            </Form>
        </Modal>
    </>

}

export default StadiumListManager;