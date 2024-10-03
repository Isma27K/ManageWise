import React, { useState, useEffect } from 'react';
import { Modal, Divider, Input, DatePicker, Button, Upload, Typography } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import dayjs from 'dayjs'; // Switch to dayjs for better compatibility with Ant Design

const { Text } = Typography;

const TaskModal = ({ visible, onCancel, pool, task, isEditable, maxTaskNameLength = 40 }) => {
    const [taskName, setTaskName] = useState('');
    const [taskDescription, setTaskDescription] = useState('');
    const [dueDate, setDueDate] = useState(null);
    const { RangePicker } = DatePicker;

    useEffect(() => {
        if (task) {
            setTaskName(task.name || '');
            setTaskDescription(task.description || '');
            // Update the dueDate handling
            if (task.dueDate && Array.isArray(task.dueDate) && task.dueDate.length === 2) {
                setDueDate([dayjs(task.dueDate[0]), dayjs(task.dueDate[1])]);
            } else {
                setDueDate(null);
            }
        } else {
            // Reset fields when creating a new task
            setTaskName('');
            setTaskDescription('');
            setDueDate(null);
        }
    }, [task]);

    const handleSubmit = () => {
        const taskData = {
            name: taskName,
            description: taskDescription,
            dueDate: dueDate ? [dueDate[0].format('YYYY-MM-DD'), dueDate[1].format('YYYY-MM-DD')] : null,
            poolId: pool?._id
        };

        if (task) {
            // Handle edit
            console.log('Editing task:', { ...taskData, id: task.id });
            // Add your edit logic here
        } else {
            // Handle create
            console.log('Creating task:', taskData);
            // Add your create logic here
        }
        onCancel();
    };

    const handleTaskNameChange = (e) => {
        const value = e.target.value;
        if (value.length <= maxTaskNameLength) {
            setTaskName(value);
        }
    };

    return (
        <Modal
            title={task ? `Task Details: ${task.name}` : 'Create New Task'}
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
                    <h4>{task ? 'Task Details' : 'Create Task'}</h4>
                    <div style={{ marginBottom: '20px' }}>
                        <Input
                            placeholder="Task Name"
                            value={taskName}
                            onChange={handleTaskNameChange}
                            disabled={!isEditable}
                            maxLength={maxTaskNameLength}
                        />
                        <Text type="secondary">
                            {taskName.length}/{maxTaskNameLength}
                        </Text>
                    </div>
                    <Input.TextArea
                        placeholder="Task Description"
                        value={taskDescription}
                        onChange={(e) => setTaskDescription(e.target.value)}
                        style={{ marginBottom: '20px' }}
                        disabled={!isEditable}
                    />
                    <RangePicker
                        placeholder={['Start Date', 'End Date']}
                        value={dueDate}
                        onChange={(dates) => {
                            console.log('RangePicker onChange:', dates);
                            setDueDate(dates);
                        }}
                        style={{ marginBottom: '20px', width: '100%' }}
                        //disabled={!isEditable}
                        format="DD-MM-YYYY"
                        allowClear={true}
                        disabledDate={(current) => current && current < dayjs().startOf('day')}
                    />

                    {isEditable && (
                        <Upload beforeUpload={() => false}>
                            <Button icon={<UploadOutlined />}>Upload File</Button>
                        </Upload>
                    )}

                    <Button
                        type="primary"
                        onClick={handleSubmit}
                        style={{ marginTop: '20px' }}
                    >
                        {task ? 'Update Task' : 'Create Task'}
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
                            <h4>Submitor</h4>

                            {/* Add more task details here as needed */}
                        </div>
                    ) : (
                        <p>Additional details will be available once the task is created.</p>
                    )}
                </div>
            </div>
        </Modal>
    );
};

export default TaskModal;
