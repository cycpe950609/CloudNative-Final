import React, { useState } from 'react';
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
    const params: URLSearchParams = new URLSearchParams(window.location.hash.split("?")[1]);
    const currentKey = params.get("key");

    const disabledDate = (current: dayjs.Dayjs) => {
        return current && current <= dayjs();
    };

    React.useEffect(() => {
        // 從後端查詢資料庫以初始化 timeSlots
        fetch(`/api/stadium/announce?stadium=${currentKey}`)
            .then(response => response.json())
            .then(data => {
                console.log("Data : ", typeof data, JSON.parse(data))
                setData(JSON.parse(data));  // 將從後端獲得的資料設定為 timeSlots
            })
            .catch(error => {
                console.error('Error fetching announcement:', error);
            });
    }, [currentKey]);

    const handleDelete = (record: TableRecord) => {
        confirm({
            title: 'Confirm to delete?',
            content: "This can't be recovered after deleted",
            onOk() {
                // 需要delete資料
                fetch('/api/stadium/announce', {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        stadium: currentKey,
                        deleted: record.key
                    }),
                })
                    .then(response => response.json())
                    .then(data => {
                        console.log(data.message);  // 在控制台中打印来自后端的消息
                        Modal.info({
                            title: 'Information',
                            content: "Successful",
                        });
                    })
                    .catch(error => {
                        Modal.error({
                            title: 'Information',
                            content: error,
                        });
                        console.error('Error deleting announcement:', error);
                    });
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
        const lastKey = newData.length > 0 ? newData[newData.length - 1].key : 0;

        if (index !== -1) {
            // edit
            // 需要update資料
            fetch('/api/stadium/announce', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    stadium: currentKey,
                    announce: {
                        key: values.key,
                        title: values.title,
                        content: values.content,
                        startDate: values.dateRange[0].format('YYYY-MM-DD'),
                        endDate: values.dateRange[1].format('YYYY-MM-DD')
                    }
                }),
            })
                .then(response => response.json())
                .then(data => {
                    console.log(data.message);  // 在控制台中打印来自后端的消息
                    Modal.info({
                        title: 'Information',
                        content: "Successful",
                    });
                })
                .catch(error => {
                    Modal.error({
                        title: 'Information',
                        content: error,
                    });
                    console.error('Error editing announcement:', error);
                });
            newData[index] = { ...values, startDate: values.dateRange[0].format('YYYY-MM-DD'), endDate: values.dateRange[1].format('YYYY-MM-DD') };
        } else {
            // add
            // 需要insert資料
            fetch('/api/stadium/announce', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    stadium: currentKey,
                    announce: {
                        title: values.title,
                        content: values.content,
                        startDate: values.dateRange[0].format('YYYY-MM-DD'),
                        endDate: values.dateRange[1].format('YYYY-MM-DD')
                    }
                }),
            })
                .then(response => response.json())
                .then(data => {
                    setData(JSON.parse(data));  // 在控制台中打印来自后端的消息
                    Modal.info({
                        title: 'Information',
                        content: "Successful",
                    });
                })
                .catch(error => {
                    Modal.error({
                        title: 'Information',
                        content: error,
                    });
                    console.error('Error adding announcemt:', error);
                });
            newData.push({
                ...values,
                key: Number(lastKey) + 1,
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
                <div style={{display: "table", marginTop: "1rem"}}>
                    <span style={{ marginRight: "1rem", display: "table-cell", verticalAlign: "middle" }}>Create : </span>
                    <Button style={{marginLeft: "1rem"}} type="primary" icon={<PlusOutlined />} onClick={() => showModal()} />
                </div>
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
