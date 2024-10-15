import React, { useState, useEffect } from 'react';
import { Modal, Input, Button, Upload, Typography, Space, Row, Col, notification } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useContext } from 'react';
import { UserContext } from '../../../../contexts/UserContext';

const { Text } = Typography;

const UpdateTask = ({ visible, onCancel, taskName, task, isEditable, maxTaskNameLength, pool, isSelfTask }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);

    const token = localStorage.getItem('jwtToken');

    const { user } = useContext(UserContext);

    const handleTitleChange = (e) => {
        if (e.target.value.length <= maxTaskNameLength) {
            setTitle(e.target.value);
        }
    };

    const handleFileChange = (info) => {
        if (info.fileList.length > 0) {
            const file = info.fileList[info.fileList.length - 1];
            console.log('File selected:', file);
            console.log('File object:', file.originFileObj);
            setFile(file.originFileObj);
        } else {
            setFile(null);
            console.log('No file selected');
        }
    };

    const handleUpdate = async () => {
        setLoading(true);
    
        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('CID', user._id);
        formData.append('taskID', task.id);
        
        // Debug logging
        console.log('Task object:', task);
        console.log('Is self task:', isSelfTask);

        if (isSelfTask) {
            formData.append('userID', user._id);
        } else if (pool && pool._id) {
            formData.append('poolID', isSelfTask ? user._id : pool._id);
        } else {
            console.warn('No valid pool ID or user ID found');
        }
        
        if (file) {
            formData.append('attachment', file, file.name);
            console.log('File appended to formData:', file);
        } else {
            console.log('No file selected');
        }

        // Log the final formData
        for (let [key, value] of formData.entries()) {
            console.log(`${key}:`, value instanceof File ? `File: ${value.name}` : value);
        }

        try {
            console.log(isSelfTask);
            const apiUrl = isSelfTask
                ? 'http://localhost:5000/api/task/updateTaskProgress' // self
                : 'http://localhost:5000/api/task/updateProgress';    // pool
            
            console.log('Using API URL:', apiUrl);
            
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formData,
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to update task: ${errorText}`);
            }

            const result = await response.json();
            console.log('Task update response:', result);
            notification.success({
                message: 'Success',
                description: 'Task updated successfully',
            });
            onCancel(); // Close the modal after successful update
        } catch (error) {
            console.error('Error updating task:', error);
            notification.error({
                message: 'Error',
                description: 'Failed to update task. Please try again.',
            });
        } finally {
            setLoading(false);
        }
    };

    const modules = {
        toolbar: [
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            ['blockquote', 'code-block'],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            [{ 'script': 'sub'}, { 'script': 'super' }],
            [{ 'indent': '-1'}, { 'indent': '+1' }],
            [{ 'direction': 'rtl' }],
            [{ 'color': [] }, { 'background': [] }],
            [{ 'font': [] }],
            [{ 'align': [] }],
            ['link', 'image'],
            ['clean']
        ],
    };

    return (
        <Modal
            title={taskName.name}
            visible={visible}
            onCancel={onCancel}
            footer={null}
            width="80vw"
            styles={{ body: { padding: '24px' } }}
            centered
        >
            <div style={{ maxHeight: 'calc(80vh - 120px)', overflowY: 'auto', paddingRight: '12px', height: '60vh' }}>
                <Row gutter={24}>
                    <Col span={12}>
                        <Space direction="vertical" size="large" style={{ width: '100%' }}>
                            <div>
                                <Text strong>Title</Text>
                                <Input
                                    value={title}
                                    onChange={handleTitleChange}
                                    placeholder="Enter task title (optional)"
                                    maxLength={maxTaskNameLength}
                                    style={{ marginTop: '8px' }}
                                    required
                                />
                                <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginTop: '4px' }}>
                                    {title.length}/{maxTaskNameLength}
                                </Text>
                            </div>

                            <div>
                                <Text strong>Attachment</Text>
                                <div style={{ marginTop: '8px' }}>
                                    <Upload 
                                        beforeUpload={() => false} 
                                        onChange={handleFileChange}
                                        fileList={file ? [{ uid: '-1', name: file.name, status: 'done' }] : []}
                                    >
                                        <Button icon={<UploadOutlined />}>Upload File</Button>
                                    </Upload>
                                </div>
                            </div>
                        </Space>
                    </Col>
                    <Col span={12}>
                        <div style={{ height: '100%' }}>
                            <Text strong>Description</Text>
                            <div style={{ height: 'calc(100% - 24px)', marginTop: '8px' }}>
                                <ReactQuill
                                    theme="snow"
                                    value={description}
                                    onChange={setDescription}
                                    modules={modules}
                                    style={{ height: '300px' }}
                                />
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>
            <div style={{ marginTop: '24px', textAlign: 'right' }}>
                <Button 
                    type="primary" 
                    onClick={handleUpdate}
                    loading={loading}
                    disabled={loading}
                >
                    {loading ? 'Updating...' : 'Update'}
                </Button>
            </div>
        </Modal>
    );
};

export default UpdateTask;
