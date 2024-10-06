import React, { useState } from 'react';
import { Modal } from 'antd';
import { CSSTransition } from 'react-transition-group';
import CreateTaskModal from './mode/create-task-modal';
import UpdateTaskModal from './mode/update-task-modal';
import UpdateTask from './mode/update-task/update-task';
import './task-modal.css'; // We'll create this CSS file next

const TaskModal = ({ visible, onCancel, pool, task, isEditable, maxTaskNameLength = 40 }) => {
    const [showUpdateTask, setShowUpdateTask] = useState(false);
    const [updatedTaskData, setUpdatedTaskData] = useState(null);

    const handleUpdateClick = (taskData) => {
        setUpdatedTaskData(taskData);
        setShowUpdateTask(true);
    };

    const handleUpdateSave = (taskData) => {
        setUpdatedTaskData(taskData);

        // Here you should implement the logic to save the updated task data

        console.log('Saving updated task data:', taskData);

        // For example, you might want to call an API to update the task

        // updateTaskAPI(taskData).then(() => {
        //     // Handle successful update
        // }).catch(error => {
        //     // Handle error
        // });
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
                        />
                    ) : (
                        <CreateTaskModal
                            pool={pool}
                            maxTaskNameLength={maxTaskNameLength}
                            onCancel={onCancel}
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
                />
            </CSSTransition>
        </>
    );
};

export default TaskModal;