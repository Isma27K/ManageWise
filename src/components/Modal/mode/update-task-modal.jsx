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

const UpdateTaskModal = ({ task, isEditable, maxTaskNameLength, onCancel, onUpdateClick, handleUpdateSave, pool, isSelfTask }) => {
    const { allUsers, user } = useContext(UserContext);
    const [taskName, setTaskName] = useState('');
    const [taskDescription, setTaskDescription] = useState('');
    const [dueDate, setDueDate] = useState(null);
    const [selectedContributors, setSelectedContributors] = useState([]);
    const [attachments, setAttachments] = useState([]);
    const [isChanged, setIsChanged] = useState(false);
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

        console.log(isSelfTask);

        const apiUrl = isSelfTask
            ? 'http://localhost:5000/api/task/updateTaskProgress'
            : 'http://localhost:5000/api/task/updateProgress';

        onUpdateClick({ 
            ...taskData, 
            id: task.id, 
            [isSelfTask ? 'userId' : 'poolId']: isSelfTask ? user._id : pool._id,
            apiUrl 
        });
    };

    // TODO: implement the real save update for the task it self, also mingkin kenak implement also intuk description
    // real implementation is on task-modal.jsx
    const handleSave = () => {
        const taskData = {
            id: task.id,
            //name: taskName,
            description: taskDescription,
            dueDate: dueDate ? [dueDate[0].format('YYYY-MM-DD'), dueDate[1].format('YYYY-MM-DD')] : null,
            contributor: selectedContributors
        };

        const apiUrl = isSelfTask
            ? 'http://localhost:5000/api/task/updateSelfTask' // tok untuk self task
            : 'http://localhost:5000/api/task/updateTask'; // tok untuk pool task

        handleUpdateSave({ 
            ...taskData, 
            [isSelfTask ? 'userId' : 'poolId']: isSelfTask ? user._id : pool._id,
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
        const name = (option.label || '').toLowerCase();
        const email = (option.children?.props?.children[1]?.props?.children[1]?.props?.children || '').toLowerCase();
        return name.indexOf(input.toLowerCase()) >= 0 || email.indexOf(input.toLowerCase()) >= 0;
    };

    const getNameInitial = (name) => {
        return name ? name.charAt(0).toUpperCase() : '?';
    };

    const getContributorName = (userId) => {
        const user = allUsers.find(u => u.uid === userId);
        return user ? user.name : 'Unknown User';
    };

    const handleDownload = async (attachment) => {
        try {
            // Split the path and encode each part separately
            const pathParts = attachment.link.split('\\');
            const encodedPath = pathParts.map(part => encodeURIComponent(part)).join('/');
            const fileName = attachment.name || pathParts[pathParts.length - 1];
            const isPDF = fileName.toLowerCase().endsWith('.pdf');

            const url = `http://localhost:5000/${encodedPath}`;

            if (isPDF) {
                // For PDFs, open in a new tab
                const newTab = window.open('about:blank', '_blank');
                newTab.document.write('Loading PDF...');
                
                const response = await fetch(url, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                
                if (response.ok) {
                    const blob = await response.blob();
                    const objectUrl = URL.createObjectURL(blob);
                    newTab.location.href = objectUrl;
                } else {
                    newTab.close();
                    throw new Error('Failed to load PDF');
                }
            } else {
                // For other file types, download as before
                const response = await axios({
                    url: url,
                    method: 'GET',
                    responseType: 'blob',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                const blob = new Blob([response.data]);
                const downloadUrl = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = downloadUrl;
                link.setAttribute('download', fileName);
                document.body.appendChild(link);
                link.click();
                link.remove();
                window.URL.revokeObjectURL(downloadUrl);
            }
        } catch (error) {
            console.error('Error handling file:', error);
            notification.error({
                message: 'File Operation Failed',
                description: 'There was an error processing the file. Please try again.',
            });
        }
    };

    const renderAttachments = (attachments) => {
        if (!attachments || attachments.length === 0) {
            return null;
        }

        return (
            <div style={{ marginTop: '8px' }}>
                {attachments.map((item, index) => {
                    const isPDF = item.name.toLowerCase().endsWith('.pdf');
                    return (
                        <Button 
                            key={index}
                            type="link"
                            icon={isPDF ? <FileTextOutlined /> : <DownloadOutlined />}
                            onClick={() => handleDownload(item)}
                            style={{ padding: '0', marginRight: '8px' }}
                        >
                            {item.name || `Attachment ${index + 1}`}
                        </Button>
                    );
                })}
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
        //console.log('Getting user for ID:', userId); // Add this line for debugging
        //console.log('All users:', allUsers); // Add this line for debugging
        return allUsers.find(u => u.uid === userId) || {};
    };

    const handleArchiveTask = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/archive/archiveTask', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ 
                    taskId: task.id,
                    poolId: pool._id
                }),
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to archive task');
            }
    
            const result = await response.json();
            
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

        // Function to strip HTML tags and get first 20 words, adding spaces after tags
        const getPlainTextExcerpt = (html, wordCount = 20) => {
            const textWithSpaces = html.replace(/<\/?\w+[^>]*>/g, tag => tag + ' ');
            const plainText = textWithSpaces.replace(/<[^>]+>/g, '');
            return plainText.split(/\s+/).slice(0, wordCount).join(' ').trim();
        };

        // Use description as title if detail is empty
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
                            <Text strong>Attachments:</Text>
                            {renderAttachments(item.linkAttachment)}
                        </div>
                    )}
                </Panel>
            </Collapse>
        );
    };

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
                        />
                        <Text type="secondary">
                            {taskName.length}/{maxTaskNameLength}
                        </Text>
                    </div>
                    <Input.TextArea
                        placeholder="Task Description"
                        value={taskDescription}
                        onChange={handleDescriptionChange}
                        style={{ marginBottom: '20px' }}
                        //disabled={!isEditable}
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
                                            <Button 
                                                icon={<DownloadOutlined />} 
                                                onClick={() => handleDownload(item)}
                                            >
                                                Download
                                            </Button>
                                        ]}
                                    >
                                        <List.Item.Meta
                                            title={item.name}
                                            //description={`Size: ${item.size} bytes`}
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