import React from 'react';
import { Statistic, Row, Col, Typography, Divider, Tooltip } from 'antd';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip as RechartsTooltip } from 'recharts';

const { Title } = Typography;

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28DFF', '#FFBB28', '#FF8042', '#A28DFF', '#FFBB28', '#FF8042', '#A28DFF', '#FFBB28', '#FF8042', '#A28DFF'];

const PoolTaskPartitions = ({ data }) => {
    const totalTasks = data.statusBreakdown.reduce((acc, curr) => acc + curr.count, 0);

    // Sort the statusBreakdown by count in descending order and take the top 6
    const top6StatusBreakdown = [...data.statusBreakdown]
        .sort((a, b) => b.count - a.count)
        .slice(0, 6);

    // Transform the data to include a 'name' property for the legend
    const chartData = data.statusBreakdown.map(item => ({
        name: item.status,
        value: item.count
    }));

    // Function to truncate text
    const truncateText = (text, maxLength) => {
        if (text.length <= maxLength) return text;
        return `${text.substring(0, maxLength)}...`;
    };

    return (
        <Row gutter={[16, 16]}>
            <Col span={24}>
                <Row gutter={[16, 16]}>
                    {top6StatusBreakdown.map((item, index) => (
                        <Col key={index} xs={12} sm={8} md={6} lg={4}>
                            <Tooltip title={item.status}>
                                <Statistic 
                                    title={truncateText(item.status, 20)} 
                                    value={item.count} 
                                    valueStyle={{ fontSize: '16px', lineHeight: '22px' }}
                                    style={{ 
                                        whiteSpace: 'nowrap', 
                                        overflow: 'hidden', 
                                        textOverflow: 'ellipsis' 
                                    }}
                                />
                            </Tooltip>
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
                        <RechartsTooltip />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </Col>
            <Col span={24}>
                <Divider />
                <Title level={4}>Total Tasks</Title>
                <Statistic title="Total Tasks" value={totalTasks} />
            </Col>
        </Row>
    );
};

export default PoolTaskPartitions;
