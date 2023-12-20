import React, { useState } from 'react';
import { Switch, } from 'antd';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import './open.css';

const OpenTime = () => {
    const initialTimeSlots = Array.from({ length: 14 * 7 }, () => true);

    // 需要search資料
    const [timeSlots, setTimeSlots] = useState(initialTimeSlots);

    const toggleTimeSlot = (index: number, checked: boolean) => {
        const newTimeSlots = [...timeSlots];
        newTimeSlots[index] = checked;
        // 需要update資料
        setTimeSlots(newTimeSlots);
    };

    const toggleDay = (dayIndex: number, checked: boolean) => {
        const newTimeSlots = [...timeSlots];

        for (let hourIndex = 0; hourIndex < 14; hourIndex++) {
            newTimeSlots[hourIndex + dayIndex * 14] = checked;
        }
        setTimeSlots(newTimeSlots);
    };

    const toggleHour = (hourIndex: number, checked: boolean) => {
        const newTimeSlots = [...timeSlots];

        for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
            newTimeSlots[hourIndex + dayIndex * 14] = checked;
        }
        setTimeSlots(newTimeSlots);
    };

    const weekdays = ["Mon.", "Tue.", "Wed.", "Thu.", "Fri.", "Sat.", "Sun."];

    return (
        <div>
            <table  style={{ width: "100%"}}>
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
                        <tr key={hourIndex} style={{textAlign: "right"}}>
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
                                        checked={timeSlots[hourIndex + dayIndex * 14]}
                                        onChange={(checked) => toggleTimeSlot(hourIndex + dayIndex * 14, checked)}
                                    />
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default OpenTime;
