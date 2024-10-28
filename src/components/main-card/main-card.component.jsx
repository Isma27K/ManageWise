import React, { useState, useEffect, useRef } from 'react';
import { Card, List, Button, Tooltip } from 'antd';
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
									dataSource={pool.tasks || []}
									renderItem={(task) => {
										const taskName = task.name || `Task ${task.id}`;
										const truncatedName = truncateText(taskName, truncateLength);
										const isTruncated = truncatedName !== taskName;

										return (
											<Tooltip title={isTruncated ? taskName : ''} mouseEnterDelay={0.4}>
												<List.Item
													key={task.id}
													onClick={() => showModal(pool, task)}
													style={{ cursor: 'pointer' }}
												>
													{truncatedName}
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
