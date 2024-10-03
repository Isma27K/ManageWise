import React, { useState, useEffect } from 'react';
import { Modal, Divider, Input, DatePicker, Button, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const TaskModal = ({ visible, onCancel, pool, task }) => {
    const [taskName, setTaskName] = useState('');
    const [taskDescription, setTaskDescription] = useState('');
    const [dueDate, setDueDate] = useState(null);
    const { RangePicker } = DatePicker;

    useEffect(() => {
        if (task) {
            setTaskName(task.name || '');
            setTaskDescription(task.description || '');
            // If task has start and end dates, set them here
            // setDueDate([moment(task.startDate), moment(task.endDate)]);
        }
    }, [task]);

    const handleCreate = () => {
        // Here you can handle the creation or update of the task
        console.log('Task data:', { taskName, taskDescription, dueDate, poolId: pool?._id, taskId: task?.id });
        onCancel();
    };

    return (
        <Modal
            title={task ? `Edit Task: ${task.name}` : 'Create New Task'}
            visible={visible}
            onCancel={onCancel}
            footer={null}
            width={1000}
            style={{ width: '100%' }}
        >
            <div>
                <Divider style={{ margin: '0', backgroundColor: 'rgba(0,0,0,0.1)' }} />
            </div>

            <div style={{ display: 'flex', height: '100%', marginTop: '30px', padding: '0 20px' }}>
                <div style={{ flex: 1, paddingRight: '20px' }}>
                    <h4>{task ? 'Edit Task' : 'Create Task'}</h4>
                    <Input
                        placeholder="Task Name"
                        value={taskName}
                        onChange={(e) => setTaskName(e.target.value)}
                        style={{ marginBottom: '20px' }}
                    />
                    <Input.TextArea
                        placeholder="Task Description"
                        value={taskDescription}
                        onChange={(e) => setTaskDescription(e.target.value)}
                        style={{ marginBottom: '20px' }}
                    />
                    <RangePicker
                        placeholder={['Start Date', 'End Date']}
                        value={dueDate}
                        onChange={(date) => setDueDate(date)}
                        style={{ marginBottom: '20px', width: '100%' }}
                    />
                    <Upload beforeUpload={() => false}>
                        <Button icon={<UploadOutlined />}>Upload File</Button>
                    </Upload>
                    <Button
                        type="primary"
                        onClick={handleCreate}
                        style={{ marginTop: '20px' }}
                    >
                        {task ? 'Update' : 'Create'}
                    </Button>
                </div>

                {/* Visible Vertical Divider */}
                <Divider
                    type="vertical"
                    style={{
                        height: '100%',
                        backgroundColor: 'rgba(0,0,0,0.1)', // Make sure it's visible
                        alignSelf: 'stretch', // Ensures it takes full height of the container
                    }}
                />

                {/* Right Content */}
                <div style={{ flex: 1, paddingLeft: '20px' }}>
                    {task ? (
                        <div>
                            <h4>Task Details</h4>
                            <p><strong>Task ID:</strong> {task.id}</p>
                            <p><strong>Pool ID:</strong> {pool?._id}</p>
                            <p><strong>Pool Name:</strong> {pool?.name}</p>
                            {/* Add more task details here as needed */}
                        </div>
                    ) : (
                        <p>The content will be available once the task is created.</p>
                    )}
                </div>
            </div>
        </Modal>
    );
};

export default TaskModal;
