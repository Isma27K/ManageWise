import React, { useState, useContext } from 'react';
import { Form, Button, Select, message, Avatar, notification } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { UserContext } from '../../../contexts/UserContext';

const { Option } = Select;

const DeleteOperationsTab = ({ users, pools, setUsers }) => {
  const [form] = Form.useForm();
  const [deletePoolId, setDeletePoolId] = useState('');
  const [deleteUserId, setDeleteUserId] = useState(null);
  const token = localStorage.getItem('jwtToken');
  const { setAllUsers, setPools } = useContext(UserContext);

  //console.log(users);

  const openNotification = (type, message, description) => {
    notification[type]({
      message,
      description,
      placement: 'topRight',
    });
  };

  const handleDeletePool = async (values) => {
    console.log('Deleting pool with ID:', values.ArchivePool);
    // Implement the actual delete pool API call here
    message.success(`Pool with ID ${values.ArchivePool} has been deleted.`);
    form.resetFields(['ArchivePool']);
    setDeletePoolId('');
  };

  const handleDeleteUser = async () => {
    if (deleteUserId) {
      const user = users.find(u => u.uid === deleteUserId || u.id === deleteUserId);
      if (user) {
        try {
          const response = await fetch('https://isapi.ratacode.top/api/admin/DeleteUser', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId: deleteUserId }),
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const result = await response.json();

          if (result.message === "User deleted successfully") {
            // Update the local users state
            const updatedUsers = users.filter(u => u.uid !== deleteUserId && u.id !== deleteUserId);
            setUsers(updatedUsers);

            openNotification('success', 'Success', `User ${user.name} has been deleted.`);
            form.resetFields(['deleteUser']);
            setDeleteUserId(null);
          } else {
            throw new Error(result.message || 'Failed to delete user');
          }
        } catch (error) {
          console.error('Error deleting user:', error);
          openNotification('error', 'Error', `Failed to delete user: ${error.message}`);
        }
      } else {
        openNotification('error', 'Error', 'User not found');
      }
    } else {
      openNotification('error', 'Error', 'Please select a user to delete');
    }
  };

  const handleUserChange = (value) => {
    setDeleteUserId(value);
  };

  const filterUsers = (input, option) => {
    const name = (option.label || '').toLowerCase();
    const email = (option.email || '').toLowerCase();
    return name.includes(input.toLowerCase()) || email.includes(input.toLowerCase());
  };

  return (
    <>
      {/*<Form layout="vertical" onFinish={handleDeletePool} className="admin-form">
        <Form.Item 
          name="ArchivePool" 
          label="Archive POOL"
          rules={[{ required: true, message: 'Please select a pool to Archive' }]}
        >
          <Select
            placeholder="Select a pool to Archive"
            onChange={(value) => setDeletePoolId(value)}
            style={{ width: '100%' }}
          >
            {pools.map(pool => (
              <Option key={pool._id} value={pool._id}>{pool.name}</Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item>
          <Button danger htmlType="submit" className='archive-button'>
            Archive POOL
          </Button>
        </Form.Item>
      </Form>*/}
      <Form form={form} layout="vertical" onFinish={handleDeleteUser} className="admin-form">
        <Form.Item 
          name="deleteUser" 
          label="DELETE USER"
          rules={[{ required: true, message: 'Please select a user to delete' }]}
        >
          <Select
            showSearch
            placeholder="Search for a user to delete"
            optionFilterProp="children"
            onChange={handleUserChange}
            value={deleteUserId}
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
        <Form.Item>
          <Button danger htmlType="submit">DELETE USER</Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default DeleteOperationsTab;