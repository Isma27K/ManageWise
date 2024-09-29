import React, { useState } from 'react';
import { Form, Input, Button, Select, message, Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';

const { Option } = Select;

const DeleteOperationsTab = ({ users }) => {
  const [form] = Form.useForm();
  const [deletePoolId, setDeletePoolId] = useState('');
  const [deleteUserId, setDeleteUserId] = useState(null);

  const handleDeletePool = (values) => {
    console.log('Deleting pool with ID:', values.deletePool);
    message.success(`Pool with ID ${values.deletePool} has been deleted.`);
    form.resetFields(['deletePool']);
    setDeletePoolId('');
  };

  const handleDeleteUser = () => {
    if (deleteUserId) {
      const user = users.find(u => u.id === deleteUserId);
      if (user) {
        console.log('Deleting user:', user.name);
        message.success(`User ${user.name} has been deleted.`);
        form.resetFields(['deleteUser']);
        setDeleteUserId(null);
      } else {
        message.error('User not found');
      }
    } else {
      message.error('Please select a user to delete');
    }
  };

  const filterUsers = (input, option) => {
    const name = option.label.toLowerCase();
    const email = option.children.props.children[1].props.children[1].props.children.toLowerCase();
    return name.indexOf(input.toLowerCase()) >= 0 || email.indexOf(input.toLowerCase()) >= 0;
  };

  return (
    <>
      <Form layout="vertical" onFinish={handleDeletePool} className="admin-form">
        <Form.Item 
          name="deletePool" 
          label="DELETE POOL"
          rules={[{ required: true, message: 'Please enter a Pool ID' }]}
        >
          <Input 
            placeholder="Enter Pool ID" 
            onChange={(e) => setDeletePoolId(e.target.value)}
          />
        </Form.Item>
        <Form.Item>
          <Button danger htmlType="submit">DELETE POOL</Button>
        </Form.Item>
      </Form>
      <Form layout="vertical" onFinish={handleDeleteUser} className="admin-form">
        <Form.Item 
          name="deleteUser" 
          label="DELETE USER"
          rules={[{ required: true, message: 'Please select a user to delete' }]}
        >
          <Select
            showSearch
            placeholder="Search for a user to delete"
            optionFilterProp="children"
            onChange={(value) => setDeleteUserId(value)}
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
        <Form.Item>
          <Button danger htmlType="submit">DELETE USER</Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default DeleteOperationsTab;