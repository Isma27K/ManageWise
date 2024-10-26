import React, { useState, useContext } from 'react';
import { Input, DatePicker, Button, Upload, Typography, Select, Avatar, message, Modal, Form } from 'antd';
import { UploadOutlined, UserOutlined, LoadingOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { UserContext } from '../../contexts/UserContext';

const { Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

const CustomCreate = ({ pool, maxTaskNameLength, onCancel, isSelfTask, visible }) => {
    const { allUsers, user, pools } = useContext(UserContext);
    const [form] = Form.useForm();
    const [taskName, setTaskName] = useState('');
    const [taskDescription, setTaskDescription] = useState('');
    const [dueDate, setDueDate] = useState(null);
    const [selectedSubmitters, setSelectedSubmitters] = useState(pool?.userIds || []);
    const [fileList, setFileList] = useState([]);
    const token = localStorage.getItem('jwtToken');
    const [loading, setLoading] = useState(false);
    const [selectedPool, setSelectedPool] = useState(null);
    const [selectedPoolUsers, setSelectedPoolUsers] = useState([]);

    const handleDateChange = (dates) => {
        if (dates && dates[0] && dates[1] && dates[1].isBefore(dates[0])) {
            message.error('End date cannot be before start date');
            return;
        }
        setDueDate(dates);
        form.setFieldsValue({ dueDate: dates });
    };

    const handleSubmit = async (values) => {
        setLoading(true);

        if (!selectedPool) {
            message.error('Please select a pool');
            setLoading(false);
            return;
        }
        if (!values.name || values.name.trim().length === 0) {
            message.error('Task name is required');
            setLoading(false);
            return;
        }
        if (!values.description || values.description.trim().length === 0) {
            message.error('Task description is required');
            setLoading(false);
            return;
        }
        if (!values.dueDate || !Array.isArray(values.dueDate) || values.dueDate.length !== 2) {
            message.error('Please select both start and end dates');
            setLoading(false);
            return;
        }
        if (values.dueDate[1].isBefore(values.dueDate[0])) {
            message.error('End date cannot be before start date');
            setLoading(false);
            return;
        }
        if (!values.users || values.users.length === 0) {
            message.error('At least one contributor is required');
            setLoading(false);
            return;
        }

        const formData = new FormData();
        formData.append('name', values.name);
        formData.append('description', values.description);
        formData.append('dueDate', JSON.stringify(values.dueDate.map(date => date.format('YYYY-MM-DD'))));
        formData.append('poolId', selectedPool._id);
        formData.append('submitters', JSON.stringify(values.users));

        // Append files to formData
        fileList.forEach((file) => {
            formData.append('files', file.originFileObj);
        });

        try {
            const response = await fetch('https://isapi.ratacode.top/api/task/createTask', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to create task');
            }

            const result = await response.json();
            message.success('Task created successfully');
            onCancel(); // Close the modal
        } catch (error) {
            console.error('Error creating task:', error);
            message.error(error.message || 'Failed to create task. Please try again.');
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

    const handlePoolSelect = (poolId) => {
        const selectedPool = pools.find(p => p._id === poolId);
        setSelectedPool(selectedPool);
        // Set the poolId in the form
        form.setFieldsValue({
            poolId: selectedPool._id,
        });
        // Set the selected submitters to the users associated with the pool
        const poolUsers = selectedPool.userIds || [];
        setSelectedSubmitters(poolUsers);
        setSelectedPoolUsers(poolUsers);
        // Update the form field for users
        form.setFieldsValue({
            users: poolUsers,
        });
        // Keep task name and description fields empty
        setTaskName('');
        setTaskDescription('');
        form.setFieldsValue({
            name: '',
            description: '',
        });
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
        <Modal
            visible={visible}
            onCancel={onCancel}
            title="Create New Task"
            footer={null}
            width={600}
        >
            <Form form={form} onFinish={handleSubmit} layout="vertical">
                <Form.Item name="poolId" label="Select Pool">
                    <Select
                        placeholder="Select a pool"
                        onChange={handlePoolSelect}
                        style={{ width: '100%' }}
                    >
                        {pools.map(pool => (
                            <Option key={pool._id} value={pool._id}>{pool.name}</Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item name="name" label="Task Name">
                    <Input
                        value={taskName}
                        onChange={handleTaskNameChange}
                        maxLength={maxTaskNameLength}
                        placeholder="Enter task name"
                    />
                </Form.Item>
                <Text type="secondary">
                    {taskName.length}/{maxTaskNameLength}
                </Text>

                <Form.Item name="description" label="Task Description">
                    <Input.TextArea
                        value={taskDescription}
                        onChange={(e) => setTaskDescription(e.target.value)}
                        placeholder="Enter task description"
                    />
                </Form.Item>

                <Form.Item name="dueDate" label="Due Date">
                    <RangePicker
                        value={dueDate}
                        onChange={handleDateChange}
                        style={{ width: '100%' }}
                        format="DD-MM-YYYY"
                        allowClear={true}
                        disabledDate={(current) => {
                            // Can't select days before today
                            return current && current < dayjs().startOf('day');
                        }}
                    />
                </Form.Item>

                <Form.Item name="users" label="Contributors">
                    <Select
                        mode="multiple"
                        showSearch
                        placeholder="Search for Contributors"
                        onChange={handleSubmitterSelect}
                        filterOption={filterUsers}
                        style={{ width: '100%' }}
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
                </Form.Item>
                
                <Form.Item name="files" label="Upload Files">
                    <Upload
                        fileList={fileList}
                        onChange={handleFileChange}
                        beforeUpload={() => false}
                        multiple
                    >
                        <Button icon={<UploadOutlined />}>Upload File(s)</Button>
                    </Upload>
                </Form.Item>
                <div style={{ marginTop: '10px' }}>
                    {fileList.length > 0 && `${fileList.length} file(s) selected`}
                </div>

                <Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        style={{ display: 'block', width: '100%' }}
                        disabled={loading}
                    >
                        <span style={{ marginRight: loading ? '10px' : '0' }}>
                            {loading ? 'Creating Task' : 'Create Task'}
                        </span>
                        {loading && <LoadingOutlined style={{ fontSize: 16 }} spin />}
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default CustomCreate;
