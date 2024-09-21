// src/routes/dashboard2/ProfileContent.js
import React, { useState } from 'react';
import { Avatar, Typography, Input, Upload, Button, Divider} from 'antd';
import { UserOutlined, UploadOutlined } from '@ant-design/icons';

const { Text } = Typography;

const ProfileContent = () => {
    // State for username and profile picture
    const [username, setUsername] = useState('FAIZ KAMIRIN');
    const [email] = useState('faiz.kamirin@example.com');
    const [avatarUrl, setAvatarUrl] = useState(null);

    //state to handle editing mode
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

    // toggle between edit and save mode
    const toggleEdit = () => {
        if (isEditing) {
            setUsername(username.toUpperCase());
        }
        setIsEditing(!isEditing);
    };

    return (
        <div style={{ padding: '40px', backgroundColor: '#f5f5f5', minHeight: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ textAlign: 'center', marginRight: '40px' }}>
                    <Upload showUploadList={false} onChange={handleAvatarChange}>
                        <Avatar size={200} icon={<UserOutlined />} src={avatarUrl} style={{ cursor: 'pointer', display: 'block', }}/>
                            <Button icon={<UploadOutlined />} style={{marginTop: '10px',}}>
                                Change Avatar
                            </Button>
                    </Upload>
                </div>
                <div>
                    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', marginBottom: '100px'}}>
                    <div style={{display: 'flex', alignItems: 'center',}}>
                    {isEditing? (
                        <>
                            <Input value={username} onChange={handleUsernameChange} style={{ fontSize: '20px', marginBottom: '10px', width: '50vh', backgroundColor: 'transparent', borderColor: 'black',}}/>
                            <Button onClick={toggleEdit} style={{marginLeft: '10px', width: '70px',}}> 
                                Save
                            </Button>
                        </>  
                    ) : (

                        <>
                            <Text strong style={{ fontSize: '30px',}}>
                                {username}
                            </Text>
                            <Button onClick={toggleEdit} style={{marginLeft: '20px', width: '70px', textAlign: 'center',}}>
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
            <Divider style={{backgroundColor: 'rgba(0,0,0,0.1)'}}/>
        </div>
    );
};

export default ProfileContent;
