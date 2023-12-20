import React from 'react';
import { Tabs } from 'antd';
import OpenTime from './open';
import CloseTime from './close';

const { TabPane } = Tabs;

const OpenTimePage = () => (
    <div style={{ marginLeft: '20px' }}>
        <Tabs defaultActiveKey="1">
            <TabPane tab="Stadium Open Time" key="1">
                <OpenTime />
            </TabPane>
            <TabPane tab="Court Close Time" key="2">
                <CloseTime />
            </TabPane>
        </Tabs>
    </div>
);

export default OpenTimePage
