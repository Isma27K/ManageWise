import React, { useState, useEffect, useContext } from 'react';
import { Input, DatePicker, Button, Upload, Typography, Select, Avatar, List, Empty, Divider } from 'antd';
import { UploadOutlined, UserOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { UserContext } from '../../../contexts/UserContext';

const { Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

const UpdateTaskModal = ({ task, isEditable, maxTaskNameLength, onCancel }) => {
    const { allUsers } = useContext(UserContext);
    const [taskName, setTaskName] = useState('');
    const [taskDescription, setTaskDescription] = useState('');
    const [dueDate, setDueDate] = useState(null);
    const [selectedSubmitters, setSelectedSubmitters] = useState([]);

    useEffect(() => {
        if (task) {
            setTaskName(task.name || '');
            setTaskDescription(task.description || '');
            if (task.dueDate && Array.isArray(task.dueDate) && task.dueDate.length === 2) {
                setDueDate([dayjs(task.dueDate[0]), dayjs(task.dueDate[1])]);
            } else {
                setDueDate(null);
            }
            setSelectedSubmitters(task.submitters || []);
        }
    }, [task]);

    const handleSubmit = () => {
        const taskData = {
            name: taskName,
            description: taskDescription,
            dueDate: dueDate ? [dueDate[0].format('YYYY-MM-DD'), dueDate[1].format('YYYY-MM-DD')] : null,
            submitters: selectedSubmitters
        };

        console.log('Editing task:', { ...taskData, id: task.id });
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

    const getNameInitial = (name) => {
        return name ? name.charAt(0).toUpperCase() : '?';
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
                    Update Task
                </Button>
            </div>

            <Divider type="vertical" style={{ height: '100%' }} />

            <div style={{ flex: 1, paddingLeft: '20px', display: 'flex', flexDirection: 'column' }}>
                <h4>Progress</h4>
                {task.progress && task.progress.length > 0 ? (
                    <List
                        style={{ overflowY: 'auto', flex: 1, maxHeight: 'calc(100% - 40px)' }}
                        itemLayout="horizontal"
                        dataSource={task.progress}
                        renderItem={(item) => {
                            const user = allUsers.find(u => u.uid === item.CID);
                            return (
                                <List.Item>
                                    <List.Item.Meta
                                        avatar={
                                            <Avatar 
                                                src={user?.avatarUrl} 
                                                icon={!user?.avatarUrl && <UserOutlined />}
                                            >
                                                {(!user?.avatarUrl && user?.name) && getNameInitial(user.name)}
                                            </Avatar>
                                        }
                                        title={item.detail || 'Unknown User'}
                                        description={
                                            <Text type="secondary" style={{ fontSize: '0.8em' }}>
                                                {item.date ? dayjs(item.date).format('YYYY-MM-DD HH:mm') : 'No date provided'}
                                            </Text>
                                        }
                                    />
                                </List.Item>
                            );
                        }}
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
