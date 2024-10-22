import React from 'react';
import { Statistic, Row, Col } from 'antd';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const EfficiencyProductivityReports = ({ data }) => {
    return (
        <div>
            <Row gutter={16}>
                <Col span={8}>
                    <Statistic
                        title="Average Task Age"
                        value={data.averageTaskAge}
                        precision={1}
                        suffix="days"
                    />
                </Col>
                <Col span={8}>
                    <Statistic
                        title="Avg. Idle Time Between Assignments"
                        value={data.avgIdleTime}
                        precision={1}
                        suffix="hours"
                    />
                </Col>
                <Col span={8}>
                    <Statistic
                        title="Tasks Completed This Week"
                        value={data.tasksCompletedThisWeek}
                    />
                </Col>
            </Row>
            <h4>Productivity Trends</h4>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data.productivityTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="tasksCompleted" stroke="#8884d8" activeDot={{ r: 8 }} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default EfficiencyProductivityReports;
