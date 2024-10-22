import React, { useContext } from 'react';
import { List, Card, Tag } from 'antd';
import { UserContext } from '../../contexts/UserContext';

const TimeBasedReports = ({ user }) => {
    const { pools } = useContext(UserContext);

    const getUserTasks = () => {
        return pools.flatMap(pool => 
            pool.tasks
                .filter(task => task.contributor.includes(user))
                .map(task => ({ ...task, poolName: pool.name }))
        );
    };

    const userTasks = getUserTasks();
    console.log('User tasks:', userTasks);
    const inProgressTasks = userTasks.filter(task => !task.isArchived);
    const completedTasks = userTasks.filter(task => task.isArchived);

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
                                        <p>Archived At: {new Date(task.archivedAt.$date).toLocaleString()}</p>
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
            {renderTaskList(inProgressTasks, 'In Progress Tasks')}
            {renderTaskList(completedTasks, 'Completed Tasks')}
        </div>
    );
};

export default TimeBasedReports;
