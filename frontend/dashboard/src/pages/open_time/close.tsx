import React, { useState } from 'react';
import { Space, Table, Button, Modal, Form, Select, DatePicker } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import dayjs, { Dayjs } from 'dayjs';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';

const { confirm } = Modal;
const { Option } = Select;
const { RangePicker } = DatePicker;

interface TableRecord {
    key: React.Key;
    courtName: string;
    startDate: string;
    endDate: string;
}

const CloseTime = () => {
    const [data, setData] = useState([] as TableRecord[]);
    const [existName, setExistName] = useState<string[]>([])
    const [modalVisible, setModalVisible] = useState(false);
    const [mode, setMode] = useState("add");
    const [form] = Form.useForm();
    const params: URLSearchParams = new URLSearchParams(window.location.hash.split("?")[1]);
    const currentKey = params.get("key");

    const disabledDate = (current: dayjs.Dayjs) => {
        return current && current <= dayjs();
    };

    let [searchParams, _] = useSearchParams();
    React.useEffect(() => {
        // 從後端查詢資料庫以初始化 timeSlots
        fetch(`/api/stadium/closetime?stadium=${currentKey}&type=time`, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('access_token')
            }
        })
            .then(response => response.json())
            .then(data => {
                console.log("Data : ", typeof data, JSON.parse(data))
                setData(JSON.parse(data));  // 將從後端獲得的資料設定為 timeSlots
            })
            .catch(error => {
                console.error('Error fetching close time:', error);
            });
    }, [currentKey, searchParams]);

    React.useEffect(() => {
        // 從後端查詢資料庫以初始化 timeSlots
        fetch(`/api/stadium/closetime?stadium=${currentKey}&type=name`, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('access_token')
            }
        })
            .then(response => response.json())
            .then(data => {
                console.log("Data : ", JSON.parse(data))
                setExistName(JSON.parse(data));  // 將從後端獲得的資料設定為 timeSlots
            })
            .catch(error => {
                console.error('Error fetching name:', error);
            });
    }, [currentKey, searchParams]);

    const handleDelete = (record: TableRecord) => {
        confirm({
            title: 'Confirm to delete?',
            content: "This can't be recovered after deleted",
            onOk() {
                // 需要delete資料
                fetch('/api/stadium/closetime', {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
                    },
                    body: JSON.stringify({
                        stadium: currentKey,
                        deleted: record
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
                        console.error('Error deleting close time:', error);
                    });
                const newData = data.filter((item) => item.key !== record.key);
                setData(newData);
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    };

    /*   const mockData = [
           {
               key         : '1',
               courtName   : 'Court A',
               startDate   : '2023-01-01',
               endDate     : '2023-01-10',
           },
           {
               key         : '2',
               courtName   : 'Court B',
               startDate   : '2023-01-15',
               endDate     : '2023-01-25',
           },
       ]; */

    const handleAddEdit = (values: any) => {
        const newData = [...data];
        const index = newData.findIndex((item) => item.key === values.key);

        if (index !== -1) {
            // edit
            // 需要update資料
            fetch('/api/stadium/closetime', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
                },
                body: JSON.stringify({
                    stadium: currentKey,
                    closetime: {
                        courtName: values.courtName,
                        startDate: values.dateRange[0].format('YYYY-MM-DD'),
                        endDate: values.dateRange[1].format('YYYY-MM-DD')
                    },
                    old: newData[index]
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
                    console.error('Error editing close time:', error);
                });
            newData[index] = { ...values, startDate: values.dateRange[0].format('YYYY-MM-DD'), endDate: values.dateRange[1].format('YYYY-MM-DD') };
        } else {
            // add
            // 需要insert資料
            fetch('/api/stadium/closetime', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
                },
                body: JSON.stringify({
                    stadium: currentKey,
                    closetime: {
                        courtName: values.courtName,
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
                    console.error('Error adding close time:', error);
                });
            newData.push({
                ...values,
                key: newData.length + 1,
                startDate: values.dateRange[0].format('YYYY-MM-DD'),
                endDate: values.dateRange[1].format('YYYY-MM-DD'),
            });
        }
        setMode("add");
        setData(newData);
        setModalVisible(false);
        form.resetFields();
    };


    const showModal = (record?: TableRecord) => {
        setModalVisible(true);
        if (record) {
            // edit
            setMode("edit");
            form.setFieldsValue({
                ...record,
                dateRange: [dayjs(record.startDate), dayjs(record.endDate)],
            });
        }
        else {
            setMode("add")
        }
    };

    const handleCancel = () => {
        setModalVisible(false);
        form.resetFields();
    };

    const columns = [
        {
            title: 'Court Name',
            dataIndex: 'courtName',
            key: 'courtName',
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
                You can set the close time for certain court here.{' '}
                <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal()} />
            </div>
            <Table columns={columns} dataSource={data} />

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
                        name="courtName"
                        label="Court Name"
                        rules={[{ required: true, message: 'Please enter Court Name' }]}
                    >
                        <Select placeholder="Choose one" disabled={mode == "edit"}>
                            {
                                existName.map((name: string, index) => <Option key={index} value={name}>{name}</Option>)
                            }
                        </Select>
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

export default CloseTime;
