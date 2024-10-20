import React from 'react';
import { Statistic, Row, Col, Typography } from 'antd';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const { Title } = Typography;

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28DFF', '#FFBB28', '#FF8042', '#A28DFF', '#FFBB28', '#FF8042', '#A28DFF', '#FFBB28', '#FF8042', '#A28DFF'];

const PoolTaskPartitions = ({ data }) => {
    // Sort the statusBreakdown by count in descending order and take the top 6
    const top6StatusBreakdown = [...data.statusBreakdown]
        .sort((a, b) => b.count - a.count)
        .slice(0, 6);

    // Transform the data to include a 'name' property for the legend
    const chartData = data.statusBreakdown.map(item => ({
        name: item.status,
        value: item.count
    }));

    return (
        <Row gutter={[16, 16]}>
            <Col span={24}>
                <Row gutter={[16, 16]}>
                    {top6StatusBreakdown.map((item, index) => (
                        <Col key={index} xs={12} sm={8} md={6} lg={4}>
                            <Statistic title={item.status} value={item.count} />
                        </Col>
                    ))}
                </Row>
            </Col>
            <Col span={24}>
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            nameKey="name"
                        >
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </Col>
        </Row>
    );
};

export default PoolTaskPartitions;
