import React, { useState } from 'react';
import { Modal, notification } from 'antd';
import { CSSTransition } from 'react-transition-group';
import CreateTaskModal from './mode/create-task-modal';
import UpdateTaskModal from './mode/update-task-modal';
import UpdateTask from './mode/update-task/update-task';
import './task-modal.scss'; // We'll create this CSS file next

const TaskModal = ({ visible, onCancel, pool, task, isEditable, maxTaskNameLength = 40, isSelfTask }) => {
    const [showUpdateTask, setShowUpdateTask] = useState(false);
    const [updatedTaskData, setUpdatedTaskData] = useState(null);
    const token = localStorage.getItem('jwtToken');

    const handleUpdateClick = (taskData) => {
        setUpdatedTaskData(taskData);
        setShowUpdateTask(true);
    };

    const handleUpdateSave = async (taskData) => {
        setUpdatedTaskData(taskData);
    
        console.log('Saving updated task data:', taskData);
    
        try {
            const response = await fetch(taskData.apiUrl, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'  // Add this line
                },
                body: JSON.stringify(taskData)
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to update task');
            }
    
            const result = await response.json();
            console.log('Update result:', result);  // Add this line
            notification.success({
                message: 'Task Updated',
                description: 'The task has been updated successfully.',
            });
        } catch (error) {
            console.error('Error updating task:', error);
            notification.error({
                message: 'Update Failed',
                description: error.message,
            });
        }
    };

    const handleUpdateTaskCancel = () => {
        setShowUpdateTask(false);
        setUpdatedTaskData(null);
    };

    return (
        <>
            <CSSTransition
                in={visible && !showUpdateTask}
                timeout={300}
                classNames="fade"
                unmountOnExit
            >
                <Modal
                    title={task ? `${task.name}` : 'Create New Task'}
                    visible={visible && !showUpdateTask}
                    onCancel={onCancel}
                    footer={null}
                    width={task ? "80vw" : "40vw"}
                    style={{ top: 20 }}
                    centered
                >
                    {task ? (
                        <UpdateTaskModal
                            task={task}
                            isEditable={isEditable}
                            maxTaskNameLength={maxTaskNameLength}
                            onCancel={onCancel}
                            onUpdateClick={handleUpdateClick}
                            handleUpdateSave={handleUpdateSave}
                            pool={pool}
                            isSelfTask={isSelfTask}
                        />
                    ) : (
                        <CreateTaskModal
                            pool={pool}
                            maxTaskNameLength={maxTaskNameLength}
                            onCancel={onCancel}
                            isSelfTask={isSelfTask}
                        />
                    )}
                </Modal>
            </CSSTransition>

            <CSSTransition
                in={showUpdateTask}
                timeout={10}
                classNames="fade"
                unmountOnExit
            >
                <UpdateTask
                    visible={showUpdateTask}
                    onCancel={handleUpdateTaskCancel}
                    task={updatedTaskData}
                    isEditable={isEditable}
                    maxTaskNameLength={maxTaskNameLength}
                    taskName={task}
                    isSelfTask={isSelfTask}
                    pool={pool}
                />
            </CSSTransition>
        </>
    );
};

export default TaskModal;
