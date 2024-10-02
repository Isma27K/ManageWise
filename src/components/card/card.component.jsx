import React, { useState } from 'react';
import { Card, List } from 'antd';
import TaskModal from '../Modal/task-modal';
import './card.style.scss';

const CustomCard = ({ pools }) => {
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [selectedPool, setSelectedPool] = useState(null);

	const showModal = (pool) => {
		setSelectedPool(pool);
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
							onClick={() => showModal(pool)}
						>
							<List
								size="small"
								dataSource={pool.tasks || []}
								renderItem={(task, taskIndex) => (
									<List.Item key={taskIndex}>
										{task.name || `Task ${taskIndex + 1}`}
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
			/>
		</>
	);
};

export default CustomCard;
