import React from 'react';
import { Statistic, Row, Col } from 'antd';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const ProjectOverview = ({ data }) => {
    return (
        <div>
            <Row gutter={16}>
                <Col span={8}>
                    <Statistic title="Total Projects" value={data.totalProjects} />
                </Col>
                <Col span={8}>
                    <Statistic title="Active Projects" value={data.activeProjects} />
                </Col>
                <Col span={8}>
                    <Statistic title="Completed Projects" value={data.completedProjects} />
                </Col>
            </Row>
            <h4>Tasks per Project</h4>
            <ResponsiveContainer width="100%" height={200}>
                <BarChart data={data.tasksPerProject}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="project" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="tasks" fill="#8884d8" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default ProjectOverview;
