import React from 'react';
import { Typography, Space } from 'antd';
import { CalendarOutlined, ClockCircleOutlined } from '@ant-design/icons';
import './TaskDetails.scss';

const { Text } = Typography;

const TaskDetails = ({ task }) => (
    <div>
        <p>{task.description}</p>
        <p>Pool: {task.poolName}</p>
        <p>Due Date: {task.dueDate.join(' to ')}</p>
        {task.isArchived && (
            <p>Archived At: {new Date(task.archivedAt).toLocaleString()}</p>
        )}
    </div>
);

export default TaskDetails;
