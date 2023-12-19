import React, { useState, useEffect } from 'react';
import { Space, Table, Button, Modal, Form, Select, DatePicker} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { confirm } = Modal;
const { Option } = Select;
const { RangePicker } = DatePicker;
interface TableRecord {
  key: React.Key;
  courtName: string;
  startDate: Dayjs;
  endDate: Dayjs;
}

const CloseTime = () => {
    const [data, setData] = useState([]);
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
              courtName: 'Court A',
              startDate: '2023-01-01',
              endDate: '2023-01-10',
            },
            {
              key: '2',
              courtName: 'Court B',
              startDate: '2023-01-15',
              endDate: '2023-01-25',
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
          content: 'This can't be recovered after deleted',
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

    const handleAddEdit = (values: TableRecord) => {
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
              key: newData.length + 1,
              ...values,
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
        render: (_, record) => (
          <Space size="middle">
            <Button type="primary" icon={<EditOutlined />} onClick={() => showModal(record)}/>
            <Button type="primary" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record)}/>
          </Space>
        ),
      },
    ];

    return (
      <div>
        <div style={{ marginBottom: '16px' }}>
          You can set the close time for certain court here.{' '}
          <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal()}/>
        </div>
        <Table columns={columns} dataSource={data} style={{ width: '50%' }}/>

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
              <Select placeholder="Choose one">
                <Option value="Court A">Court A</Option>
                <Option value="Court B">Court B</Option>
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
