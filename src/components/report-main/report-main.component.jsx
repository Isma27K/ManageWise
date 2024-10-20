import React, { useState, useEffect, useContext } from 'react';
import { Layout, Typography, Row, Col, Card, Button, Input } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import Lottie from 'react-lottie';
import PoolTaskPartitions from './PoolTaskPartitions';
import UserPerformanceMetrics from './UserPerformanceMetrics';
import TaskDeliveryMetrics from './TaskDeliveryMetrics';
import ProjectOverview from './ProjectOverview';
import EfficiencyProductivityReports from './EfficiencyProductivityReports';
import TimeBasedReports from './TimeBasedReports';
import loadingAnimation from '../../asset/gif/loading.json';
import './report-main.style.scss';
import { UserContext } from '../../contexts/UserContext';

const { Content } = Layout;
const { Title } = Typography;

const ReportMain = () => {
    const [loading, setLoading] = useState(true);
    const [reportData, setReportData] = useState(null);
    const { user } = useContext(UserContext);

    const isAdmin = user?.admin;

    useEffect(() => {
        // Simulating data fetching
        setTimeout(() => {
            setReportData({
                taskCompletionSummary: {
                    statusBreakdown: [
                        {
                            status: "TEST",
                            count: 2
                        },
                        {
                            status: "TEST 2",
                            count: 1
                        },
                        {
                            status: "MULTIMEDIA",
                            count: 10
                        }
                    ]
                },
                userPerformanceMetrics: {
                    taskCompletionRate: 0.85,
                    topPerformers: [
                        { name: 'John Doe', tasksCompleted: 45 },
                        { name: 'Jane Smith', tasksCompleted: 38 },
                        { name: 'Bob Johnson', tasksCompleted: 32 },
                    ],
                    averageCompletionTime: 2.5, // in days
                },
                taskDeliveryMetrics: {
                    onTimeDeliveryRate: 0.78,
                    delayedTasks: 22,
                    taskEscalations: 5,
                },
                projectOverview: {
                    totalProjects: 10,
                    activeProjects: 7,
                    completedProjects: 3,
                    tasksPerProject: [
                        { project: 'Project A', tasks: 45 },
                        { project: 'Project B', tasks: 32 },
                        { project: 'Project C', tasks: 28 },
                        { project: 'Project D', tasks: 20 },
                        { project: 'Project E', tasks: 15 },
                    ],
                },
                efficiencyProductivity: {
                    averageTaskAge: 3.5,
                    avgIdleTime: 4.2,
                    tasksCompletedThisWeek: 87,
                    productivityTrends: [
                        { date: '2023-05-01', tasksCompleted: 15 },
                        { date: '2023-05-02', tasksCompleted: 20 },
                        { date: '2023-05-03', tasksCompleted: 18 },
                        { date: '2023-05-04', tasksCompleted: 22 },
                        { date: '2023-05-05', tasksCompleted: 25 },
                        { date: '2023-05-06', tasksCompleted: 17 },
                        { date: '2023-05-07', tasksCompleted: 12 },
                    ],
                },
                timeBased: {
                    tasksOverTime: [
                        { date: '2023-05-01', created: 10, started: 8, completed: 5 },
                        { date: '2023-05-02', created: 12, started: 10, completed: 8 },
                        { date: '2023-05-03', created: 8, started: 9, completed: 7 },
                        { date: '2023-05-04', created: 15, started: 12, completed: 10 },
                        { date: '2023-05-05', created: 11, started: 13, completed: 11 },
                        { date: '2023-05-06', created: 9, started: 8, completed: 9 },
                        { date: '2023-05-07', created: 7, started: 6, completed: 8 },
                    ],
                    weeklyReport: {
                        tasksCompleted: 58,
                        onTimeCompletionRate: 0.85,
                        averageTaskAge: 2.7,
                        mostActiveProject: 'Project A',
                    },
                    monthlyReport: {
                        tasksCompleted: 245,
                        onTimeCompletionRate: 0.82,
                        averageTaskAge: 3.2,
                        mostActiveProject: 'Project B',
                    },
                },
            });
            setLoading(false);
        }, 1500);
    }, []);

    const handleDownloadCSV = () => {
        if (!reportData) return;

        const csvContent = [
            ['Report Type', 'Metric', 'Value'],
            ['Task Completion', 'Total Completed', reportData.taskCompletionSummary.totalCompleted],
            ['Task Completion', 'Pending', reportData.taskCompletionSummary.pending],
            ['User Performance', 'Task Completion Rate', reportData.userPerformanceMetrics.taskCompletionRate],
            ['User Performance', 'Average Completion Time (days)', reportData.userPerformanceMetrics.averageCompletionTime],
            ['Task Delivery', 'On-Time Delivery Rate', reportData.taskDeliveryMetrics.onTimeDeliveryRate],
            ['Task Delivery', 'Delayed Tasks', reportData.taskDeliveryMetrics.delayedTasks],
            ['Task Delivery', 'Task Escalations', reportData.taskDeliveryMetrics.taskEscalations],
            ['Project Overview', 'Total Projects', reportData.projectOverview.totalProjects],
            ['Project Overview', 'Active Projects', reportData.projectOverview.activeProjects],
            ['Project Overview', 'Completed Projects', reportData.projectOverview.completedProjects],
        ].map(row => row.join(',')).join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', 'task_management_report.csv');
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: loadingAnimation,
        rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice'
        }
    };

    if (loading) {
        return (
            <div className="loading-container">
                <Lottie options={defaultOptions} height={200} width={200} />
            </div>
        );
    }

    return (
        <Layout className="report-main">
            <Content>
                <div className="report-header">
                    <Title level={2}>Task Management Report</Title>
                    <Button type="primary" icon={<DownloadOutlined />} onClick={handleDownloadCSV}>
                        Download CSV
                    </Button>
                </div>
                <Row gutter={[16, 16]}>
                    <Col span={12}>
                        <Card title="Pool Task Partitions">
                            <PoolTaskPartitions data={reportData.taskCompletionSummary} />
                        </Card>
                    </Col>
                    <Col span={12}>
                        <Card title="User Performance Metrics">
                            <UserPerformanceMetrics data={reportData.userPerformanceMetrics} />
                        </Card>
                    </Col>
                    <Col span={12}>
                        <Card title="Task Delivery Metrics">
                            <TaskDeliveryMetrics data={reportData.taskDeliveryMetrics} />
                        </Card>
                    </Col>
                    <Col span={12}>
                        <Card title="Project Overview">
                            <ProjectOverview data={reportData.projectOverview} />
                        </Card>
                    </Col>
                    <Col span={24}>
                        <Card title="Efficiency & Productivity Reports">
                            <EfficiencyProductivityReports data={reportData.efficiencyProductivity} />
                        </Card>
                    </Col>
                    <Col span={24}>
                        <Card title="Time-Based Reports">
                            <TimeBasedReports data={reportData.timeBased} />
                        </Card>
                    </Col>
                </Row>
            </Content>
        </Layout>
    );
};

export default ReportMain;
