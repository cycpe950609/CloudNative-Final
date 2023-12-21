import React, { useState } from 'react';
import { Switch, Button, Modal, Spin } from 'antd';
import { CheckOutlined, CloseOutlined, HourglassFilled } from '@ant-design/icons';
import './open.css';
import { useSearchParams } from 'react-router-dom';

const OpenTime = () => {
    const initialTimeSlots = Array.from({ length: 14 * 7 }, () => 1);
    const params: URLSearchParams = new URLSearchParams(window.location.hash.split("?")[1]);
    const currentKey = params.get("key");

    const [isLoading, setIsLoading] = useState(false)

    // 需要search資料
    const [timeSlots, setTimeSlots] = useState<number[]>(initialTimeSlots);
    let [searchParams, _] = useSearchParams();
    React.useEffect(() => {
        // 從後端查詢資料庫以初始化 timeSlots
        setIsLoading(true)
        fetch(`/api/stadium/opentime?stadium=${currentKey}`,{
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('access_token')
            }
        })
            .then(response => response.json())
            .then(data => {
                // console.log("Data : ", typeof data,JSON.parse(data))
                setTimeSlots(JSON.parse(data));  // 將從後端獲得的資料設定為 timeSlots
                setIsLoading(false);
            })
            .catch(error => {
                console.error('Error fetching timeslots:', error);
            });
    }, [currentKey, searchParams]);

    const toggleTimeSlot = (index: number, checked: boolean) => {
        const newTimeSlots = [...timeSlots];
        newTimeSlots[index] = checked ? 1 : 0;
        // 需要update資料
        setTimeSlots(newTimeSlots);
    };

    const handleUpdateToDatabase = () => {
        // 发送请求将timeSlots数据更新到数据库
        fetch('/api/stadium/opentime', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
            },
            body: JSON.stringify({ stadium: currentKey, timeslots: timeSlots }),
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
                console.error('Error updating timeslots:', error);
            });
    };

    const toggleDay = (dayIndex: number, checked: boolean) => {
        const newTimeSlots = [...timeSlots];

        for (let hourIndex = 0; hourIndex < 14; hourIndex++) {
            newTimeSlots[hourIndex + dayIndex * 14] = checked ? 1 : 0;
        }
        setTimeSlots(newTimeSlots);
    };

    const toggleHour = (hourIndex: number, checked: boolean) => {
        const newTimeSlots = [...timeSlots];

        for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
            newTimeSlots[hourIndex + dayIndex * 14] = checked ? 1 : 0;
        }
        setTimeSlots(newTimeSlots);
    };

    const weekdays = ["Mon.", "Tue.", "Wed.", "Thu.", "Fri.", "Sat.", "Sun."];

    return (
        <div>
            <table style={{ width: "100%" }}>
                <thead>
                    <tr>
                        <th></th>
                        {Array.from({ length: 7 }).map((_, dayIndex) => (
                            <th key={dayIndex} align="center" >
                                {weekdays[dayIndex]}
                                <br />
                                <Switch
                                    defaultChecked
                                    size="small"
                                    onChange={(checked) => toggleDay(dayIndex, checked)}
                                />
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {Array.from({ length: 14 }, (_, hourIndex) => (
                        <tr key={hourIndex} style={{ textAlign: "right" }}>
                            <td>{
                                `${8 + hourIndex}:00 - ${9 + hourIndex}:00`
                            } <Switch
                                    defaultChecked
                                    size="small"
                                    onChange={(checked) => toggleHour(hourIndex, checked)}
                                />
                            </td>
                            {Array.from({ length: 7 }, (_, dayIndex) => (
                                    <td key={dayIndex} align="center">
                                        <Switch
                                            checkedChildren={<CheckOutlined />}
                                            unCheckedChildren={<CloseOutlined />}
                                            checked={timeSlots[hourIndex + dayIndex * 14] > 0}
                                            onChange={(checked) => toggleTimeSlot(hourIndex + dayIndex * 14, checked)}
                                        />
                                    </td>
                                ))}
                        </tr>
                    ))}
                </tbody>
            </table>
            <Button type="primary" style={{marginTop: '1rem'}} onClick={handleUpdateToDatabase}>
                Update to Database
            </Button>

            <Modal
                title="Loading..."
                open={isLoading}
                footer={null}
                maskClosable={false}
                centered
            >
                <Spin /> Loading...
            </Modal>

        </div>

    );
};

export default OpenTime;
