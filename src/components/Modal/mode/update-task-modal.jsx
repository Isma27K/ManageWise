import React, { useState, useEffect, useContext } from 'react';
import { Input, DatePicker, Button, Upload, Typography, Select, Avatar, List, Empty, Divider, Collapse } from 'antd';
import { UploadOutlined, UserOutlined, DownloadOutlined, CaretRightOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { UserContext } from '../../../contexts/UserContext';
import DOMPurify from 'dompurify';
import './update-task-modal.css';

const { Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { Panel } = Collapse;

const UpdateTaskModal = ({ task, isEditable, maxTaskNameLength, onCancel, onUpdateClick }) => {
    const { allUsers } = useContext(UserContext);
    const [taskName, setTaskName] = useState('');
    const [taskDescription, setTaskDescription] = useState('');
    const [dueDate, setDueDate] = useState(null);
    const [selectedContributors, setSelectedContributors] = useState([]);
    const [attachments, setAttachments] = useState([]);

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
        }
    }, [task]);

    const handleSubmit = () => {
        const taskData = {
            name: taskName,
            description: taskDescription,
            dueDate: dueDate ? [dueDate[0].format('YYYY-MM-DD'), dueDate[1].format('YYYY-MM-DD')] : null,
            contributor: selectedContributors
        };

        onUpdateClick({ ...taskData, id: task.id });
    };

    const handleTaskNameChange = (e) => {
        const value = e.target.value;
        if (value.length <= maxTaskNameLength) {
            setTaskName(value);
        }
    };

    const handleContributorSelect = (values) => {
        setSelectedContributors(values);
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

    const handleDownload = (attachment) => {
        console.log('Downloading:', attachment.name);
        // Implement actual download logic here
        // For now, we'll just open the link in a new tab
        window.open(attachment.link, '_blank');
    };

    const renderAttachments = (attachments) => {
        if (!attachments || attachments.length === 0) {
            return null;
        }

        return (
            <div style={{ marginTop: '8px' }}>
                {attachments.map((item, index) => (
                    <Button 
                        key={index}
                        type="link"
                        icon={<DownloadOutlined />}
                        onClick={() => handleDownload(item)}
                        style={{ padding: '0', marginRight: '8px' }}
                    >
                        {item.name || `Attachment ${index + 1}`}
                    </Button>
                ))}
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

    const renderProgressItem = (item) => {
        const user = allUsers.find(u => u.uid === item.CID);
        return (
            <Collapse
                ghost
                expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
            >
                <Panel
                    key={item.id}
                    header={
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar 
                                size="small"
                                src={user?.avatarUrl} 
                                icon={!user?.avatarUrl && <UserOutlined />}
                            >
                                {(!user?.avatarUrl && user?.name) && getNameInitial(user.name)}
                            </Avatar>
                            <span style={{ marginLeft: 8 }}>{item.detail || 'Unknown User'}</span>
                            <Text type="secondary" style={{ fontSize: '0.8em', marginLeft: 'auto' }}>
                                {item.date ? dayjs(item.date).format('YYYY-MM-DD HH:mm') : 'No date'}
                            </Text>
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
                        onChange={(e) => setTaskDescription(e.target.value)}
                        style={{ marginBottom: '20px' }}
                        disabled={!isEditable}
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
                                            description={`Size: ${item.size} bytes`}
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
                        onChange={(dates) => setDueDate(dates)}
                        style={{ marginBottom: '20px', width: '100%' }}
                        format="DD-MM-YYYY"
                        allowClear={true}
                        disabledDate={(current) => current && current < dayjs().startOf('day')}
                    />

                    <Select
                        mode="multiple"
                        showSearch
                        placeholder={selectedContributors.length ? "Contributors" : "No Contributors"}
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

                <Button
                    type="primary"
                    onClick={handleSubmit}
                    style={{ marginTop: '20px', alignSelf: 'flex-start' }}
                >
                    Update Progress
                </Button>
            </div>

            <Divider type="vertical" style={{ height: '100%' }} />

            <div style={{ flex: 1, paddingLeft: '20px', display: 'flex', flexDirection: 'column' }}>
                <h4>Progress</h4>
                {task.progress && task.progress.length > 0 ? (
                    <List
                        style={{ overflowY: 'auto', flex: 1, maxHeight: 'calc(100% - 40px)' }}
                        itemLayout="vertical"
                        dataSource={task.progress}
                        renderItem={renderProgressItem}
                    />
                ) : (
                    <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description="No Progress"
                        style={{ margin: 'auto' }}
                    />
                )}
            </div>
        </div>
    );
};

export default UpdateTaskModal;