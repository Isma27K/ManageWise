import React, { useState } from 'react';
import { Modal, Input, Button, Upload, Typography, Space, Row, Col, notification } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const { Text } = Typography;

const UpdateTask = ({ visible, onCancel, taskName, task, isEditable, maxTaskNameLength }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const handleTitleChange = (e) => {
        if (e.target.value.length <= maxTaskNameLength) {
            setTitle(e.target.value);
        }
    };

    const handleUpdate = () => {

        if(title.length === 0){
            notification.error({
                message: 'Error',
                description: 'Title is required',
            });
            return;
        }


        console.log('Updating task:', { title, description });
        onCancel();
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
            bodyStyle={{ padding: '24px' }}
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
                                    placeholder="Enter task title"
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
                                    <Upload beforeUpload={() => false}>
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
                <Button type="primary" onClick={handleUpdate}>
                    UPDATE
                </Button>
            </div>
        </Modal>
    );
};

export default UpdateTask;