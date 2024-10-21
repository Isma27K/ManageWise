import React from 'react';
import { Statistic, Table } from 'antd';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const UserPerformanceMetrics = ({ data }) => {
    const columns = [
        {
            title: 'Pool',
            dataIndex: 'Pool',
            key: 'Pool',
        },
        {
            title: 'Tasks Completed',
            dataIndex: 'tasksCompleted',
            key: 'tasksCompleted',
        },
    ];

    return (
        <div>
            <Statistic
                title="Task Completion Rate"
                value={data.taskCompletionRate}
                precision={2}
                suffix="/ 1.00"
            />
            <Statistic
                title="Average Time to Complete a Task"
                value={data.averageCompletionTime}
                precision={1}
                suffix="days"
            />
            <h4>Top Pool</h4>
            <Table dataSource={data.topPerformers} columns={columns} pagination={false} />
            <h4>Tasks Completed by Top Pool</h4>
            <ResponsiveContainer width="100%" height={200}>
                <BarChart data={data.topPerformers}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="tasksCompleted" fill="#8884d8" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default UserPerformanceMetrics;
