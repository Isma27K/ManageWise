import React, { useState } from 'react';
import { Avatar, Typography, Input, Upload, Button, Divider, Space, message, Select } from 'antd';
import { UserOutlined, UploadOutlined, CopyOutlined } from '@ant-design/icons';

const { Text } = Typography;
const { Option } = Select;

const AdminProfile = () => {
    // State for username and profile picture
    const [username, setUsername] = useState('FAIZ KAMIRIN');
    const [email] = useState('faiz.kamirin@example.com');
    const [avatarUrl, setAvatarUrl] = useState(null);
    const [generatelink, setGeneratedLink] = useState('');
    const [linkVisible, setLinkVisible] = useState(false);

    const [users] = useState([
        { id: 1, name: 'User 1' },
        { id: 2, name: 'User 2' },
        { id: 3, name: 'User 3' },
    ]);

    const [roles] = useState([
        { id: 1, role: 'Admin' },
        { id: 2, role: 'Editor' },
        { id: 3, role: 'Viewer' },
    ]);

    // State for selected user, role and pool user
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedRole, setSelectedRole] = useState(null);
    const [selectedPoolUser, setSelectedPoolUser] = useState(null);

    const [poolName, setPoolName] = useState('');
    const [poolDescription, setPoolDescription] = useState('');

    // Function to generate a random link
    const handleGenerateLink = () => {
        const newLink = `generatelink//example.com/blahblah/admin-link/${Math.random().toString(36).substring(2, 15)}`;
        setGeneratedLink(newLink);
        setLinkVisible(true);
    };

    // Function to handle saving the user and role assignment
    const handleSave = () => {
        if (!selectedUser || !selectedRole) {
            message.error("Please select both a user and a role.");
            return;
        }
        message.success(`Assigned ${selectedUser} as ${selectedRole}`);
    };

    // Function to copy the generated link
    const handleCopyLink = () => {
        navigator.clipboard.writeText(generatelink);
        message.success("Link copied to clipboard!");
    };

    //function to create a pool
    const handleCreatePool = () => {
        if (!poolName || !poolDescription || !selectedPoolUser) {
            message.error("Please fill in all fields and select a user for the pool.");
            return;
        }
        message.success(`Pool '${poolName}' created with user '${selectedPoolUser}' assigned.`);
    };

    // State to handle editing mode
    const [isEditing, setIsEditing] = useState(false);

    // Handle username change
    const handleUsernameChange = (e) => {
        setUsername(e.target.value);
    };

    // Handle avatar upload
    const handleAvatarChange = ({ file }) => {
        const reader = new FileReader();
        reader.onload = () => {
            setAvatarUrl(reader.result); // Set uploaded image as avatar
        };
        reader.readAsDataURL(file.originFileObj);
    };

    // Toggle between edit and save mode
    const toggleEdit = () => {
        if (isEditing) {
            setUsername(username.toUpperCase());
        }
        setIsEditing(!isEditing);
    };

    return (
        <div style={{ padding: '40px', backgroundColor: '#f5f5f5', minHeight: '100%' }}>
            {/* Profile Section */}
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '30px' }}>
                <div style={{ textAlign: 'center', marginRight: '40px' }}>
                    <Upload showUploadList={false} onChange={handleAvatarChange}>
                        <Avatar size={200} icon={<UserOutlined />} src={avatarUrl} style={{ cursor: 'pointer', display: 'block' }} />
                        <Button icon={<UploadOutlined />} style={{ marginTop: '10px' }}>
                            Change Avatar
                        </Button>
                    </Upload>
                </div>
                <div>
                    <div style={{ marginBottom: '50px' }}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            {isEditing ? (
                                <>
                                    <Input
                                        value={username}
                                        onChange={handleUsernameChange}
                                        style={{ fontSize: '20px', marginBottom: '10px', width: '50vh', backgroundColor: 'transparent', borderColor: 'black' }}
                                    />
                                    <Button onClick={toggleEdit} style={{ marginLeft: '10px', width: '70px' }}>
                                        Save
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Text strong style={{ fontSize: '30px' }}>
                                        {username}
                                    </Text>
                                    <Button onClick={toggleEdit} style={{ marginLeft: '20px', width: '70px', textAlign: 'center' }}>
                                        Edit
                                    </Button>
                                </>
                            )}
                        </div>
                        <Text type="secondary" style={{ fontSize: '20px' }}>
                            {email}
                        </Text>
                    </div>
                </div>
            </div>

            {/* Invite Link Generator */}
            <Divider style={{ backgroundColor: 'rgba(0,0,0,0.1)' }} />
            <div style={{ marginTop: '30px' }}>
                <Text style={{ fontWeight: 'bold', fontSize: '16px' }}>Invite Link Generator</Text>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '30px' }}>
                    <Input value={generatelink} placeholder="Generated link will appear here" readOnly style={{ width: '450px' }} suffix={<CopyOutlined onClick={handleCopyLink} style={{ cursor: 'pointer' }} />} />
                    <Button type="primary" onClick={handleGenerateLink} style={{ marginLeft: '20px' }}>
                        Generate Link
                    </Button>
                </div>
            </div>

            {/* User & Role Assignment */}
            <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-end', marginBottom: '50px' }}>
                {/* User Select */}
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <Text style={{ fontWeight: 'bold', fontSize: '16px', marginBottom: '10px' }}>Select User</Text>
                    <Select placeholder="Select a user" onChange={(value) => setSelectedUser(value)} style={{ width: '200px' }}>
                        {users.map((user) => (
                            <Option key={user.id} value={user.name}>
                                {user.name}
                            </Option>
                        ))}
                    </Select>
                </div>

                {/* Role Select */}
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <Text style={{ fontWeight: 'bold', fontSize: '16px', marginBottom: '10px' }}>Select Role</Text>
                    <Select placeholder="Select a role" onChange={(value) => setSelectedRole(value)} style={{ width: '200px' }}>
                        {roles.map((role) => (
                            <Option key={role.id} value={role.role}>
                                {role.role}
                            </Option>
                        ))}
                    </Select>
                </div>

                {/* Save Button */}
                <Button type="primary" onClick={handleSave} style={{ marginLeft: '10px' }}>
                    Save
                </Button>
            </div>

            {/* Pool Creation */}
            <Divider style={{ backgroundColor: 'rgba(0,0,0,0.1)' }} />
            <div style={{ marginTop: '30px' }}>
                <Text style={{ fontWeight: 'bold', fontSize: '18px' }}>Create Pool</Text>
                <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
                    {/* Pool Name */}
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <Text style={{ fontWeight: 'bold', fontSize: '16px', marginBottom: '10px' }}>Pool Name</Text>
                        <Input placeholder="Enter pool name" style={{ width: '200px' }} />
                    </div>

                    {/* Pool Description */}
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <Text style={{ fontWeight: 'bold', fontSize: '16px', marginBottom: '10px' }}>Pool Description</Text>
                        <Input placeholder="Enter pool description" style={{ width: '300px' }} />
                    </div>
                </div>

                <div style={{ marginTop: '20px' }}>
                    {/* Assign User to Pool */}
                    <div style={{display: 'flex', flexDirection: 'column'}}>
                        <Text style={{ fontWeight: 'bold', fontSize: '16px', marginBottom: '10px' }}>Assign User to Pool</Text>
                            <Select placeholder="Select a user to add to the pool" onChange={(value) => setSelectedPoolUser(value)} style={{ width: '300px' }}>
                                {users.map((user) => (
                                    <Option key={user.id} value={user.name}>
                                        {user.name}
                                    </Option>
                                ))}
                        </Select>
                    </div>
                </div>
                <div style={{marginTop: '20px'}}>
                    <Button type="primary" onClick={{handleCreatePool}}>Create</Button>
                </div>
            </div>

            <Divider style={{ backgroundColor: 'rgba(0,0,0,0.1)', marginTop: '20px' }} />
        </div>
    );
};

export default AdminProfile;
