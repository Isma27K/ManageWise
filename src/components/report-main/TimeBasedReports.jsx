import React from 'react';
import { Tabs } from 'antd';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const { TabPane } = Tabs;

const TimeBasedReports = ({ data }) => {
    return (
        <div>
            <h4>Tasks Over Time</h4>
            <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={data.tasksOverTime}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="created" stackId="1" stroke="#8884d8" fill="#8884d8" />
                    <Area type="monotone" dataKey="started" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
                    <Area type="monotone" dataKey="completed" stackId="1" stroke="#ffc658" fill="#ffc658" />
                </AreaChart>
            </ResponsiveContainer>
            <Tabs defaultActiveKey="1">
                <TabPane tab="Weekly Report" key="1">
                    <WeeklyMonthlyReport data={data.weeklyReport} />
                </TabPane>
                <TabPane tab="Monthly Report" key="2">
                    <WeeklyMonthlyReport data={data.monthlyReport} />
                </TabPane>
            </Tabs>
        </div>
    );
};

const WeeklyMonthlyReport = ({ data }) => {
    return (
        <div>
            <h5>Tasks Completed: {data.tasksCompleted}</h5>
            <h5>On-Time Completion Rate: {(data.onTimeCompletionRate * 100).toFixed(2)}%</h5>
            <h5>Average Task Age: {data.averageTaskAge.toFixed(1)} days</h5>
            <h5>Most Active Project: {data.mostActiveProject}</h5>
        </div>
    );
};

export default TimeBasedReports;
