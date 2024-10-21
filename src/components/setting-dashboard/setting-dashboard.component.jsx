import React, { useState, useContext } from 'react';
import { UserOutlined, EditOutlined, SaveOutlined, UploadOutlined, LockOutlined } from '@ant-design/icons';
import { Avatar, Button, Form, Input, Checkbox, Upload, notification, Modal } from 'antd';
import './setting-dashboard.style.scss';
import { UserContext } from '../../contexts/UserContext';

const SettingDashboard = () => {
    const { user, setUser } = useContext(UserContext);
    const [isLoading, setIsLoading] = useState(false);
    const [form] = Form.useForm();
    const [profile, setProfile] = useState({
        name: user.name.toUpperCase(),
        avatarUrl: user.avatar,
        avatarBase64: null,
    });
    const [settings, setSettings] = useState({
        notifications: false,
    });
    const [isEditing, setIsEditing] = useState(false);

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

    const handleSettingsChange = (e) => {
        const { name, checked } = e.target;
        setSettings({
            ...settings,
            [name]: checked
        });
    };

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleSaveClick = async () => {
        try {
            setIsLoading(true);
            const values = await form.validateFields();
            
            const updateData = {
                name: values.name,
            };

            if (profile.avatarBase64) {
                updateData.avatar = profile.avatarBase64;  // Send the full data URL
            }

            const response = await fetch('https://isapi.ratacode.top/update/avatar', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updateData),
            });

            if (!response.ok) {
                setIsLoading(false);
                throw new Error('Failed to update profile');
            }

            const result = await response.json();
            
            handleProfileChange(values);
            setIsEditing(false);
            notification.success({
                message: 'Profile Updated',
                description: 'Your profile has been successfully updated.',
                placement: 'topRight',
            });

            // Update the user context if needed
            setUser(prevUser => ({
                ...prevUser,
                name: values.name,
                // Update other user properties if necessary
            }));
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
            console.error('Error updating profile:', error);
            notification.error({
                message: 'Update Failed',
                description: 'There was an error updating your profile. Please try again.',
                placement: 'topRight',
            });
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
                    const response = await fetch('https://isapi.ratacode.top/auth/forget-password', {
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

    return (
        <div className="setting-dashboard">
            <Form 
                form={form}
                layout="vertical"
                initialValues={{ name: profile.name }}
                onValuesChange={(_, allValues) => handleProfileChange(allValues)}
                className="profile-form"
            >
                <h2>Edit Profile</h2>
                <div className="profile-section">
                    <Avatar size={64} src={profile.avatarUrl} icon={<UserOutlined />} />
                    <div className="profile-details">
                        <Form.Item name="name">
                            {isEditing ? (
                                <Input placeholder="Enter your name" />
                            ) : (
                                <div className="profile-display">
                                    <span>{profile.name || 'No name set'}</span>
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
                                    beforeUpload={() => false} // Prevents auto-upload
                                    onChange={handleAvatarChange}
                                    accept="image/*"
                                >
                                    <Button 
                                        icon={<UploadOutlined />} 
                                        className="upload-button"
                                    >
                                        Upload Avatar (Max 500KB)
                                    </Button>
                                </Upload>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    icon={<SaveOutlined />}
                                    loading={isLoading}
                                    className="save-button"
                                    onClick={handleSaveClick}
                                >
                                    Save
                                </Button>
                            </>
                        )}
                    </div>
                </div>
                <h2>Settings</h2>
                <div className="settings-section">
                    <Form.Item valuePropName="checked">
                        <Checkbox onChange={handleSettingsChange}>Notifications</Checkbox>
                    </Form.Item>
                </div>

                <h3>Security</h3>
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
