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
							{/*pool.tasks && pool.tasks.length === 0 && (
								<p>No tasks in this pool</p>
							)*/}
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
