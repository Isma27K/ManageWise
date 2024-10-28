import React, { useState, useEffect, useRef } from 'react';
import { Card, List, Button, Tooltip, Tag } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import TaskModal from '../Modal/task-modal';
import './main-card.style.scss';

const MainCard = ({ pools, maxTaskNameLength = 40, isSelfTask }) => {
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [selectedPool, setSelectedPool] = useState(null);
	const [selectedTask, setSelectedTask] = useState(null);
	const [truncateLength, setTruncateLength] = useState(50);
	const cardRef = useRef(null);

	const showModal = (pool, task = null) => {
		setSelectedPool(pool);
		setSelectedTask(task);
		setIsModalVisible(true);
	};

	const handleCancel = () => {
		setIsModalVisible(false);
	};

	useEffect(() => {
		const updateTruncateLength = () => {
			if (cardRef.current) {
				const cardWidth = cardRef.current.offsetWidth;
				setTruncateLength(Math.floor(cardWidth / 8)); // Adjust this value as needed
			}
		};

		updateTruncateLength();
		window.addEventListener('resize', updateTruncateLength);

		return () => window.removeEventListener('resize', updateTruncateLength);
	}, []);

	const truncateText = (text, maxLength) => {
		if (text.length <= maxLength) return text;
		return text.substr(0, maxLength) + '...';
	};

	const getPriorityLevel = (dueDate) => {
		if (!dueDate || !dueDate[1]) return { level: 'normal', color: 'default', priority: 4 };
		
		// Create date objects
		const today = new Date();
		today.setHours(0, 0, 0, 0); // Reset time part to start of day
		
		const taskDate = new Date(dueDate[1]);
		taskDate.setHours(0, 0, 0, 0); // Reset time part to start of day

		// Calculate difference in days
		const diffTime = taskDate.getTime() - today.getTime();
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

		if (diffDays < 0) {
			return { level: 'Overdue', color: 'error', priority: 0 };
		} else if (diffDays <= 2) {
			return { level: 'Urgent', color: 'red', priority: 1 };
		} else if (diffDays <= 7) {
			return { level: 'High', color: 'orange', priority: 2 };
		} else if (diffDays <= 14) {
			return { level: 'Medium', color: 'yellow', priority: 3 };
		} else {
			return { level: 'Low', color: 'green', priority: 4 };
		}
	};

	const sortTasks = (tasks) => {
		if (!tasks) return [];
		return [...tasks].sort((a, b) => {
			const priorityA = getPriorityLevel(a.dueDate).priority;
			const priorityB = getPriorityLevel(b.dueDate).priority;
			
			// Sort by priority first
			if (priorityA !== priorityB) {
				return priorityA - priorityB;
			}
			
			// If same priority, sort by due date
			const dateA = a.dueDate ? new Date(a.dueDate[1]) : new Date('9999-12-31');
			const dateB = b.dueDate ? new Date(b.dueDate[1]) : new Date('9999-12-31');
			return dateA - dateB;
		});
	};

	if (!pools || pools.length === 0) {
		return <div>No pools available</div>;
	}

	return (
		<>
			<div className="card-container">
				{pools.map((pool, index) => (
						<div key={index} className="card-item" ref={cardRef}>
							<Card
								className={`custom-card ${pool.name.toLowerCase() === 'my tasks' ? 'my-tasks-card' : ''}`}
								title={
									<Tooltip title={pool.name.length > truncateLength ? pool.name : ''} mouseEnterDelay={0.4}>
										<span>{truncateText(pool.name.toUpperCase(), truncateLength)}</span>
									</Tooltip>
								}
								bordered={false}
								hoverable
							>
								<div className="scrollable-content">
									<List
										size="small"
										dataSource={sortTasks(pool.tasks)}
										renderItem={(task) => {
											const taskName = task.name || `Task ${task.id}`;
											const truncatedName = truncateText(taskName, truncateLength);
											const isTruncated = truncatedName !== taskName;
											const priority = getPriorityLevel(task.dueDate);

											return (
												<Tooltip 
													title={
														<>
															{isTruncated && <div>{taskName}</div>}
															{task.dueDate && (
																<div>Due: {new Date(task.dueDate[1]).toLocaleDateString('en-GB', {
																	day: 'numeric',
																	month: 'long',
																	year: 'numeric'
																})}</div>
															)}
														</>
													} 
													mouseEnterDelay={0.4}
												>
													<List.Item
														key={task.id}
														onClick={() => showModal(pool, task)}
														style={{ cursor: 'pointer' }}
														className="task-list-item"
													>
														<div className="task-content">
															<span>{truncatedName}</span>
															<Tag color={priority.color}>{priority.level}</Tag>
														</div>
													</List.Item>
												</Tooltip>
											);
										}}
									/>
								</div>
								<div className="card-footer">
									{!pool.isSelfTask && (
										<Tooltip title="Add Task" mouseEnterDelay={0.4}>
											<Button
												className="create-task-btn"
												type="primary"
												shape="circle"
												icon={<PlusOutlined />}
												onClick={(e) => {
													e.stopPropagation();
													showModal(pool);
												}}
											/>
										</Tooltip>
									)}
								</div>
							</Card>
						</div>
					))}
			</div>

			<TaskModal
				visible={isModalVisible}
				onCancel={handleCancel}
				pool={selectedPool}
				task={selectedTask}
				isEditable={!selectedTask}
				maxTaskNameLength={maxTaskNameLength}
				isSelfTask={selectedPool?.isSelfTask}
			/>
		</>
	);
};

export default MainCard;
