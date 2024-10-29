import React, { useState, useEffect, useContext } from 'react';
import { Input, DatePicker, Button, Upload, Typography, Select, Avatar, List, Empty, Divider, Collapse, Tooltip, notification, Popconfirm } from 'antd';
import { UploadOutlined, UserOutlined, DownloadOutlined, CaretRightOutlined, FileTextOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { UserContext } from '../../../contexts/UserContext';
import DOMPurify from 'dompurify';
import './update-task-modal.scss';
import axios from 'axios';  // Make sure to import axios if not already imported

const { Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { Panel } = Collapse;

// Add this outside the component to handle downloads globally
const activeDownloads = new Map();

const UpdateTaskModal = ({ task, isEditable, maxTaskNameLength, onCancel, onUpdateClick, handleUpdateSave, pool, isSelfTask }) => {
    const { allUsers = [], user, setPools } = useContext(UserContext); // Add default empty array
    const [taskName, setTaskName] = useState('');
    const [taskDescription, setTaskDescription] = useState('');
    const [dueDate, setDueDate] = useState(null);
    const [selectedContributors, setSelectedContributors] = useState([]);
    const [attachments, setAttachments] = useState([]);
    const [isChanged, setIsChanged] = useState(false);
    const [downloadingFile, setDownloadingFile] = useState(false);
    const [downloadProgress, setDownloadProgress] = useState({});
    const token = localStorage.getItem('jwtToken');


    useEffect(() => {
        if (task) {
            setTaskName(task.name || '');
            setTaskDescription(task.description || '');
            if (task.dueDate && Array.isArray(task.dueDate) && task.dueDate.length === 2) {
                setDueDate([dayjs(task.dueDate[0]), dayjs(task.dueDate[1])]);
            } else {
                setDueDate(null);
            }
            setSelectedContributors(task.contributor || []);
            setAttachments(task.attachments || []);
            setIsChanged(false);
        }
    }, [task]);


    const handleSubmit = () => {
        const taskData = {
            name: taskName,
            description: taskDescription,
            dueDate: dueDate ? [dueDate[0].format('YYYY-MM-DD'), dueDate[1].format('YYYY-MM-DD')] : null,
            contributor: selectedContributors
        };

        const apiUrl = 'https://route.managewise.top/api/task/updateProgress';

        onUpdateClick({ 
            ...taskData, 
            id: task.id, 
            poolId: pool._id,
            originalPoolId: task.originalPoolId, // Make sure to include this
            apiUrl 
        });
    };


    // TODO: implement the real save update for the task it self, also mingkin kenak implement juga intuk description
    // real implementation is on task-modal.jsx
    const handleSave = () => {
        const taskData = {
            id: task.id,
            //name: taskName,
            description: taskDescription,
            dueDate: dueDate ? [dueDate[0].format('YYYY-MM-DD'), dueDate[1].format('YYYY-MM-DD')] : null,
            contributor: selectedContributors
        };

        const apiUrl = 'https://route.managewise.top/api/task/saveUpdateTask'; // tok untuk pool task
        const poolIdToUse = isSelfTask ? task.originalPoolId : (pool && pool._id);


        handleUpdateSave({ 
            ...taskData, 
            poolId: poolIdToUse,
            apiUrl 
        });
        setIsChanged(false);
    };

    const handleTaskNameChange = (e) => {
        const value = e.target.value;
        if (value.length <= maxTaskNameLength) {
            setTaskName(value);
            setIsChanged(true);
        }
    };

    const handleDescriptionChange = (e) => {
        setTaskDescription(e.target.value);
        setIsChanged(true);
    };

    const handleDateChange = (dates) => {
        setDueDate(dates);
        setIsChanged(true);
    };

    const handleContributorSelect = (values) => {
        setSelectedContributors(values);
        setIsChanged(true);
    };

    const filterUsers = (input, option) => {
        if (!option) return false;
        const name = (option.label || '').toLowerCase();
        const email = (option.children?.props?.children[1]?.props?.children[1]?.props?.children || '').toLowerCase();
        return name.indexOf(input.toLowerCase()) >= 0 || email.indexOf(input.toLowerCase()) >= 0;
    };

    const getNameInitial = (name) => {
        return name ? name.charAt(0).toUpperCase() : '?';
    };

    const getContributorName = (userId) => {
        // Add null check
        if (!allUsers) return 'Unknown User';
        const user = allUsers.find(u => u.uid === userId);
        return user ? user.name : 'Unknown User';
    };

    const handleDownload = async (attachment) => {
        const fileName = attachment.name || attachment.link.split('/').pop();
        
        // Check if this file is already being downloaded
        if (activeDownloads.has(fileName)) {
            notification.info({
                message: 'Download in Progress',
                description: 'This file is already being downloaded.',
            });
            return;
        }

        try {
            setDownloadingFile(true);
            const isPDF = fileName.toLowerCase().endsWith('.pdf');
            const url = `https://route.managewise.top/${attachment.link}`;

            const controller = new AbortController();
            activeDownloads.set(fileName, controller);

            const downloadPromise = axios({
                url,
                method: 'GET',
                responseType: 'blob',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                signal: controller.signal,
                onDownloadProgress: (progressEvent) => {
                    const percentCompleted = Math.round(
                        (progressEvent.loaded * 100) / progressEvent.total
                    );
                    const progressElement = document.getElementById(`download-progress-${fileName}`);
                    if (progressElement) {
                        progressElement.textContent = `${percentCompleted}%`;
                    }
                    setDownloadProgress(prev => ({
                        ...prev,
                        [fileName]: percentCompleted
                    }));
                },
            });

            const response = await downloadPromise;
            const blob = new Blob([response.data], {
                type: isPDF ? 'application/pdf' : 'application/octet-stream'
            });
            const blobUrl = window.URL.createObjectURL(blob);

            if (isPDF) {
                // For PDFs, open in new tab using blob URL
                const pdfWindow = window.open();
                if (pdfWindow) {
                    pdfWindow.location.href = blobUrl;
                    // Clean up blob URL after the new window has loaded
                    pdfWindow.onload = () => {
                        window.URL.revokeObjectURL(blobUrl);
                    };
                } else {
                    // If popup was blocked, fallback to current window
                    window.location.href = blobUrl;
                    setTimeout(() => {
                        window.URL.revokeObjectURL(blobUrl);
                    }, 1000);
                }
            } else {
                // For other files, trigger download
                const link = document.createElement('a');
                link.href = blobUrl;
                link.setAttribute('download', fileName);
                document.body.appendChild(link);
                link.click();
                link.remove();
                window.URL.revokeObjectURL(blobUrl);
            }

            notification.success({
                message: 'Download Complete',
                description: `${fileName} has been downloaded successfully.`,
            });

        } catch (error) {
            if (axios.isCancel(error)) {
                console.log('Download cancelled');
            } else {
                console.error('Error handling file:', error);
                notification.error({
                    message: 'File Operation Failed',
                    description: 'There was an error processing the file. Please try again.',
                });
            }
        } finally {
            activeDownloads.delete(fileName);
            setDownloadingFile(false);
            setDownloadProgress(prev => {
                const newProgress = { ...prev };
                delete newProgress[fileName];
                return newProgress;
            });
        }
    };

    // Update the List.Item rendering to include a persistent progress indicator
    const renderAttachmentItem = (item) => (
        <List.Item
            actions={[
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span id={`download-progress-${item.name}`}>
                        {downloadProgress[item.name] !== undefined ? 
                            `${downloadProgress[item.name]}%` : ''}
                    </span>
                    <Button 
                        icon={<DownloadOutlined />} 
                        onClick={() => handleDownload(item)}
                        loading={downloadingFile && downloadProgress[item.name] !== undefined}
                        disabled={activeDownloads.has(item.name)}
                    >
                        Download
                    </Button>
                </div>
            ]}
        >
            <List.Item.Meta
                title={item.name}
            />
        </List.Item>
    );

    // Update the attachments list rendering
    const renderAttachments = (attachments, isProgressAttachment = false) => {
        if (!attachments || attachments.length === 0) {
            return null;
        }

        if (isProgressAttachment) {
            return (
                <div style={{ marginTop: '4px' }}>
                    {attachments.map((item, index) => {
                        const isPDF = item.name.toLowerCase().endsWith('.pdf');
                        return (
                            <div 
                                key={index} 
                                style={{ 
                                    display: 'flex', 
                                    alignItems: 'center',
                                    marginBottom: '4px'
                                }}
                            >
                                <Button
                                    type="link"
                                    icon={isPDF ? <FileTextOutlined style={{ color: '#1890ff' }} /> : <DownloadOutlined style={{ color: '#1890ff' }} />}
                                    onClick={() => handleDownload(item)}
                                    style={{ 
                                        padding: '0',
                                        height: 'auto',
                                        display: 'flex',
                                        alignItems: 'center',
                                        color: '#1890ff'
                                    }}
                                    loading={downloadingFile && downloadProgress[item.name] !== undefined}
                                    disabled={activeDownloads.has(item.name)}
                                >
                                    <span style={{ marginLeft: '4px' }}>
                                        {item.name}
                                    </span>
                                </Button>
                                {downloadProgress[item.name] !== undefined && (
                                    <span style={{ marginLeft: '8px', fontSize: '12px', color: '#8c8c8c' }}>
                                        {downloadProgress[item.name]}%
                                    </span>
                                )}
                            </div>
                        );
                    })}
                </div>
            );
        }

        // Original list rendering for main attachments
        return (
            <div style={{ marginTop: '8px' }}>
                <List
                    size="small"
                    dataSource={attachments}
                    renderItem={renderAttachmentItem}
                />
            </div>
        );
    };

    const sanitizeHTML = (html) => {
        return {
            __html: DOMPurify.sanitize(html, {
                ADD_TAGS: ['img'],
                ADD_ATTR: ['src', 'alt', 'style'],
            })
        };
    };

    const getUser = (userId) => {
        // Add null check and return default object if allUsers is null/undefined
        if (!allUsers || !userId) {
            return { name: 'Unknown User' };
        }
        return allUsers.find(u => u.uid === userId) || { name: 'Unknown User' };
    };

    const fetchPools = async () => {
        try {
            const response = await fetch('https://route.managewise.top/api/data/DDdata', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch pools');
            }

            const data = await response.json();
            setPools(data); // Update pools in context
        } catch (error) {
            console.error('Error fetching pools:', error);
            notification.error({
                message: 'Error',
                description: 'Failed to fetch pools. Please try again.',
            });
        }
    };

    const handleArchiveTask = async () => {
        try {
            const poolIdToUse = isSelfTask ? task.originalPoolId : (pool && pool._id);
            const response = await fetch('https://route.managewise.top/api/archive/archiveTask', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ 
                    taskId: task.id,
                    poolId: poolIdToUse
                }),
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to archive task');
            }
    
            const result = await response.json();

            await fetchPools();
            
            notification.success({
                message: 'Task Archived',
                description: 'The task has been successfully archived.',
            });
    
            onCancel(); // Close the modal
        } catch (error) {
            console.error('Error archiving task:', error);
            notification.error({
                message: 'Error',
                description: error.message || 'Failed to archive the task. Please try again.',
            });
        }
    };
    
    

    const renderProgressItem = (item) => {
        const user = getUser(item.CID);

        const getPlainTextExcerpt = (html, wordCount = 20) => {
            const textWithSpaces = html.replace(/<\/?\w+[^>]*>/g, tag => tag + ' ');
            const plainText = textWithSpaces.replace(/<[^>]+>/g, '');
            return plainText.split(/\s+/).slice(0, wordCount).join(' ').trim();
        };

        const title = item.detail || getPlainTextExcerpt(item.description);

        return (
            <Collapse
                ghost
                expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
            >
                <Panel
                    key={item.id}
                    header={
                        <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                            <Tooltip title={user.name || 'Unknown User'}>
                                <Avatar 
                                    size="small"
                                    src={user.avatar} 
                                    icon={!user.avatar && <UserOutlined />}
                                >
                                    {(!user.avatar && user.name) && user.name.charAt(0).toUpperCase()}
                                </Avatar>
                            </Tooltip>
                            <div style={{ marginLeft: 8, display: 'flex', flexDirection: 'column' }}>
                                <span>{title}</span>
                                <Text type="secondary" style={{ fontSize: '0.8em' }}>
                                    {dayjs(item.date).format('DD-MM-YYYY HH:mm')}
                                </Text>
                            </div>
                        </div>
                    }
                >
                    {item.description && (
                        <div className="progress-description-wrapper">
                            <Text strong>Description:</Text>
                            <div 
                                dangerouslySetInnerHTML={sanitizeHTML(item.description)}
                                className="progress-description"
                            />
                        </div>
                    )}
                    {item.linkAttachment && item.linkAttachment.length > 0 && (
                        <div>
                            <Text strong style={{ display: 'block', marginBottom: '4px' }}>
                                Attachments:
                            </Text>
                            {renderAttachments(item.linkAttachment, true)}
                        </div>
                    )}
                </Panel>
            </Collapse>
        );
    };

    // Add cleanup effect for when modal closes
    useEffect(() => {
        return () => {
            // Cleanup function - runs when component unmounts
            // Don't cancel ongoing downloads when modal closes
            setDownloadingFile(false);
            setDownloadProgress({});
        };
    }, []);

    return (
        <div style={{ display: 'flex', height: '70vh', maxHeight: '600px' }}>
            <div style={{ flex: 1, paddingRight: '20px', display: 'flex', flexDirection: 'column' }}>
                <div style={{ flex: 1, overflowY: 'auto' }}>
                    <h4>Task Details</h4>
                    <div style={{ marginBottom: '20px' }}>
                        <Input
                            placeholder="Task Name"
                            value={taskName}
                            onChange={handleTaskNameChange}
                            disabled={!isEditable}
                            maxLength={maxTaskNameLength}
                            style={{
                                backgroundColor: '#fff',
                                color: 'rgba(0, 0, 0, 0.88)',
                                cursor: 'default'
                            }}
                        />
                        <Text type="secondary">
                            {taskName.length}/{maxTaskNameLength}
                        </Text>
                    </div>
                    <Input.TextArea
                        placeholder="Task Description"
                        value={taskDescription}
                        onChange={handleDescriptionChange}
                        style={{ 
                            marginBottom: '20px',
                            backgroundColor: '#fff',
                            color: 'rgba(0, 0, 0, 0.88)',
                            cursor: 'default',
                            minHeight: '100px'
                        }}
                        disabled={true}
                    />

                    <div style={{ marginBottom: '20px' }}>
                        <h5>Attachments</h5>
                        {attachments.length > 0 ? (
                            <List
                                size="small"
                                dataSource={attachments}
                                renderItem={(item) => (
                                    <List.Item
                                        actions={[
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <span id={`download-progress-${item.name}`}>
                                                    {downloadProgress[item.name] !== undefined ? 
                                                        `${downloadProgress[item.name]}%` : ''}
                                                </span>
                                                <Button 
                                                    icon={<DownloadOutlined />} 
                                                    onClick={() => handleDownload(item)}
                                                    loading={downloadingFile && downloadProgress[item.name] !== undefined}
                                                    disabled={activeDownloads.has(item.name)}
                                                >
                                                    Download
                                                </Button>
                                            </div>
                                        ]}
                                    >
                                        <List.Item.Meta
                                            title={item.name}
                                        />
                                    </List.Item>
                                )}
                            />
                        ) : (
                            <Empty description="No attachments" />
                        )}
                    </div>

                    <RangePicker
                        placeholder={['Start Date', 'End Date']}
                        value={dueDate}
                        onChange={handleDateChange}
                        style={{ marginBottom: '20px', width: '100%' }}
                        format="DD-MM-YYYY"
                        allowClear={true}
                        disabledDate={(current) => current && current < dayjs().startOf('day')}
                    />

            
                    <Select
                        mode="multiple"
                        showSearch
                        placeholder="Search for Contributors"
                        value={selectedContributors}
                        onChange={handleContributorSelect}
                        filterOption={filterUsers}
                        style={{ width: '100%', marginBottom: '20px' }}
                        listHeight={300}
                        dropdownStyle={{ maxHeight: '300px', overflow: 'auto' }}
                        optionLabelProp="label"
                    >
                        {allUsers && allUsers.map(user => (
                            <Option
                                key={user.uid}
                                value={user.uid}
                                label={user.name ? user.name.toUpperCase() : 'NO NAME'}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', padding: '8px 0' }}>
                                    <Avatar icon={<UserOutlined />} src={user.avatar} />
                                    <div style={{ marginLeft: 8 }}>
                                        <div>{user.name ? user.name.toUpperCase() : 'NO NAME'}</div>
                                        <div style={{ fontSize: '0.8em', color: '#888' }}>{user.email || 'No email'}</div>
                                    </div>
                                </div>
                            </Option>
                        ))}
                    </Select>
          

                    {isEditable && (
                        <Upload beforeUpload={() => false}>
                            <Button icon={<UploadOutlined />}>Upload File</Button>
                        </Upload>
                    )}
                </div>

                <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-start' }}>
                    <Button
                        type="primary"
                        onClick={handleSave}
                        disabled={!isChanged}
                        style={{ marginRight: '10px' }}
                    >
                        Save
                    </Button>
                    <Popconfirm
                        title="Are you sure you want to archive this task?"
                        onConfirm={handleArchiveTask}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button type="primary">
                            Close Task
                        </Button>
                    </Popconfirm>
                </div>
            </div>

            <Divider type="vertical" style={{ height: '100%' }} />

            <div style={{ flex: 1, paddingLeft: '20px', display: 'flex', flexDirection: 'column' }}>
                <h4>Progress</h4>
                {task.progress && task.progress.length > 0 ? (
                    <>
                        <List
                            style={{ overflowY: 'auto', flex: 1, maxHeight: 'calc(100% - 40px)' }}
                            itemLayout="vertical"
                            dataSource={task.progress}
                            renderItem={renderProgressItem}
                        />
                    </>
                ) : (
                    <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description="No Progress"
                        style={{ margin: 'auto' }}
                    />
                )}

                <Button 
                    type="primary" 
                    onClick={handleSubmit}
                >
                    Update Progress
                </Button>
            </div>
        </div>
    );
};

export default UpdateTaskModal;
