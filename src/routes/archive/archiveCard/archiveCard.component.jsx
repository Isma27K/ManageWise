import React, { useState, useEffect, useRef } from 'react';
import { Card, List, Button, Tooltip } from 'antd';
import ArchiveModal from '../archiveModal/archiveModal';
import './archiveCard.style.scss';

const CustomArchiveCard = ({ isSelfTask, name, pools, maxTaskNameLength = 40, onUnarchive }) => {
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
								{pool.tasks && pool.tasks.length > 0 ? (
									<List
										size="small"
										dataSource={pool.tasks}
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
								) : (
									<div>No tasks in this pool match the search criteria</div>
								)}
							</div>
						</Card>
					</div>
				))}
			</div>

			<ArchiveModal
				visible={isModalVisible}
				onCancel={handleCancel}
				pool={selectedPool}
				task={selectedTask}
				isEditable={!selectedTask}
				maxTaskNameLength={maxTaskNameLength}
				isSelfTask={selectedPool?.isSelfTask}
				onUnarchive={onUnarchive}
			/>
		</>
	);
};

export default CustomArchiveCard;
