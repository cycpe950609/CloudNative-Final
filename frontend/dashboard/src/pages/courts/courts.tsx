import React, { useState, useEffect } from 'react';
import { Space, Table, Button, Modal, Form, Input, DatePicker, InputNumber } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useNavigate, useSearchParams } from 'react-router-dom';

interface CourtManagerEntry {
    key: number;
    name: string;
    capacity: number;
}

const CourtsPage = () => {
    const [data, setData] = useState([] as CourtManagerEntry[]);
    const [modalVisible, setModalVisible] = useState(false);
    const [form] = Form.useForm();

    const fetchDataFromDatabase = async () => {
        // 需要search資料
        const params: URLSearchParams = new URLSearchParams(window.location.hash.split("?")[1]);
        const currentKey = parseInt(params.get("key") as string);
        const lst = await window.backend.api.listCourts(currentKey)
        setData(lst)
    };

    let [searchParams, _] = useSearchParams();
    useEffect(() => {
        fetchDataFromDatabase();
    }, [searchParams]);

    const handleDelete = (record: CourtManagerEntry) => {
        const params: URLSearchParams = new URLSearchParams(window.location.hash.split("?")[1]);
        const stadiumID = parseInt(params.get("key") as string);

        console.log("Delete : ", record)

        Modal.confirm({
            title: 'Confirm to delete?',
            content: "This can't be recovered after deleted",
            async onOk() {
                // 需要delete資料
                const newData = data.filter((item) => item.key !== record.key);
                setData(newData);

                try {
                    let rtv = await window.backend.api.deleteCourt(stadiumID,record.key)
                    setData(rtv);
                    Modal.info({
                        title: 'Information',
                        content: "Successful",
                    });
                } catch (error: any) {
                    Modal.error({
                        title: 'Information',
                        content: error,
                    });                    
                }
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    };

    const handleAddEdit = async (values: any) => {
        const newData = [...data];
        const index = newData.findIndex((item) => item.key === values.key);

        const params: URLSearchParams = new URLSearchParams(window.location.hash.split("?")[1]);
        const stadiumID = parseInt(params.get("key") as string);

        if (index !== -1) {
            console.log('edit');
            // edit
            // 需要update資料
            newData[index] = { ...values, capacity: parseInt(values.capacity) };
            setData(newData);
            try {
                let rtv = await window.backend.api.updateCourt(values.key,values.name,values.capacity);
                console.log("Court updated", rtv);
                setData(rtv);
                Modal.info({
                    title: 'Information',
                    content: "Successful",
                });
            } catch (error: any) {
                Modal.error({
                    title: 'Information',
                    content: error,
                });                    
            }
            
        } else {
            console.log('add');
            // add
            // 需要insert資料
            newData.push({
                ...values,
                key: newData.length + 1,
                capacity: parseInt(values.capacity),
            });
            setData(newData);
            try {
                let rtv = await window.backend.api.createCourt(stadiumID,values.name,values.capacity);
                console.log("Court created", rtv);
                setData(rtv);
                Modal.info({
                    title: 'Information',
                    content: "Successful",
                });
            } catch (error: any) {
                Modal.error({
                    title: 'Information',
                    content: error,
                });                    
            }
        }

        setModalVisible(false);
        form.resetFields();
    };


    const showManagerEditModal = (record?: CourtManagerEntry) => {
        setModalVisible(true);
        if (record) {
            // edit
            form.setFieldsValue({
                ...record
            });
        }
        else {
            // add
            const keyList = data.map((item) => item.key);
            const maxKey = Math.max(...keyList);
            form.setFieldsValue({
                key: maxKey+1,
                name: `Court ${maxKey + 1}`,
                capacity: 1
            });
        }
    };

    const handleCancel = () => {
        setModalVisible(false);
        form.resetFields();
    };

    const tableColumns = [
        {
            title: 'Index',
            dataIndex: 'index',
            key: 'idxCourt',
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'nameCourt',
        },
        {
            title: 'Max Capacity',
            dataIndex: 'capacity',
            key: 'capCourt',
        },
        {
            title: 'Edit/Delete',
            key: 'editOrDelete',
            render: (_: any, entry: CourtManagerEntry) => (
                <Space size="middle">
                    <Button type="primary" icon={<EditOutlined />} onClick={() => showManagerEditModal(entry)} />
                    <Button type="primary" danger icon={<DeleteOutlined />} onClick={() => handleDelete(entry)} />
                </Space>
            ),
        },
    ];

    const tableItems = data.map((item, index) => {
        return {
            index: index + 1,
            key: item.key,
            name: item.name,
            capacity: item.capacity,
        }
    })

    return (
        <div>
            <div style={{ marginBottom: '16px' }}>
                <span style={{ marginRight: "1rem" }}>You can manage your courts here.</span>
                <div style={{display: "table", marginTop: "1rem"}}>
                    <span style={{ marginRight: "1rem", display: "table-cell", verticalAlign: "middle" }}>Create : </span>
                    <Button style={{marginLeft: "1rem"}} type="primary" icon={<PlusOutlined />} onClick={() => showManagerEditModal()} />
                </div>
            </div>
            <Table
                columns={tableColumns}
                dataSource={tableItems}
            />

            <Modal
                forceRender
                title="Add/Edit"
                open={modalVisible}
                onOk={form.submit}
                onCancel={handleCancel}
            >
                <Form
                    form={form}
                    onFinish={handleAddEdit}
                    initialValues={{ key: 'new', name: "" }}
                    labelCol={{ span: '6px' }}
                    wrapperCol={{ span: '18px' }}
                >
                    <Form.Item name="key" hidden />
                    <Form.Item
                        name="name"
                        label="Court's Name"
                        rules={[{ required: true, message: 'Please input court\'s name!' }]}
                    >
                        <Input showCount maxLength={20} />
                    </Form.Item>
                    <Form.Item
                        name="capacity"
                        label="Court's Capacity"
                        rules={[{ required: true, message: 'Please input court\'s name!' }]}
                    >
                        <InputNumber min={1}/>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default CourtsPage
