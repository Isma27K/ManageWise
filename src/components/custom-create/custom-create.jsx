import React, { useState, useContext } from 'react';
import { Input, DatePicker, Button, Upload, Typography, Select, Avatar, message, Modal, Form } from 'antd';
import { UploadOutlined, UserOutlined, LoadingOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { UserContext } from '../../contexts/UserContext';

const { Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

const CustomCreate = ({ pool, maxTaskNameLength, onCancel, isSelfTask, visible }) => {
    const { allUsers, user, pools, setPools } = useContext(UserContext);
    const [form] = Form.useForm();
    const [taskName, setTaskName] = useState(''); //
    const [taskDescription, setTaskDescription] = useState('');
    const [dueDate, setDueDate] = useState(null); //
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
        form.setFieldsValue({ dueDate: dates });
    };

    const handleSubmit = async (values) => {
        setLoading(true);

        const formData = new FormData();
        formData.append('name', values.name);
        formData.append('description', values.description);
        formData.append('dueDate', JSON.stringify(values.dueDate.map(date => date.format('YYYY-MM-DD'))));
        formData.append('poolId', values.poolId);
        formData.append('submitters', JSON.stringify(values.users));

        // Append files to formData
        fileList.forEach((file) => {
            formData.append('files', file.originFileObj);
        });

        try {
            const response = await fetch('https://route.managewise.top/api/task/createTask', {
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

            // Fetch updated pools data
            const poolsResponse = await fetch('https://route.managewise.top/api/data/DDdata', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
            });

            if (!poolsResponse.ok) {
                throw new Error('Failed to fetch updated pools');
            }

            const updatedPools = await poolsResponse.json();
            setPools(updatedPools);

            message.success('Task created successfully');
            
            // Clear the form and reset states
            form.resetFields();
            setTaskName('');
            setTaskDescription('');
            setDueDate(null);
            setSelectedSubmitters([]);
            setFileList([]);
            setSelectedPool(null);
            setSelectedPoolUsers([]);
            
            onCancel();
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
            setTaskName(value); // Add this line to update the taskName state
            form.setFieldsValue({ name: value });
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

    // Add this new function for filtering pools
    const filterPools = (input, option) => {
        const poolName = option.children.toLowerCase();
        return poolName.indexOf(input.toLowerCase()) >= 0;
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
                <Form.Item 
                    name="poolId"
                    rules={[{ required: true, message: 'Please select a pool' }]}
                >
                    <Select
                        placeholder="Select a pool"
                        onChange={handlePoolSelect}
                        style={{ width: '100%' }}
                        showSearch
                        filterOption={filterPools}
                        optionFilterProp="children"
                    >
                        {pools.map(pool => (
                            <Option key={pool._id} value={pool._id}>{pool.name}</Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item 
                    name="name"
                    rules={[{ required: true, message: 'Task name is required' }]}
                >
                    <Input
                        onChange={handleTaskNameChange}
                        maxLength={maxTaskNameLength}
                        placeholder="Enter task name"
                    />

                    <Text type="secondary">
                        {taskName.length}/{maxTaskNameLength}
                    </Text>
                </Form.Item>

                <Form.Item 
                    name="description"
                    rules={[{ required: true, message: 'Task description is required' }]}
                >
                    <Input.TextArea
                        placeholder="Enter task description"
                    />
                </Form.Item>

                <Form.Item 
                    name="dueDate"
                    rules={[{ required: true, message: 'Please select start and end dates' }]}
                >
                    <RangePicker
                        onChange={handleDateChange}
                        style={{ width: '100%' }}
                        format="DD-MM-YYYY"
                        allowClear={true}
                        disabledDate={(current) => {
                            return current && current < dayjs().startOf('day');
                        }}
                    />
                </Form.Item>

                <Form.Item 
                    name="users"
                    rules={[{ required: true, message: 'At least one contributor is required' }]}
                >
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
                
                <Form.Item name="files">
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
