import React, { useState } from 'react';
import { Switch, DatePicker } from 'antd';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);
const weekFormat = 'MM/DD';

const customWeekStartEndFormat = (value: dayjs.Dayjs) =>
    `${dayjs(value).startOf('week').format(weekFormat)} ~ ${dayjs(value)
        .endOf('week').format(weekFormat)}`;

const disabledDate = (current: dayjs.Dayjs) => {
    // Can not select days before today and today
    return current && current >= dayjs().startOf('week').add(4, 'week');
};

const OpenTimePage = () => {
    const [selectedWeek, setSelectedWeek] = useState(dayjs());

    // 初始化每個時間格子的狀態，預設為全部開啟
    const initialTimeSlots = Array.from({ length: 14 * 7 }, () => true);
    const initialDaySlots = Array.from({ length: 7 }, () => true);
    // 需要search資料
    const [timeSlots, setTimeSlots] = useState(initialTimeSlots);
    const [daySlots, setDaySlots] = useState(initialDaySlots);

    // 切換時間格子的狀態（開啟/關閉）
    const toggleTimeSlot = (index: number, checked: boolean) => {
        const newTimeSlots = [...timeSlots];
        newTimeSlots[index] = checked;
        // 需要update資料
        setTimeSlots(newTimeSlots);
    };

    // 切換一整天的狀態（開啟/關閉）
    const toggleDay = (dayIndex: number, checked: boolean) => {
        const newTimeSlots = [...timeSlots];
        const newDaySlots = [...daySlots];
        newDaySlots[dayIndex] = checked;
        for (let hourIndex = 0; hourIndex < 14; hourIndex++) {
            newTimeSlots[hourIndex + dayIndex * 14] = checked;
        }
        setTimeSlots(newTimeSlots);
        setDaySlots(newDaySlots);
    };

    // 當選擇新的週時更新時間表
    const handleWeekChange = (value: any) => {
        setSelectedWeek(value);
        // 需要search資料
        setTimeSlots(initialTimeSlots);
        setDaySlots(initialDaySlots);
    };

    return (
        <div>
            <DatePicker defaultValue={dayjs()}
                value={selectedWeek}
                disabledDate={disabledDate}
                onChange={handleWeekChange}
                format={customWeekStartEndFormat}
                picker="week"
                allowClear={false}
            />
            <table>
                <thead>
                    <tr>
                        <th></th>
                        {Array.from({ length: 7 }).map((_, dayIndex) => (
                            <th key={dayIndex} align="center" style={{width: "110px"}}>
                                {dayjs(selectedWeek).startOf('week').add(dayIndex, 'day').format('MM/DD (ddd)')}
                                <br />
                                <Switch
                                    checkedChildren={<CheckOutlined />}
                                    unCheckedChildren={<CloseOutlined />}
                                    checked={daySlots[dayIndex]}
                                    onChange={(checked) => toggleDay(dayIndex, checked)}
                                />
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {Array.from({ length: 14 }, (_, hourIndex) => (
                        <tr key={hourIndex}>
                            <td>{`${8 + hourIndex}:00 - ${9 + hourIndex}:00`}</td>
                            {Array.from({ length: 7 }, (_, dayIndex) => (
                                <td key={dayIndex} align="center">
                                    <Switch
                                        checkedChildren='Open'
                                        unCheckedChildren='Close'
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

export default OpenTimePage
