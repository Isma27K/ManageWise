import React, { useState, useContext } from 'react';
import { Input, DatePicker, Button, Upload, Typography, Select, Avatar, message, notification } from 'antd';
import { UploadOutlined, UserOutlined, LoadingOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { UserContext } from '../../../contexts/UserContext';

const { Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

const CreateTaskModal = ({ pool, maxTaskNameLength, onCancel, isSelfTask }) => {
    const { allUsers, user, setPools } = useContext(UserContext);
    const [taskName, setTaskName] = useState('');
    const [taskDescription, setTaskDescription] = useState('');
    const [dueDate, setDueDate] = useState(null);
    const [selectedSubmitters, setSelectedSubmitters] = useState(pool?.userIds || []);
    const [fileList, setFileList] = useState([]);
    const token = localStorage.getItem('jwtToken');
    const [loading, setLoading] = useState(false);

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

    const handleSubmit = async () => {
        setLoading(true);

        // Add a 5-second timer before submitting
        //await new Promise(resolve => setTimeout(resolve, 5000));
        if (taskName.length === 0) {
            message.error('Task name is required');
            setLoading(false);
            return;
        }else if (taskDescription.length === 0) {
            message.error('Task description is required');
            setLoading(false);
            return;
        } else if(dueDate === null) {
            message.error('Due date is required');
            setLoading(false);
            return;
        } else if (!isSelfTask && selectedSubmitters.length === 0) {
            message.error('At least one contributor is required');
            setLoading(false);
            return;
        }

        const formData = new FormData();
        formData.append('name', taskName);
        formData.append('description', taskDescription);
        if (dueDate) {
            formData.append('dueDate', JSON.stringify([dueDate[0].format('YYYY-MM-DD'), dueDate[1].format('YYYY-MM-DD')]));
        }
        
        // Use user._id for self-tasks, pool._id for pool tasks
        if (isSelfTask) {
            formData.append('userId', user._id);
        } else {
            formData.append('poolId', pool?._id);
        }

        formData.append('submitters', JSON.stringify(selectedSubmitters));

        // Append files to formData
        fileList.forEach((file) => {
            formData.append('files', file.originFileObj);
        });

        try {
            const apiUrl = isSelfTask 
                ? 'https://route.managewise.top/api/task/createSelfTask'  // Placeholder URL for self-tasks
                : 'https://route.managewise.top/api/task/createTask';     // Existing URL for pool tasks

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formData
            });

            if (!response.ok) {
                throw new Error('Failed to create task');
            }

            const result = await response.json();
            await fetchPools();

            message.success('Task created successfully');
            onCancel(); // Close the modal
        } catch (error) {
            console.error('Error creating task:', error);
            message.error('Failed to create task. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleTaskNameChange = (e) => {
        const value = e.target.value;
        if (value.length <= maxTaskNameLength) {
            setTaskName(value);
        }
    };

    const handleSubmitterSelect = (values) => {
        setSelectedSubmitters(values);
    };

    const filterUsers = (input, option) => {
        const name = (option.label || '').toLowerCase();
        const email = (option.children?.props?.children[1]?.props?.children[1]?.props?.children || '').toLowerCase();
        return name.indexOf(input.toLowerCase()) >= 0 || email.indexOf(input.toLowerCase()) >= 0;
    };

    const handleFileChange = ({ fileList: newFileList }) => {
        setLoading(true);
        setFileList(newFileList);
        setLoading(false);
    };

    return (
        <div style={{ padding: '20px' }}>
            <div style={{ marginBottom: '20px' }}>
                <Input
                    placeholder="Task Name"
                    value={taskName}
                    onChange={handleTaskNameChange}
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
            />
            <RangePicker
                placeholder={['Start Date', 'End Date']}
                value={dueDate}
                onChange={(dates) => setDueDate(dates)}
                style={{ marginBottom: '20px', width: '100%' }}
                format="DD-MM-YYYY"
                allowClear={true}
                disabledDate={(current) => current && current < dayjs().startOf('day')}
            />
            {!isSelfTask && (
                <Select
                    mode="multiple"
                    showSearch
                    placeholder="Search for Contributors"
                    value={selectedSubmitters}
                    onChange={handleSubmitterSelect}
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
            )}
            <Upload
                fileList={fileList}
                onChange={handleFileChange}
                beforeUpload={() => false}
                multiple
            >
                <Button icon={<UploadOutlined />}>Upload File(s)</Button>
            </Upload>
            <div style={{ marginTop: '10px' }}>
                {fileList.length > 0 && `${fileList.length} file(s) selected`}
            </div>
            <Button
                type="primary"
                onClick={handleSubmit}
                style={{ marginTop: '20px', display: 'block', width: '100%' }}
                disabled={loading}
            >
                <span style={{ marginRight: loading ? '10px' : '0' }}>
                    {loading ? 'Creating Task' : 'Create Task'}
                </span>
                {loading && <LoadingOutlined style={{ fontSize: 16 }} spin />}
            </Button>
        </div>
    );
};

export default CreateTaskModal;
