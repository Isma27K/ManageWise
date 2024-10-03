import React, { useState } from 'react';
import { Card, List } from 'antd';
import TaskModal from '../Modal/task-modal';
import './card.style.scss';

const CustomCard = ({ pools }) => {
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [selectedPool, setSelectedPool] = useState(null);
	const [selectedTask, setSelectedTask] = useState(null);

	const showModal = (pool, task) => {
		setSelectedPool(pool);
		setSelectedTask(task);
		setIsModalVisible(true);
	};

	const handleCancel = () => {
		setIsModalVisible(false);
	};

	// Add a check for pools being null or undefined
	if (!pools || pools.length === 0) {
		return <div>No pools available</div>;
	}

	return (
		<>
			<div className="card-container">
				{pools.map((pool, index) => (
					<div key={index} className="card-item">
						<Card
							className="custom-card"
							title={pool.name}
							bordered={false}
							hoverable
						>
							<List
								size="small"
								dataSource={pool.tasks || []}
								renderItem={(task) => (
									<List.Item
										key={task.id}
										onClick={() => showModal(pool, task)}
										style={{ cursor: 'pointer' }}
									>
										{task.name || `Task ${task.id}`}
									</List.Item>
								)}
							/>
						</Card>
					</div>
				))}
			</div>

			<TaskModal
				visible={isModalVisible}
				onCancel={handleCancel}
				pool={selectedPool}
				task={selectedTask}
			/>
		</>
	);
};

export default CustomCard;
