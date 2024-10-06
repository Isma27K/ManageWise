import React from 'react';
import { Modal } from 'antd';
import CreateTaskModal from './mode/create-task-modal';
import UpdateTaskModal from './mode/update-task-modal';

const TaskModal = ({ visible, onCancel, pool, task, isEditable, maxTaskNameLength = 40 }) => {
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