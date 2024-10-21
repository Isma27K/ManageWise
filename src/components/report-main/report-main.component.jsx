import React, { useState, useEffect, useContext } from 'react';
import { Layout, Typography, Row, Col, Card, Button } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import Lottie from 'react-lottie';
import PoolTaskPartitions from './PoolTaskPartitions';
import UserPerformanceMetrics from './UserPerformanceMetrics';
import TaskDeliveryMetrics from './TaskDeliveryMetrics';
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
    const token = localStorage.getItem('jwtToken');

    useEffect(() => {
        const fetchReportData = async () => {
            try {
                const response = await fetch('https://isapi.ratacode.top/api/report/report', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                });
                const data = await response.json();
                setReportData(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching report data:', error);
                setLoading(false);
            }
        }

        fetchReportData();
    }, [token]);

    const handleDownloadCSV = () => {
        if (!reportData) return;

        const csvContent = [
            ['Report Type', 'Metric', 'Value'],
            ['Task Completion', 'Status Breakdown', reportData.taskCompletionSummary.statusBreakdown.map(item => `${item.status}: ${item.count}`).join('; ')],
            ['User Performance', 'Task Completion Rate', reportData.userPerformanceMetrics.taskCompletionRate],
            ['User Performance', 'Total Tasks', reportData.userPerformanceMetrics.totalTasks],
            ['User Performance', 'Completed Tasks', reportData.userPerformanceMetrics.completedTasks],
            ['User Performance', 'Average Completion Time', reportData.userPerformanceMetrics.averageCompletionTime],
            ['Task Delivery', 'On-Time Delivery Rate', reportData.taskDeliveryMetrics.onTimeDeliveryRate],
            ['Task Delivery', 'Delayed Tasks', reportData.taskDeliveryMetrics.delayedTasks],
            ['Task Delivery', 'Task Escalations', reportData.taskDeliveryMetrics.taskEscalations],
            ['Time-Based', 'Weekly Tasks Completed', reportData.timeBased.weeklyReport.tasksCompleted],
            ['Time-Based', 'Monthly Tasks Completed', reportData.timeBased.monthlyReport.tasksCompleted],
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
