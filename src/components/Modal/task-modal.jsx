import React, { useState } from 'react';
import { Modal } from 'antd';
import CreateTaskModal from './mode/create-task-modal';
import UpdateTaskModal from './mode/update-task-modal';
import UpdateTask from './mode/update-task/update-task';

const TaskModal = ({ visible, onCancel, pool, task, isEditable, maxTaskNameLength = 40 }) => {
    const [showUpdateTask, setShowUpdateTask] = useState(false);
    const [updatedTaskData, setUpdatedTaskData] = useState(null);

    const handleUpdateClick = (taskData) => {
        setUpdatedTaskData(taskData);
        setShowUpdateTask(true);
    };

    const handleUpdateTaskCancel = () => {
        setShowUpdateTask(false);
        setUpdatedTaskData(null);
    };

    if (showUpdateTask) {
        return (
            <UpdateTask
                visible={showUpdateTask}
                onCancel={handleUpdateTaskCancel}
                task={updatedTaskData}
                isEditable={isEditable}
                maxTaskNameLength={maxTaskNameLength}
            />
        );
    }

    return (
        <Modal
            title={task ? `${task.name}` : 'Create New Task'}
            visible={visible}
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
                />
            ) : (
                <CreateTaskModal
                    pool={pool}
                    maxTaskNameLength={maxTaskNameLength}
                    onCancel={onCancel}
                />
            )}
        </Modal>
    );
};

export default TaskModal;