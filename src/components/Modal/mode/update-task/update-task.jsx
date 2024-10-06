import React from 'react';
import { Modal } from 'antd';

const UpdateTask = ({ visible, onCancel, task, isEditable, maxTaskNameLength }) => {
    return (
        <Modal
            title="Update Task"
            visible={visible}
            onCancel={onCancel}
            footer={null}
            width="80vw"
            style={{ top: 20 }}
            centered
        >
            <div style={{ display: 'flex', height: '70vh', maxHeight: '600px' }}>
                <div style={{ flex: 1, paddingRight: '20px', display: 'flex', flexDirection: 'column' }}>
                    {/* Left side content */}
                    <div style={{ flex: 1, overflowY: 'auto' }}>
                        {/* For now, this modal is empty */}
                        <div>Update Task Modal Content (Left Side)</div>
                    </div>
                </div>

                <div style={{ flex: 1, paddingLeft: '20px', display: 'flex', flexDirection: 'column' }}>
                    {/* Right side content */}
                    <div style={{ flex: 1, overflowY: 'auto' }}>
                        {/* For now, this modal is empty */}
                        <div>Update Task Modal Content (Right Side)</div>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default UpdateTask;