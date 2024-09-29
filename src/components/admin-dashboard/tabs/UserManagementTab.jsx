import React, { useState } from 'react';
import { Form, Select, Button, message, Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';

const { Option } = Select;

const UserManagementTab = ({ users, roles }) => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);

  const handleUserSelect = (value) => setSelectedUser(value);
  const handleRoleSelect = (value) => setSelectedRole(value);

  const handleUserAssignment = () => {
    if (selectedUser && selectedRole) {
      const user = users.find(u => u.id === selectedUser);
      if (user) {
        message.success(`Assigned role ${selectedRole} to ${user.name}`);
        // Here you would typically make an API call to update the user's role
      } else {
        message.error('User not found');
      }
    } else {
      message.error('Please select both a user and a role');
    }
  };

  const filterUsers = (input, option) => {
    const name = option.label.toLowerCase();
    const email = option.children.props.children[1].props.children[1].props.children.toLowerCase();
    return name.indexOf(input.toLowerCase()) >= 0 || email.indexOf(input.toLowerCase()) >= 0;
  };

  return (
    <Form layout="vertical" onFinish={handleUserAssignment} className="admin-form">
      <Form.Item name="selectUser" label="SELECT USER">
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
              key={user.id} 
              value={user.id} 
              label={user.name}
            >
              <div style={{ display: 'flex', alignItems: 'center', padding: '8px 0' }}>
                <Avatar icon={<UserOutlined />} src={user.avatar} />
                <div style={{ marginLeft: 8 }}>
                  <div>{user.name}</div>
                  <div style={{ fontSize: '0.8em', color: '#888' }}>{user.email}</div>
                </div>
              </div>
            </Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item name="assignRole" label="ASSIGN ROLE">
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