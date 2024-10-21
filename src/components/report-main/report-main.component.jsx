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
                    taskCompletionRate: 0.33,
                    totalTasks: 3,
                    completedTasks: 1,
                    averageCompletionTime: 0.21,
                    completedTasksCount: 1,
                    topPerformers: [
                        {
                            Pool: "TEST",
                            tasksCompleted: 1
                        }
                    ]
                },
                taskDeliveryMetrics: {
                    onTimeDeliveryRate: 1,
                    delayedTasks: 0,
                    taskEscalations: 1
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
                        {
                            date: "2024-10-20",
                            created: 3,
                            started: 0,
                            completed: 1
                        }
                    ],
                    weeklyReport: {
                        tasksCompleted: 1,
                        onTimeCompletionRate: 1,
                        averageTaskAge: 0.2,
                        mostActiveProject: "TEST"
                    },
                    monthlyReport: {
                        tasksCompleted: 1,
                        onTimeCompletionRate: 1,
                        averageTaskAge: 0.2,
                        mostActiveProject: "TEST"
                    }
                }
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
                    {/*<Col span={12}>
                        <Card title="Project Overview">
                            <ProjectOverview data={reportData.projectOverview} />
                        </Card>
                    </Col>*/}
                    <Col span={12}>
                        <Card title="Time-Based Reports">
                            <TimeBasedReports data={reportData.timeBased} />
                        </Card>
                    </Col>
                    <Col span={24}>
                        <Card title="Efficiency & Productivity Reports">
                            <EfficiencyProductivityReports data={reportData.efficiencyProductivity} />
                        </Card>
                    </Col>
                </Row>
            </Content>
        </Layout>
    );
};

export default ReportMain;
