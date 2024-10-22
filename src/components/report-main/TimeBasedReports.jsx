import React from 'react';
import { List, Card, Tag, Collapse } from 'antd';
import TaskDetails from './TaskDetails';
import './TimeBasedReports.scss';

const { Panel } = Collapse;

const TimeBasedReports = ({ data }) => {
    const { completedTasks, incompleteTasks } = data || {};

    const renderTaskList = (tasks, title) => (
        <Card title={title} style={{ marginBottom: 16 }}>
            <List
                dataSource={tasks}
                renderItem={task => (
                    <List.Item>
                        <Collapse style={{ width: '100%' }} expandIconPosition="right">
                            <Panel
                                header={
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                                        <span>{task.name}</span>
                                        <Tag color={task.isArchived ? 'green' : 'blue'}>
                                            {task.isArchived ? 'Completed' : 'In Progress'}
                                        </Tag>
                                    </div>
                                }
                                key={task.id}
                            >
                                <TaskDetails task={task} />
                            </Panel>
                        </Collapse>
                    </List.Item>
                )}
            />
        </Card>
    );

    return (
        <div className="time-based-reports">
            <h2>Your Tasks</h2>
            {renderTaskList(incompleteTasks, 'In Progress Tasks')}
            {renderTaskList(completedTasks, 'Completed Tasks')}
        </div>
    );
};

export default TimeBasedReports;
