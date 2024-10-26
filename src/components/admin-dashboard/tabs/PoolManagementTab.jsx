import React, { useState } from 'react';
import { Form, Input, Button, Select, Avatar, notification } from 'antd';
import { UserOutlined } from '@ant-design/icons';

const { Option } = Select;

const PoolManagementTab = ({ users }) => {
  const [form] = Form.useForm();
  const [poolName, setPoolName] = useState('');
  const [poolDescription, setPoolDescription] = useState('');
  const [selectedPoolUsers, setSelectedPoolUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);


  const openNotification = (type, message, description) => {
    notification[type]({
      message,
      description,
      placement: 'topRight',
    });
  };

  const onFinish = async (values) => {
    try {
      setIsLoading(true);
      const response = await fetch('https://isapi.ratacode.top/api/admin/CreatePool', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          poolName,
          poolDescription,
          userId: selectedPoolUsers, // Ensure this is an array of user IDs
        }),
      });

      if (response.ok) {
        openNotification('success', 'Success', 'Pool created successfully');
      } else if (response.status === 400 || response.status === 409) {
        openNotification('error', 'Error', 'Pool already exists');
      } else {
        openNotification('error', 'Error', 'Failed to create pool');
      }
    } catch (error) {
      openNotification('error', 'Error', 'Failed to create pool');
    } finally {
      setIsLoading(false);
    }

    // Reset form fields
    form.resetFields();
    setPoolName('');
    setPoolDescription('');
    setSelectedPoolUsers([]);
  };

  const handlePoolUserSelect = (values) => {
    setSelectedPoolUsers(values); // Set selected user IDs
  };

  const filterUsers = (input, option) => {
    const name = (option.label || '').toLowerCase();
    const email = (option.children?.props?.children[1]?.props?.children[1]?.props?.children || '').toLowerCase();
    return name.indexOf(input.toLowerCase()) >= 0 || email.indexOf(input.toLowerCase()) >= 0;
  };

  return (
    <Form layout="vertical" onFinish={onFinish} form={form} className="admin-form">
      <h3>Create Pool</h3>
      <Form.Item
        name="poolName"
        label="Pool Name"
        rules={[{ required: true, message: 'Please enter a pool name' }]}
      >
        <Input
          placeholder="Enter pool name"
          onChange={(e) => setPoolName(e.target.value)}
        />
      </Form.Item>
      <Form.Item name="poolDescription" label="Pool Description">
        <Input.TextArea
          placeholder="Enter pool description"
          onChange={(e) => setPoolDescription(e.target.value)}
        />
      </Form.Item>
      <Form.Item
        name="assignUserPool"
        label="Assign Users for Pool"
        rules={[{ required: true, message: 'Please assign at least one user' }]}
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
        >
          {users.map(user => (
            <Option
              key={user.uid} // Use uid as the key
              value={user.uid} // Ensure value is the user ID
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
      <Form.Item>
        <Button type="primary" htmlType="submit" loading={isLoading}>CREATE</Button>
      </Form.Item>
    </Form>
  );
};

export default PoolManagementTab;
