import React, { useState } from 'react';
import { Form, Select, Input, Button, message, Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';

const { Option } = Select;

const EditPoolInfo = ({ pools, users }) => {
    const [form] = Form.useForm();
    const [selectedPool, setSelectedPool] = useState(null);
    const token = localStorage.getItem('jwtToken');
    const [loading, setLoading] = useState(false);
    const [selectedPoolUsers, setSelectedPoolUsers] = useState([]);

    const handlePoolSelect = (poolId) => {
        const pool = pools.find(p => p._id === poolId);
        setSelectedPool(pool);
        // Update the form fields
        form.setFieldsValue({
            poolId: pool._id,
            name: pool.name,
            description: pool.description,
            users: pool.userIds, // Use userIds instead of users
        });
        // Set the selected pool users
        setSelectedPoolUsers(pool.userIds);
    };

    const handlePoolUserSelect = (values) => {
        setSelectedPoolUsers(values); // Set selected user IDs
    };

    const filterUsers = (input, option) => {
        const name = (option.label || '').toLowerCase();
        const email = (option.children?.props?.children[1]?.props?.children[1]?.props?.children || '').toLowerCase();
        return name.indexOf(input.toLowerCase()) >= 0 || email.indexOf(input.toLowerCase()) >= 0;
    };

    const handleUpdatePool = async (values) => {
        setLoading(true);
        if (!selectedPool) {
            message.error('Please select a pool to update');
            setLoading(false);
            return;
        }

        try {
            const updatedValues = {
                ...values,
                userIds: selectedPoolUsers, // Include the selected users
            };
            const response = await fetch('https://api.managewise.top/update/pool', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedValues),
            }); 
            
            message.success('Pool information updated successfully');
            form.resetFields();
            setSelectedPool(null);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            message.error('Failed to update pool information');
        }
    };

    return (
        <>
            <h3>Edit Pool Info</h3>
            <Form layout="vertical" form={form} onFinish={handleUpdatePool} className="admin-form">
                <Form.Item 
                    name="poolId" 
                    label="Select Pool"
                    rules={[{ required: true, message: 'Please select a pool to edit' }]}
                >
                    <Select
                        placeholder="Select a pool to edit"
                        onChange={handlePoolSelect}
                        style={{ width: '100%' }}
                    >
                        {pools.map(pool => (
                            <Option key={pool._id} value={pool._id}>{pool.name}</Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item
                    name="name"
                    label="Pool Name"
                    rules={[{ required: true, message: 'Please enter the pool name' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="description"
                    label="Pool Description"
                    rules={[{ required: false, message: 'Please enter the pool description' }]}
                >
                    <Input.TextArea rows={4} />
                </Form.Item>
                <Form.Item
                    name="users"
                    label="Pool Users"
                    rules={[{ required: false, message: 'Please select pool users' }]}
                >
                    <Select
                        mode="multiple"
                        showSearch
                        placeholder="Search for users"
                        optionFilterProp="children"
                        onChange={handlePoolUserSelect}
                        filterOption={filterUsers}
                        style={{ width: '100%' }}
                        listHeight={300}
                        dropdownStyle={{ maxHeight: '300px', overflow: 'auto' }}
                        optionLabelProp="label"
                        value={selectedPoolUsers}
                    >
                        {users.map(user => (
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
                {/* Add other form items for additional pool information */}
                <Form.Item>
                    <Button type="primary" htmlType="submit" className='update-button' loading={loading}>
                        Update Pool Info
                    </Button>
                </Form.Item>
            </Form>
        </>
    );
};

export default EditPoolInfo;
