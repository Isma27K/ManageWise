import React from 'react';
import { Statistic, Row, Col } from 'antd';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

const TaskCompletionSummary = ({ data }) => {
    return (
        <Row gutter={[16, 16]}>
            <Col span={12}>
                <Statistic title="Total Completed" value={data.totalCompleted} />
            </Col>
            <Col span={12}>
                <Statistic title="Pending Tasks" value={data.pending} />
            </Col>
            <Col span={24}>
                <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                        <Pie
                            data={data.statusBreakdown}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="count"
                        >
                            {data.statusBreakdown.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </Col>
        </Row>
    );
};

export default TaskCompletionSummary;
