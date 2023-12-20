import React, { useState, useEffect } from 'react';
import { Space, Table, Button, Modal, Form, Input, DatePicker } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

interface CourtManagerEntry {
    key: React.Key;
    court_name: string;
}

const CourtsPage = () => {
    const [data, setData] = useState([] as CourtManagerEntry[]);
    const [modalVisible, setModalVisible] = useState(false);
    const [form] = Form.useForm();

    const fetchDataFromDatabase = () => {
        // 需要search資料
        setTimeout(() => {
            const mockData = [
                {
                    key: '1',
                    court_name: 'Court 1'
                },
                {
                    key: '2',
                    court_name: 'Court 2'

                },
            ];
            setData(mockData);
        }, 1000);
    };

    useEffect(() => {
        fetchDataFromDatabase();
    }, []);

    const handleDelete = (record: CourtManagerEntry) => {
        Modal.confirm({
            title: 'Confirm to delete?',
            content: "This can't be recovered after deleted",
            onOk() {
                // 需要delete資料
                const newData = data.filter((item) => item.key !== record.key);
                setData(newData);
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    };

    const handleAddEdit = (values: any) => {
        const newData = [...data];
        const index = newData.findIndex((item) => item.key === values.key);

        if (index !== -1) {
            console.log('edit');
            // edit
            // 需要update資料
            newData[index] = { ...values};
        } else {
            console.log('add');
            // add
            // 需要insert資料
            newData.push({
                ...values,
                key: newData.length + 1,
            });
        }

        setData(newData);
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
            dataIndex: 'court_name',
            key: 'nameCourt',
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
            court_name: item.court_name,
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
                        name="court_name"
                        label="Court's Name"
                        rules={[{ required: true, message: 'Please input court\'s name!' }]}
                    >
                        <Input showCount maxLength={20} />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default CourtsPage
