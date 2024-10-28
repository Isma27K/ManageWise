import React, { useState, useEffect, useContext, useCallback } from 'react';
import { Layout, Typography, Row, Col, Card, Button, Select, Avatar, Tooltip, message } from 'antd';
import { DownloadOutlined, UserOutlined, CrownOutlined, FilePdfOutlined } from '@ant-design/icons';
import Lottie from 'react-lottie';
import PoolTaskPartitions from './PoolTaskPartitions';
import UserPerformanceMetrics from './UserPerformanceMetrics';
import TaskDeliveryMetrics from './TaskDeliveryMetrics';
import TimeBasedReports from './TimeBasedReports';
import loadingAnimation from '../../asset/gif/loading.json';
import './report-main.style.scss';
import { UserContext } from '../../contexts/UserContext';
import { generatePDFReport } from '../../utils/pdfGenerator';

const { Content } = Layout;
const { Title } = Typography;
const { Option } = Select;


const ReportMain = () => {
    const [loading, setLoading] = useState(true);
    const [reportData, setReportData] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectLoading, setSelectLoading] = useState(false);
    const { user = {}, allUsers = [] } = useContext(UserContext); // Add default empty array for allUsers
    const token = localStorage.getItem('jwtToken');
    const [dataError, setDataError] = useState(null);
    const [initialDataFetched, setInitialDataFetched] = useState(false);


    useEffect(() => {
        const fetchInitialReportData = async () => {
            try {
                const response = await fetch('https://route.managewise.top/api/report/report', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                });
                const data = await response.json();
                setReportData(data);
                setInitialDataFetched(true);
                setLoading(false);
            } catch (error) {
                setDataError('Failed to fetch initial report data. Please try again.');
                setLoading(false);
            }
        }

        fetchInitialReportData();
    }, [token]);

    const adminFetch = useCallback(async () => {
        if (!selectedUser) return;

        try {
            setDataError(null);
            setSelectLoading(true);
            const response = await fetch('https://route.managewise.top/api/report/report', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    selectUser: selectedUser
                })
            });
            const data = await response.json();
            
            if (data.targetUser !== selectedUser) {
                setDataError(`Requested data for user ${selectedUser}, but received data for user ${data.targetUser}`);
                message.error('Received incorrect user data. Please try again.');
            } else {
                setReportData(data);
                setDataError(null);
            }
        } catch (error) {
            setDataError('Failed to fetch report data. Please try again.');
            message.error('Failed to fetch report data. Please try again.');
        } finally {
            setSelectLoading(false);
        }
    }, [selectedUser, token]);

    useEffect(() => {
        if (selectedUser && initialDataFetched) {
            adminFetch();
        }
    }, [selectedUser, initialDataFetched, adminFetch]);

    const handleDownloadCSV = () => {
        if (!reportData) return;

        const csvContent = [
            ['Report Type', 'Metric', 'Value'],
            ['Task Completion', 'Status Breakdown', reportData.poolTaskPartion.taskCompletionSummary.statusBreakdown.map(item => `${item.status}: ${item.count}`).join('; ')],
            ['User Performance', 'Task Completion Rate', reportData.userPerformanceMatrix.userPerformanceMetrics.taskCompletionRate],
            ['User Performance', 'Total Tasks', reportData.userPerformanceMatrix.userPerformanceMetrics.totalTasks],
            ['User Performance', 'Completed Tasks', reportData.userPerformanceMatrix.userPerformanceMetrics.completedTasks],
            ['User Performance', 'Average Completion Time', reportData.userPerformanceMatrix.userPerformanceMetrics.averageCompletionTime],
            ['Task Delivery', 'On-Time Delivery Rate', reportData.taskDeliveryMatrix.taskDeliveryMetrics.onTimeDeliveryRate],
            ['Task Delivery', 'Delayed Tasks', reportData.taskDeliveryMatrix.taskDeliveryMetrics.delayedTasks],
            ['Task Delivery', 'Task Escalations', reportData.taskDeliveryMatrix.taskDeliveryMetrics.taskEscalations],
            ['Time-Based', 'Completed Tasks', reportData.theGreatTaskFilter.completedTasks.length],
            ['Time-Based', 'Incomplete Tasks', reportData.theGreatTaskFilter.incompleteTasks.length],
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

    const handleDownloadPDF = () => {
        if (!reportData) return;
        
        const doc = generatePDFReport(reportData, allUsers, selectedUser, user);
        const fileName = selectedUser ? 
            `task_report_${allUsers.find(u => u.uid === selectedUser || u.id === selectedUser)?.name || 'user'}.pdf` : 
            `task_report_${user.name || 'user'}.pdf`;
        
        doc.save(fileName);
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

    const handleUserSelect = (value) => {
        setSelectedUser(value);
    };

    const filterUsers = (input, option) => {
        const name = (option.label || '').toLowerCase();
        const email = (option.email || '').toLowerCase();
        return name.includes(input.toLowerCase()) || email.includes(input.toLowerCase());
    };


    return (
        <Layout className="report-main">
            <Content>
                <div className="report-header">
                    <Title level={2}>Task Management Report</Title>
                    <div className="report-actions">
                        <Button 
                            type="primary" 
                            icon={<FilePdfOutlined />} 
                            onClick={handleDownloadPDF}
                            style={{ marginRight: '8px' }}
                        >
                            Download PDF
                        </Button>
                        <Button 
                            type="primary" 
                            icon={<DownloadOutlined />} 
                            onClick={handleDownloadCSV}
                        >
                            Download CSV
                        </Button>
                    </div>
                </div>
                {user?.admin && allUsers?.length > 0 && (  // Add null check for user.admin and allUsers
                    <div className="admin-select-container">
                        <Tooltip title="Admin User Selection" placement="right">
                            <CrownOutlined className="admin-icon" />
                        </Tooltip>
                        <Select
                            showSearch
                            placeholder="Select a user to view their report"
                            optionFilterProp="children"
                            onChange={handleUserSelect}
                            filterOption={filterUsers}
                            className="admin-select"
                            listHeight={300}
                            dropdownStyle={{ maxHeight: '300px', overflow: 'auto' }}
                            optionLabelProp="label"
                            loading={selectLoading}
                            disabled={selectLoading}
                        >
                            {allUsers.map(user => (
                                <Option
                                    key={user?.uid || user?.id}
                                    value={user?.uid || user?.id}
                                    label={user?.name ? user.name.toUpperCase() : 'NO NAME'}
                                    email={user?.email}
                                >
                                    <div className="user-option">
                                        <Avatar icon={<UserOutlined />} src={user?.avatar} />
                                        <div className="user-info">
                                            <div className="user-name">{user?.name ? user.name.toUpperCase() : 'NO NAME'}</div>
                                            <div className="user-email">{user?.email || 'No email'}</div>
                                        </div>
                                    </div>
                                </Option>
                            ))}
                        </Select>
                    </div>
                )}
                {dataError ? (
                    <Card className="error-card">
                        <Typography.Text type="danger">{dataError}</Typography.Text>
                    </Card>
                ) : loading ? (
                    <div className="loading-container">
                        <Lottie options={defaultOptions} height={200} width={200} />
                    </div>
                ) : (
                    <Row gutter={[16, 16]}>
                        <Col span={12}>
                            <Card title="Pool Task Partitions">
                                <PoolTaskPartitions data={reportData.poolTaskPartion.taskCompletionSummary} />
                            </Card>
                        </Col>
                        <Col span={12}>
                            <Card title="User Performance Metrics">
                                <UserPerformanceMetrics data={reportData.userPerformanceMatrix.userPerformanceMetrics} />
                            </Card>
                        </Col>
                        {/*<Col span={12}>
                            <Card title="Task Delivery Metrics">
                                <TaskDeliveryMetrics data={reportData.taskDeliveryMatrix.taskDeliveryMetrics} />
                            </Card>
                        </Col>*/}
                        <Col span={24}>
                            <Card title="Task Completion Details">
                                <TimeBasedReports data={reportData.theGreatTaskFilter} />
                            </Card>
                        </Col>
                    </Row>
                )}
            </Content>
        </Layout>
    );
};

export default ReportMain;
