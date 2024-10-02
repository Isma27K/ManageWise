import React, { useState } from 'react';
import { Form, Select, Button, message, Avatar, notification } from 'antd';
import { UserOutlined } from '@ant-design/icons';

const { Option } = Select;

const UserManagementTab = ({ users, roles }) => {
  const [form] = Form.useForm();
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);

  const openNotification = (type, message, description) => {
    notification[type]({
      message,
      description,
      placement: 'topRight',
    });
  };

  const handleUserSelect = (value) => setSelectedUser(value);
  const handleRoleSelect = (value) => setSelectedRole(value);

  const handleUserAssignment = async () => {
    if (selectedUser && selectedRole) {
      const user = users.find(u => u.uid === selectedUser || u.id === selectedUser);
      if (user) {
        try {
          // Implement the actual role assignment API call here
          console.log('Assigning role:', selectedRole, 'to user:', user.name);
          openNotification('success', 'Success', `Assigned role ${selectedRole} to ${user.name}`);
          form.resetFields();
          setSelectedUser(null);
          setSelectedRole(null);
        } catch (error) {
          openNotification('error', 'Error', 'Failed to assign role');
        }
      } else {
        openNotification('error', 'Error', 'User not found');
      }
    } else {
      openNotification('error', 'Error', 'Please select both a user and a role');
    }
  };

  const filterUsers = (input, option) => {
    const name = (option.label || '').toLowerCase();
    const email = (option.email || '').toLowerCase();
    return name.includes(input.toLowerCase()) || email.includes(input.toLowerCase());
  };

  return (
    <Form form={form} layout="vertical" onFinish={handleUserAssignment} className="admin-form">
      <Form.Item 
        name="selectUser" 
        label="SELECT USER"
        rules={[{ required: true, message: 'Please select a user' }]}
      >
        <Select
          showSearch
          placeholder="Search for a user"
          optionFilterProp="children"
          onChange={handleUserSelect}
          filterOption={filterUsers}
          style={{ width: '100%' }}
          listHeight={300}
          dropdownStyle={{ maxHeight: '300px', overflow: 'auto' }}
          optionLabelProp="label"
        >
          {users.map(user => (
            <Option
              key={user.uid || user.id}
              value={user.uid || user.id}
              label={user.name ? user.name.toUpperCase() : 'NO NAME'}
              email={user.email}
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
      <Form.Item 
        name="assignRole" 
        label="ASSIGN ROLE"
        rules={[{ required: true, message: 'Please select a role' }]}
      >
        <Select
          placeholder="Select a role"
          onChange={handleRoleSelect}
          style={{ width: '100%' }}
        >
          {roles.map(role => (
            <Option key={role} value={role}>{role}</Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">SAVE</Button>
      </Form.Item>
    </Form>
  );
};

export default UserManagementTab;