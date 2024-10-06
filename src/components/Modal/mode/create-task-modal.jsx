import React, { useState, useContext } from 'react';
import { Input, DatePicker, Button, Upload, Typography, Select, Avatar, message } from 'antd';
import { UploadOutlined, UserOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { UserContext } from '../../../contexts/UserContext';

const { Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

const CreateTaskModal = ({ pool, maxTaskNameLength, onCancel }) => {
    const { allUsers } = useContext(UserContext);
    const [taskName, setTaskName] = useState('');
    const [taskDescription, setTaskDescription] = useState('');
    const [dueDate, setDueDate] = useState(null);
    const [selectedSubmitters, setSelectedSubmitters] = useState([]);
    const token = localStorage.getItem('jwtToken');

    const handleSubmit = async () => {
        const taskData = {
            name: taskName,
            description: taskDescription,
            dueDate: dueDate ? [dueDate[0].format('YYYY-MM-DD'), dueDate[1].format('YYYY-MM-DD')] : null,
            poolId: pool?._id,
            submitters: selectedSubmitters
        };

        try {
            const response = await fetch('http://localhost:5000/api/task/createTask', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    // Add any authentication headers if required
                    // 'Authorization': 'Bearer ' + yourAuthToken,
                },
                body: JSON.stringify(taskData)
            });

            if (!response.ok) {
                throw new Error('Failed to create task');
            }

            const result = await response.json();
            console.log('Task created:', result);
            message.success('Task created successfully');
            onCancel(); // Close the modal
        } catch (error) {
            console.error('Error creating task:', error);
            message.error('Failed to create task. Please try again.');
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

    return (
        <div style={{ padding: '20px' }}>
            <h4>Create New Task</h4>
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
            <Upload beforeUpload={() => false}>
                <Button icon={<UploadOutlined />}>Upload File</Button>
            </Upload>
            <Button
                type="primary"
                onClick={handleSubmit}
                style={{ marginTop: '20px', display: 'block' }}
            >
                Create Task
            </Button>
        </div>
    );
};

export default CreateTaskModal;
