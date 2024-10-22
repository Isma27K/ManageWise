import React, { useState } from 'react';
import { List, Card, Tag, Collapse, Pagination } from 'antd';
import TaskDetails from './TaskDetails';
import './TimeBasedReports.scss';

const { Panel } = Collapse;

const TimeBasedReports = ({ data }) => {
    const { completedTasks, incompleteTasks } = data || {};
    const [inProgressPage, setInProgressPage] = useState(1);
    const [completedPage, setCompletedPage] = useState(1);
    const pageSize = 5;

    const renderTaskList = (tasks, title, currentPage, setPage) => (
        <Card title={title} style={{ height: '100%' }}>
            <List
                dataSource={tasks.slice((currentPage - 1) * pageSize, currentPage * pageSize)}
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
            {tasks.length > pageSize && (
                <Pagination
                    current={currentPage}
                    onChange={setPage}
                    total={tasks.length}
                    pageSize={pageSize}
                    style={{ marginTop: '16px', textAlign: 'right' }}
                />
            )}
        </Card>
    );

    return (
        <div className="time-based-reports">
            <h2>Tasks</h2>
            <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ flex: 1 }}>
                    {renderTaskList(incompleteTasks, 'In Progress Tasks', inProgressPage, setInProgressPage)}
                </div>
                <div style={{ flex: 1 }}>
                    {renderTaskList(completedTasks, 'Completed Tasks', completedPage, setCompletedPage)}
                </div>
            </div>
        </div>
    );
};

export default TimeBasedReports;
