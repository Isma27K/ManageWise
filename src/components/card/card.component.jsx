import React, { useState, useEffect, useRef } from 'react';
import { Card, List, Button, Tooltip } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import TaskModal from '../Modal/task-modal';
import './card.style.scss';

const CustomCard = ({ isSelfTask, name, pools, maxTaskNameLength = 40 }) => {
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
							className="custom-card"
							title={pool.name.toUpperCase()}
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
											isTruncated ? (
												<Tooltip title={taskName}>
													<List.Item
														key={task.id}
														onClick={() => showModal(pool, task)}
														style={{ cursor: 'pointer' }}
													>
														{truncatedName}
													</List.Item>
												</Tooltip>
											) : (
												<List.Item
													key={task.id}
													onClick={() => showModal(pool, task)}
													style={{ cursor: 'pointer' }}
												>
													{taskName}
												</List.Item>
											)
										);
									}}
								/>
							</div>
							<div className="card-footer">
								{pool.name.toUpperCase() !== "MY TASKS" ? (
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
								) : (
									<></>
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
			/>
		</>
	);
};

export default CustomCard;
