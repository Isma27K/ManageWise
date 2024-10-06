import React, { useState } from 'react';
import { Modal, Input, Button, Upload, Typography, Space, Row, Col } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const { TextArea } = Input;
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
        console.log('Updating task:', { title, description });
        onCancel();
    };

    return (
        <Modal
            title={taskName.name}
            visible={visible}
            onCancel={onCancel}
            footer={null}
            width="80vw"
            bodyStyle={{ padding: '20px' }}
            centered
        >
            <Row gutter={16}>
                <Col span={12}>
                    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                        <div>
                            <Text strong>Title</Text>
                            <Input
                                value={title}
                                onChange={handleTitleChange}
                                placeholder="Enter task title"
                                maxLength={maxTaskNameLength}
                            />
                            <Text type="secondary" style={{ fontSize: '12px' }}>
                                {title.length}/{maxTaskNameLength}
                            </Text>
                        </div>

                        <div>
                            <Text strong>Attachment</Text>
                            <div>
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
                        <TextArea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Enter task description"
                            style={{ height: 'calc(100% - 30px)', minHeight: '300px' }}
                        />
                    </div>
                </Col>
            </Row>

            <div style={{ marginTop: '20px', textAlign: 'right' }}>
                <Button type="primary" onClick={handleUpdate}>
                    UPDATE
                </Button>
            </div>
        </Modal>
    );
};

export default UpdateTask;