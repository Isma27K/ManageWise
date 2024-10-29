import React, { useState, useContext } from 'react';
import { UserOutlined, EditOutlined, SaveOutlined, UploadOutlined, LockOutlined, MailOutlined, IdcardOutlined, CloseOutlined, DeleteOutlined, EyeInvisibleOutlined, EyeTwoTone, ApiOutlined } from '@ant-design/icons';
import { Avatar, Button, Form, Input, Upload, notification, Modal, Card, Typography, Tag } from 'antd';
import './setting-dashboard.style.scss';
import { UserContext } from '../../contexts/UserContext';

const { Title, Text } = Typography;

const SettingDashboard = () => {
    const { user, setUser } = useContext(UserContext);
    const [isLoading, setIsLoading] = useState(false);
    const [form] = Form.useForm();
    const [profile, setProfile] = useState({
        name: user.name,
        avatarUrl: user.avatar,
        avatarBase64: null,
    });
    const [isEditing, setIsEditing] = useState(false);
    const [isApiLoading, setIsApiLoading] = useState(false);
    const [isEditingApi, setIsEditingApi] = useState(false);
    const [tempApiKey, setTempApiKey] = useState('');

    const token = localStorage.getItem('jwtToken');

    const handleProfileChange = (changedValues) => {
        setProfile((prevProfile) => ({
            ...prevProfile,
            ...changedValues
        }));
    };

    const handleAvatarChange = ({ file }) => {
        const isLt500KB = file.size / 1024 < 500;
        if (!isLt500KB) {
            notification.error({
                message: 'Upload Failed',
                description: 'Image must be smaller than 500KB!',
                placement: 'topRight',
            });
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            setProfile((prevProfile) => ({
                ...prevProfile,
                avatarUrl: e.target.result,
                avatarBase64: e.target.result  // Keep the full data URL
            }));
        };
        reader.readAsDataURL(file);
    };

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        form.setFieldsValue({ name: user.name });
        setProfile(prevProfile => ({
            ...prevProfile,
            name: user.name,
            avatarUrl: user.avatar,
            avatarBase64: null
        }));
    };

    const handleRemoveAvatar = async () => {
        try {
            setIsLoading(true);
            const response = await fetch('https://route.managewise.top/update/remove-avater', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ uid: user._id }),
            });

            if (!response.ok) {
                throw new Error('Failed to delete avatar');
            }

            const result = await response.json();

            // Update the user context and component state
            const updatedUser = {
                ...user,
                avatar: null
            };
            setUser(updatedUser);
            setProfile(prevProfile => ({
                ...prevProfile,
                avatarUrl: null,
                avatarBase64: null
            }));

            // Update the UserContext
            if (setUser) {
                setUser(updatedUser);
            }

            notification.success({
                message: 'Avatar Removed',
                description: 'Your avatar has been successfully removed.',
                placement: 'topRight',
            });
        } catch (error) {
            console.error('Error removing avatar:', error);
            notification.error({
                message: 'Remove Avatar Failed',
                description: 'There was an error removing your avatar. Please try again.',
                placement: 'topRight',
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveClick = async () => {
        try {
            setIsLoading(true);
            const values = await form.validateFields();
            
            const updateData = {
                name: values.name,
            };

            if (profile.avatarBase64) {
                updateData.avatar = profile.avatarBase64;
            }

            const response = await fetch('https://route.managewise.top/update/avatar', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updateData),
            });

            if (!response.ok) {
                throw new Error('Failed to update profile');
            }

            const result = await response.json();
            
            // Update the user context and component state
            const updatedUser = {
                ...user,
                name: values.name,
                avatar: profile.avatarBase64 || user.avatar
            };
            setUser(updatedUser);
            setProfile(prevProfile => ({
                ...prevProfile,
                name: values.name,
                avatarUrl: updatedUser.avatar
            }));

            setIsEditing(false);
            notification.success({
                message: 'Profile Updated',
                description: 'Your profile has been successfully updated.',
                placement: 'topRight',
            });
        } catch (error) {
            console.error('Error updating profile:', error);
            notification.error({
                message: 'Update Failed',
                description: 'There was an error updating your profile. Please try again.',
                placement: 'topRight',
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleResetPassword = () => {
        Modal.confirm({
            title: 'Reset Password',
            icon: <LockOutlined />,
            content: 'Are you sure you want to reset your password? An email will be sent to your registered email address with further instructions.',
            onOk: async () => {
                try {
                    setIsLoading(true);
                    const response = await fetch('https://route.managewise.top/auth/forget-password', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ email: user.email }),
                    });

                    if (response.ok) {
                        notification.success({
                            message: 'Reset Email Sent',
                            description: 'Please check your email for instructions to reset your password.',
                            placement: 'topRight',
                        });
                    } else {
                        const errorData = await response.json();
                        throw new Error(errorData.message || 'Failed to send reset email');
                    }
                } catch (error) {
                    console.error('Error during password reset request:', error);
                    notification.error({
                        message: 'Reset Password Failed',
                        description: error.message || 'An unexpected error occurred. Please try again later.',
                        placement: 'topRight',
                    });
                } finally {
                    setIsLoading(false);
                }
            },
        });
    };

    const handleEditApiClick = () => {
        setIsEditingApi(true);
        setTempApiKey('');
    };

    const handleCancelApiEdit = () => {
        setIsEditingApi(false);
        setTempApiKey('');
        form.setFieldsValue({ geminiApiKey: '' });
    };

    const handleApiKeyChange = (e) => {
        setTempApiKey(e.target.value);
    };

    // ============================================================   api key ==================================================
    const handleSubmitApiKey = async () => {
        if (!tempApiKey.trim()) {
            notification.error({
                message: 'Invalid API Key',
                description: 'Please enter a valid API key.',
                placement: 'topRight',
            });
            return;
        }

        try {
            setIsApiLoading(true);
            const response = await fetch('https://route.managewise.top/api/v1/addKeyword', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    apiKey: tempApiKey,
                    uid: user._id 
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to update API key');
            }

            const result = await response.json();
            
            setUser({
                ...user,
                hasApi: true
            });

            setIsEditingApi(false);
            setTempApiKey('');
            form.setFieldsValue({ geminiApiKey: '' });

            notification.success({
                message: 'API Key Updated',
                description: 'Your Gemini API key has been successfully saved.',
                placement: 'topRight',
            });
        } catch (error) {
            console.error('Error saving API key:', error);
            notification.error({
                message: 'Failed to Save API Key',
                description: 'There was an error saving the API key. Please try again.',
                placement: 'topRight',
            });
        } finally {
            setIsApiLoading(false);
        }
    };

    const handleRemoveApiKey = async () => {
        try {
            setIsApiLoading(true);
            const response = await fetch('https://route.managewise.top/api/v1/deleteKeyword', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ uid: user._id }),
            });

            if (!response.ok) {
                throw new Error('Failed to remove API key');
            }

            // Update the user context
            setUser({
                ...user,
                hasApi: false
            });

            // Reset the form field
            form.setFieldsValue({ geminiApiKey: '' });

            notification.success({
                message: 'API Key Removed',
                description: 'Your Gemini API key has been successfully removed.',
                placement: 'topRight',
            });
        } catch (error) {
            console.error('Error removing API key:', error);
            notification.error({
                message: 'Failed to Remove API Key',
                description: 'There was an error removing the API key. Please try again.',
                placement: 'topRight',
            });
        } finally {
            setIsApiLoading(false);
        }
    };

    // ===================================================================================================================

    return (
        <div className="setting-dashboard">
            <Card className="profile-card">
                <div className="profile-header">
                    <Avatar size={100} src={profile.avatarUrl} icon={<UserOutlined />} />
                    <div className="profile-info">
                        <Title level={2}>{user.name}</Title>
                        <Text type="secondary"><MailOutlined /> {user.email}</Text>
                        <Text type="secondary"><IdcardOutlined /> {user._id}</Text>
                        {user.admin && <Tag color="green">Admin</Tag>}
                    </div>
                </div>
            </Card>

            <Form 
                form={form}
                layout="vertical"
                initialValues={{ 
                    name: profile.name
                }}
                onValuesChange={(_, allValues) => handleProfileChange(allValues)}
                className="profile-form"
            >
                <Title level={3}>Edit Profile</Title>
                <div className="profile-section">
                    <div className="profile-details">
                        <Form.Item name="name" label="Name">
                            {isEditing ? (
                                <Input placeholder="Enter your name" />
                            ) : (
                                <div className="profile-display">
                                    <Text>{profile.name || 'No name set'}</Text>
                                    <Button
                                        type="link"
                                        icon={<EditOutlined />}
                                        onClick={handleEditClick}
                                    >
                                        Edit
                                    </Button>
                                </div>
                            )}
                        </Form.Item>
                        {isEditing && (
                            <>
                                <Upload
                                    showUploadList={false}
                                    beforeUpload={() => false}
                                    onChange={handleAvatarChange}
                                    accept="image/*"
                                >
                                    <Button 
                                        icon={<UploadOutlined />} 
                                        className="edit-button"
                                    >
                                        Upload Avatar (Max 500KB)
                                    </Button>
                                </Upload>
                                <Button
                                    icon={<DeleteOutlined />}
                                    className="edit-button remove-avatar-button"
                                    onClick={handleRemoveAvatar}
                                    loading={isLoading}
                                >
                                    Remove Avatar
                                </Button>
                                <div className="edit-actions">
                                    <Button
                                        icon={<SaveOutlined />}
                                        loading={isLoading}
                                        className="edit-button"
                                        onClick={handleSaveClick}
                                    >
                                        Save
                                    </Button>
                                    <Button
                                        icon={<CloseOutlined />}
                                        className="edit-button"
                                        onClick={handleCancelEdit}
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                <Title level={3}>Settings</Title>
                <div className="settings-section">
                    <div className="setting-item">
                        <div className="setting-label">
                            <ApiOutlined /> Google Gemini API Key
                        </div>
                        <div className="setting-content">
                            {!isEditingApi ? (
                                <div className="setting-display">
                                    <Text type="secondary">
                                        {user.hasApi ? "API key configured" : "No API key configured"}
                                    </Text>
                                    <Button
                                        type="primary"
                                        onClick={handleEditApiClick}
                                    >
                                        {user.hasApi ? 'Change Key' : 'Add API Key'}
                                    </Button>
                                </div>
                            ) : (
                                <div className="setting-edit">
                                    <Input.Password
                                        placeholder="Enter your Gemini API key"
                                        onChange={handleApiKeyChange}
                                        value={tempApiKey}
                                        disabled={isApiLoading}
                                    />
                                    <div className="setting-actions">
                                        <Button
                                            type="primary"
                                            onClick={handleSubmitApiKey}
                                            loading={isApiLoading}
                                        >
                                            Save
                                        </Button>
                                        <Button
                                            onClick={handleCancelApiEdit}
                                            disabled={isApiLoading}
                                        >
                                            Cancel
                                        </Button>
                                        {user.hasApi && (
                                            <Button
                                                danger
                                                onClick={handleRemoveApiKey}
                                                loading={isApiLoading}
                                            >
                                                Remove
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <Title level={3}>Security</Title>
                <div className="security-section">
                    <Button
                        icon={<LockOutlined />}
                        onClick={handleResetPassword}
                        loading={isLoading}
                        className="reset-password-button"
                    >
                        Reset Password
                    </Button>
                </div>
            </Form>
        </div>
    );
};

export default SettingDashboard;
