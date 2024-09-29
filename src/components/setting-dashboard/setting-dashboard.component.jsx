import React, { useState } from 'react';
import { UserOutlined, EditOutlined, SaveOutlined, UploadOutlined } from '@ant-design/icons';
import { Avatar, Button, Form, Input, Checkbox, Upload } from 'antd';
import './setting-dashboard.style.scss';

const SettingDashboard = () => {
    const [form] = Form.useForm();
    const [profile, setProfile] = useState({
        name: 'Muhammad Ismail Bin Helati',
        avatarUrl: '',
        avatarFile: null,
    });
    const [settings, setSettings] = useState({
        notifications: false,
    });
    const [isEditing, setIsEditing] = useState(false);

    const handleProfileChange = (changedValues) => {
        setProfile((prevProfile) => ({
            ...prevProfile,
            ...changedValues
        }));
    };

    const handleAvatarChange = ({ file }) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            setProfile((prevProfile) => ({
                ...prevProfile,
                avatarUrl: e.target.result,
                avatarFile: file
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

    const handleSaveClick = () => {
        form.validateFields().then((values) => {
            handleProfileChange(values);
            setIsEditing(false);
            // Handle save logic here
        });
    };

    return (
        <div className="setting-dashboard">
            <Form 
                form={form}
                layout="vertical"
                initialValues={{ name: profile.name }}
                onValuesChange={(_, allValues) => handleProfileChange(allValues)}
                onFinish={handleSaveClick}
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
                                >
                                    <Button 
                                        icon={<UploadOutlined />} 
                                        className="upload-button"
                                    >
                                        Upload Avatar
                                    </Button>
                                </Upload>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    icon={<SaveOutlined />}
                                    className="save-button"
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
            </Form>
        </div>
    );
};

export default SettingDashboard;
