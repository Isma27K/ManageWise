import React from 'react';
import { Statistic, Row, Col } from 'antd';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

const TaskDeliveryMetrics = ({ data }) => {
    const pieData = [
        { name: 'On-Time', value: data.onTimeDeliveryRate },
        { name: 'Delayed', value: 1 - data.onTimeDeliveryRate },
    ];

    return (
        <div>
            <Row gutter={16}>
                <Col span={8}>
                    <Statistic
                        title="On-Time Delivery Rate"
                        value={data.onTimeDeliveryRate}
                        precision={2}
                        suffix="/ 1.00"
                    />
                </Col>
                <Col span={8}>
                    <Statistic title="Delayed Tasks" value={data.delayedTasks} />
                </Col>
                <Col span={8}>
                    <Statistic title="Task Escalations" value={data.taskEscalations} />
                </Col>
            </Row>
            <h4>On-Time vs Delayed Tasks</h4>
            <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                    <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                    >
                        {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

export default TaskDeliveryMetrics;
