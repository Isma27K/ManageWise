import React, { useContext } from 'react';
import { Modal, Button, Typography, Space, List, Tag, Divider, Row, Col } from 'antd';
import { UndoOutlined, CalendarOutlined, TeamOutlined, FolderOutlined } from '@ant-design/icons';
import { UserContext } from '../../../contexts/UserContext';
import './archiveModal.scss';

const { Title, Text, Paragraph } = Typography;

const ArchiveModal = ({ visible, onCancel, pool, task, isEditable, maxTaskNameLength, isSelfTask }) => {
    const { allUsers } = useContext(UserContext);

    const handleUnarchive = () => {
        // Implement unarchive functionality here
        console.log('Unarchive task:', task);
        onCancel();
    };

    const getUserName = (userId) => {
        const user = allUsers.find(user => user.uid === userId);
        return user ? user.name : 'Unknown User';
    };

    const renderTaskDetails = () => (
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <Row>
                <Col span={24}>
                    <Title level={4}>{task.name}</Title>
                </Col>
            </Row>
            <Row>
                <Col span={24}>
                    <Paragraph>{task.description}</Paragraph>
                </Col>
            </Row>
            <Row gutter={16}>
                <Col span={12}>
                    <Space>
                        <CalendarOutlined />
                        <Text strong>Due Date:</Text>
                    </Space>
                    <Paragraph>
                        {new Date(task.dueDate[0]).toLocaleDateString()} - {new Date(task.dueDate[1]).toLocaleDateString()}
                    </Paragraph>
                </Col>
                <Col span={12}>
                    <Space>
                        <FolderOutlined />
                        <Text strong>Pool:</Text>
                    </Space>
                    <Paragraph>{pool ? pool.name : 'N/A'}</Paragraph>
                </Col>
            </Row>
            <Row>
                <Col span={24}>
                    <Space align="start">
                        <TeamOutlined />
                        <Text strong>Contributors:</Text>
                    </Space>
                    <br />
                    <Space wrap style={{ marginTop: '8px' }}>
                        {task.contributor.map((contributorId, index) => (
                            <Tag key={index}>{getUserName(contributorId)}</Tag>
                        ))}
                    </Space>
                </Col>
            </Row>
        </Space>
    );

    return (
        <Modal
            title={<Title level={3}>Unarchive {task ? 'Task' : 'Pool'}</Title>}
            visible={visible}
            onCancel={onCancel}
            footer={[
                <Button key="cancel" onClick={onCancel}>
                    Cancel
                </Button>,
                <Button key="unarchive" type="primary" icon={<UndoOutlined />} onClick={handleUnarchive}>
                    Unarchive
                </Button>,
            ]}
            width={700}
            className="archive-modal"
        >
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
                <Paragraph>
                    Are you sure you want to unarchive this {task ? 'task' : 'pool'}? It will be restored to its original location.
                </Paragraph>
                {task && renderTaskDetails()}
                {pool && !task && <Title level={4}>{pool.name}</Title>}
            </Space>
        </Modal>
    );
};

export default ArchiveModal;
