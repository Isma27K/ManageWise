import React, { useState, useEffect, useRef } from 'react';
import { List, Button, Tooltip, Card } from 'antd';
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
								dataSource={pool.tasks || []}
								renderItem={(task) => {
									const taskName = task.name || `Task ${task.id}`;
									const truncatedName = truncateText(taskName, truncateLength);
									const isTruncated = truncatedName !== taskName;

									return (
										<List.Item 
											key={task.id}
											onClick={() => showModal(pool, task)}
											className="task-item"
										>
												<Tooltip title={isTruncated ? taskName : ''} mouseEnterDelay={0.3}>
													<span>{truncatedName}</span>
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
