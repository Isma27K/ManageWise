import React, { useState } from 'react';
import { Input, Card, Avatar, Divider, Modal, List, Button, Select, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const DashboardContent = () => {
    const { Search } = Input;
    const { Group: AvatarGroup } = Avatar;
    const { Option } = Select;

    const initialTasks = [
        { title: 'Hal Ehwal Pelajar', description: 'Detailed content for Hal Ehwal Pelajar', titleColor: 'yellow', subtasks: [] },
        { title: 'Hal Ehwal Akademik', description: 'Detailed content for Hal Ehwal Akademik', titleColor: 'lightblue', subtasks: [] },
        { title: 'Hal Ehwal Staf', description: 'Detailed content for Hal Ehwal Staf', titleColor: 'lightgreen', subtasks: [] },
        { title: 'Pentadbiran & Pengurusan Am', description: 'Detailed content for Pentadbiran & Pengurusan Am', titleColor: 'lightcoral', subtasks: [] },
        { title: 'Hubungan Industri dan Graduan', description: 'Detailed content for Hubungan Industri dan Graduan', titleColor: 'lightgoldenrodyellow', subtasks: [] },
        { title: 'Hal Ehwal Pengurusan Fasiliti', description: 'Detailed content for Hal Ehwal Pengurusan Fasiliti', titleColor: 'lightpink', subtasks: [] },
    ];

    const [tasks, setTasks] = useState(initialTasks);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [activeTask, setActiveTask] = useState(null);
    const [subtasks, setSubtasks] = useState([]);
    const [newSubtask, setNewSubtask] = useState('');
    const [assignedUsers, setAssignedUsers] = useState([]);

    const showModal = (task) => {
        setActiveTask(task);
        setSubtasks(task.subtasks);
        setIsModalVisible(true);
    };

    const handleCreateSubtask = () => {
        if (newSubtask) {
            const updatedSubtasks = [...subtasks, { name: newSubtask, users: assignedUsers, completed: false }];
            setSubtasks(updatedSubtasks);
            setNewSubtask('');
            setAssignedUsers([]);
        }
    };

    const handleSave = () => {
        const updatedTasks = tasks.map((task) =>
            task.title === activeTask.title ? { ...task, subtasks } : task
        );
        setTasks(updatedTasks);
        setIsModalVisible(false);
        setActiveTask(null);
        setSubtasks([]);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setActiveTask(null);
        setSubtasks([]);
    };

    const handleCompleteSubtask = (index) => {
        const updatedSubtasks = subtasks.map((subtask, i) =>
            i === index ? { ...subtask, completed: true } : subtask
        );
        setSubtasks(updatedSubtasks);
    };

    return (
        <>
            <div style={{ padding: '34px 40px', backgroundColor: '#f5f5f5', minHeight: '100%' }}>
                <div style={{ marginBottom: '16px' }}>
                    <Search placeholder="Search task..." enterButton size="large" style={{ maxWidth: 400 }} />
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
                    {tasks.map((task, index) => (
                        <Card
                            hoverable
                            key={index}
                            title={task.title}
                            bordered={false}
                            headStyle={{
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                backgroundColor: task.titleColor,
                            }}
                            style={{
                                width: 500,
                                height: 300,
                                display: 'flex',
                                flexDirection: 'column',
                            }}
                            bodyStyle={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}
                            onClick={() => showModal(task)}
                        >
                            <div style={{ flexGrow: 1, overflow: 'hidden' }}>
                                {task.subtasks.length > 0 ? (
                                    <List
                                        size="small"
                                        dataSource={task.subtasks}
                                        renderItem={(item) => (
                                            <List.Item>
                                                {item.name} - {item.users.join(', ')}
                                            </List.Item>
                                        )}
                                        style={{
                                            maxHeight: '120px',
                                            overflowY: 'auto',
                                        }}
                                    />
                                ) : (
                                    <p style={{ textOverflow: 'ellipsis', overflow: 'hidden' }}>{task.description}</p>
                                )}
                            </div>
                            <Divider style={{ marginTop: 'auto' }} />
                            <AvatarGroup maxCount={4} size="medium">
                                <Avatar src="#" />
                                <Avatar src="#" />
                                <Avatar src="#" />
                                <Avatar src="#" />
                                <Avatar src="#" />
                                <Avatar src="#" />
                            </AvatarGroup>
                        </Card>
                    ))}
                </div>
            </div>
            {activeTask && (
                <Modal
                    title={activeTask.title}
                    visible={isModalVisible}
                    onCancel={handleCancel}  // "Cancel" button functionality
                    footer={[
                        <Button key="save" type="primary" onClick={handleSave}>
                            Save
                        </Button>,
                    ]}
                    width={1000}
                    closeIcon={<Button onClick={handleCancel} style={{ fontSize: '16px' }}>X</Button>} // "X" button as Cancel
                >
                    <div style={{ display: 'flex', height: '100%' }}>
                        <div style={{ flex: 1, marginRight: '16px' }}>
                            <h3>Subtasks</h3>
                            <List
                                bordered
                                dataSource={subtasks}
                                renderItem={(item, index) => (
                                    <List.Item>
                                        <span>{item.name} - {item.users.join(', ')}</span>
                                        {item.completed ? (
                                            <span style={{ color: 'green', marginLeft: '10px' }}>Completed</span>
                                        ) : (
                                            <Button type="primary" size="small" onClick={() => handleCompleteSubtask(index)}>
                                                Close
                                            </Button>
                                        )}
                                    </List.Item>
                                )}
                            />
                        </div>
                        <Divider type="vertical" style={{ height: '100%' }} />
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '0 16px' }}>
                            <h3>Create Subtask</h3>
                            <Input
                                placeholder="Subtask name"
                                value={newSubtask}
                                onChange={(e) => setNewSubtask(e.target.value)}
                                style={{ marginBottom: '10px' }}
                            />
                            <Select
                                mode="multiple"
                                placeholder="Assign users"
                                value={assignedUsers}
                                onChange={(value) => setAssignedUsers(value)}
                                style={{ marginBottom: '10px', width: '100%', cursor: 'pointer' }}
                            >
                                <Option value="User 1">User 1</Option>
                                <Option value="User 2">User 2</Option>
                                <Option value="User 3">User 3</Option>
                            </Select>
                            <Upload
                                showUploadList={false}
                                style={{ display: 'block', marginBottom: '10px' }}
                            >
                                <Button icon={<UploadOutlined />} style={{ width: '100%', height: '50px', fontSize: '16px' }}>
                                    Attach file
                                </Button>
                            </Upload>
                            <div style={{ flexGrow: 1 }} />
                            <Button
                                type="primary"
                                onClick={handleCreateSubtask}
                                style={{ width: '100px', alignSelf: 'flex-end' }}
                            >
                                Create
                            </Button>
                        </div>
                    </div>
                </Modal>
            )}
        </>
    );
};

export default DashboardContent;
