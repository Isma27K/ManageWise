import React, { useState, useEffect, useRef } from 'react';
import { List, Button, Tooltip, Card, Tag } from 'antd';
import { PlusOutlined, DownOutlined, RightOutlined } from '@ant-design/icons';
import TaskModal from '../Modal/task-modal';
import './card.style.scss';

const CustomCard = ({ pools, maxTaskNameLength = 40, isSelfTask }) => {
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [selectedPool, setSelectedPool] = useState(null);
	const [selectedTask, setSelectedTask] = useState(null);
	const [expandedPools, setExpandedPools] = useState({});
	const [truncateLength, setTruncateLength] = useState(50);
	const cardRef = useRef(null);

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

	const showModal = (pool, task = null) => {
		setSelectedPool(pool);
		setSelectedTask(task);
		setIsModalVisible(true);
	};

	const handleCancel = () => {
		setIsModalVisible(false);
	};

	const togglePool = (poolName) => {
		setExpandedPools(prev => ({
			...prev,
			[poolName]: !prev[poolName]
		}));
	};

	const truncateText = (text, maxLength) => {
		if (text.length <= maxLength) return text;
		return text.substr(0, maxLength) + '...';
	};

	if (!pools || pools.length === 0) {
		return <div>No pools available</div>;
	}

	return (
		<>
			<div className="pool-grid" ref={cardRef}>
				{pools.map(pool => (
					<Card
						key={pool._id}
						className={`pool-card ${expandedPools[pool.name] ? 'expanded' : ''}`}
						title={
							<div className="pool-header" onClick={() => togglePool(pool.name)}>
								{expandedPools[pool.name] ? <DownOutlined /> : <RightOutlined />}
								<Tooltip title={pool.name.toUpperCase()} mouseEnterDelay={0.3}>
									<span className="pool-title">{truncateText(pool.name.toUpperCase(), truncateLength)}</span>
								</Tooltip>
							</div>
						}
						extra={
							!pool.isSelfTask && (
								<Tooltip title="Add Task" mouseEnterDelay={0.3}>
									<Button
										className="create-task-btn"
										type="primary"
										icon={<PlusOutlined />}
										onClick={(e) => {
											e.stopPropagation();
											showModal(pool);
										}}
									/>
								</Tooltip>
							)
						}
					>
						{expandedPools[pool.name] && (
							<List
								className="task-list"
								dataSource={sortTasks(pool.tasks)}
								renderItem={(task) => {
									const taskName = task.name || `Task ${task.id}`;
									const truncatedName = truncateText(taskName, truncateLength);
									const isTruncated = truncatedName !== taskName;
									const priority = getPriorityLevel(task.dueDate);

									return (
										<List.Item 
											key={task.id}
											onClick={() => showModal(pool, task)}
											className="task-item"
										>
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
												mouseEnterDelay={0.3}
											>
												<div className="task-content">
													<span>{truncatedName}</span>
													<Tag color={priority.color}>{priority.level}</Tag>
												</div>
											</Tooltip>
										</List.Item>
									);
								}}
							/>
						)}
					</Card>
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

export default CustomCard;
