import React from 'react';
import { List, Card, Tag } from 'antd';

const TimeBasedReports = ({ data }) => {
    console.log('Data:', data);
    const { completedTasks, incompleteTasks } = data || {};

    const renderTaskList = (tasks, title) => (
        <Card title={title} style={{ marginBottom: 16 }}>
            <List
                dataSource={tasks}
                renderItem={task => (
                    <List.Item>
                        <List.Item.Meta
                            title={task.name}
                            description={
                                <>
                                    <p>{task.description}</p>
                                    <p>Pool: {task.poolName}</p>
                                    <p>Due Date: {task.dueDate.join(' to ')}</p>
                                    {task.isArchived && (
                                        <p>Archived At: {new Date(task.archivedAt).toLocaleString()}</p>
                                    )}
                                </>
                            }
                        />
                        <Tag color={task.isArchived ? 'green' : 'blue'}>
                            {task.isArchived ? 'Completed' : 'In Progress'}
                        </Tag>
                    </List.Item>
                )}
            />
        </Card>
    );

    return (
        <div>
            <h2>Your Tasks</h2>
            {renderTaskList(incompleteTasks, 'In Progress Tasks')}
            {renderTaskList(completedTasks, 'Completed Tasks')}
        </div>
    );
};

export default TimeBasedReports;
