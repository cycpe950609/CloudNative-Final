import React, { useState, useEffect } from 'react';
import { Space, Table, Button, Modal, Form, Input, DatePicker } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import dayjs, { Dayjs } from 'dayjs';

const { confirm } = Modal;
const { RangePicker } = DatePicker;
const { TextArea } = Input;
interface TableRecord {
    key: React.Key;
    title: string;
    content: string;
    startDate: string;
    endDate: string;
}

const AnnouncePage = () => {
    const [data, setData] = useState([] as TableRecord[]);
    const [modalVisible, setModalVisible] = useState(false);
    const [form] = Form.useForm();

    const disabledDate = (current: dayjs.Dayjs) => {
        return current && current <= dayjs();
    };

    const fetchDataFromDatabase = () => {
        // 需要search資料
        setTimeout(() => {
            const mockData = [
                {
                    key: '1',
                    title: 'Title A',
                    content: 'Content A',
                    startDate   : '2023-01-01',
                    endDate     : '2023-01-10',
                },
                {
                    key: '2',
                    title: 'Title B',
                    content: 'Content B',
                    startDate   : '2023-01-15',
                    endDate     : '2023-01-25',
                },
            ];
            setData(mockData);
        }, 1000);
    };

    useEffect(() => {
        fetchDataFromDatabase();
    }, []);

    const handleDelete = (record: TableRecord) => {
        confirm({
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
            // edit
            // 需要update資料
            newData[index] = { ...values, startDate: values.dateRange[0].format('YYYY-MM-DD'), endDate: values.dateRange[1].format('YYYY-MM-DD') };
        } else {
            // add
            // 需要insert資料
            newData.push({
                ...values,
                key: newData.length + 1,
                startDate: values.dateRange[0].format('YYYY-MM-DD'),
                endDate: values.dateRange[1].format('YYYY-MM-DD'),
            });
        }

        setData(newData);
        setModalVisible(false);
        form.resetFields();
    };


    const showModal = (record?: TableRecord) => {
        setModalVisible(true);
        if (record) {
            // edit
            form.setFieldsValue({
                ...record,
                dateRange: [dayjs(record.startDate), dayjs(record.endDate)],
            });
        }
    };

    const handleCancel = () => {
        setModalVisible(false);
        form.resetFields();
    };

    const columns = [
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: 'Start Date',
            dataIndex: 'startDate',
            key: 'startDate',
        },
        {
            title: 'End Date',
            dataIndex: 'endDate',
            key: 'endDate',
        },
        {
            title: 'Edit/Delete',
            key: 'editOrDelete',
            render: (_: any, record: TableRecord) => (
                <Space size="middle">
                    <Button type="primary" icon={<EditOutlined />} onClick={() => showModal(record)} />
                    <Button type="primary" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record)} />
                </Space>
            ),
        },
    ];

    return (
        <div>
            <div style={{ marginBottom: '16px' }}>
                You can manage your announcement here.{' '}
                <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal()} />
            </div>
            <Table
                columns={columns}
                dataSource={data}
                expandable={{
                    expandedRowRender: (record) => (
                        <p style={{ margin: 0, }}>{record.content}</p>
                    ),
                }}
            />

            <Modal
                title="Add/Edit"
                open={modalVisible}
                onOk={form.submit}
                onCancel={handleCancel}
                destroyOnClose
            >
                <Form
                    form={form}
                    onFinish={handleAddEdit}
                    initialValues={{ key: 'new', dateRange: [] }}
                    labelCol={{ span: '6px' }}
                    wrapperCol={{ span: '18px' }}
                >
                    <Form.Item name="key" hidden />
                    <Form.Item
                        name="title"
                        label="Title"
                        rules={[{ required: true, message: 'Please enter Title' }]}
                    >
                        <Input showCount maxLength={20} />
                    </Form.Item>
                    <Form.Item
                        name="content"
                        label="Content"
                        rules={[{ required: true, message: 'Please enter Content' }]}
                    >
                        <TextArea
                            showCount
                            maxLength={100}
                            placeholder="Write the content here"
                            style={{
                                height: 120,
                                resize: 'none',
                            }}
                        />
                    </Form.Item>
                    <Form.Item
                        name="dateRange"
                        label="Date Range"
                        rules={[{ required: true, message: 'Please choose Date Range' }]}
                    >
                        <RangePicker disabledDate={disabledDate} />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default AnnouncePage
