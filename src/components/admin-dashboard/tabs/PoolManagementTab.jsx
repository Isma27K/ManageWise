import React, { useState } from 'react';
import { Form, Input, Button, Select, Upload, message, Avatar } from 'antd';
import { UploadOutlined, UserOutlined } from '@ant-design/icons';

const { Option } = Select;

const PoolManagementTab = ({ users }) => {
  const [form] = Form.useForm();
  const [poolName, setPoolName] = useState('');
  const [poolDescription, setPoolDescription] = useState('');
  const [selectedPoolUsers, setSelectedPoolUsers] = useState([]);
  const [poolImage, setPoolImage] = useState(null);

  const onFinish = (values) => {
    const newPool = {
      name: values.poolName,
      description: values.poolDescription,
      users: selectedPoolUsers,
      image: poolImage
    };

    console.log('Creating new pool:', newPool);
    message.success(`Pool "${newPool.name}" created successfully with ${newPool.users.length} users assigned.`);

    form.resetFields();
    setPoolName('');
    setPoolDescription('');
    setSelectedPoolUsers([]);
    setPoolImage(null);
  };

  const handlePoolUserSelect = (values) => {
    setSelectedPoolUsers(values);
  };

  const filterUsers = (input, option) => {
    const name = option.label.toLowerCase();
    const email = option.children.props.children[1].props.children[1].props.children.toLowerCase();
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
      <Form.Item name="poolImage" label="Pool Profile Image (optional)">
        <Upload 
          beforeUpload={(file) => {
            setPoolImage(file);
            return false;
          }}
        >
          <Button icon={<UploadOutlined />}>Click to Upload</Button>
        </Upload>
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">CREATE</Button>
      </Form.Item>
    </Form>
  );
};

export default PoolManagementTab;