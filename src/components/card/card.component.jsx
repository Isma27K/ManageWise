import React, { useState } from 'react';
import { Card } from 'antd';
import TaskModal from '../Modal/task-modal';
import './card.style.scss';

const CustomCard = () => {
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [selectedTaskTitle, setSelectedTaskTitle] = useState('');

	const showModal = (title) => {
		setSelectedTaskTitle(title);
		setIsModalVisible(true);
	};

	const handleCancel = () => {
		setIsModalVisible(false);
	};

	const cardData = [
		{title: 'HAL EHWAL PELAJAR'},
		{title: 'HAL EHWAL AKADEMIK'},
		{title: 'HAL EHWAL STAF'},
		{title: 'PENTADBIRAN DAN PENGURUSAN AM'},
		{title: 'HUBUNGAN INDUSTRI DAN GRADUAN'},
		{title: 'HAL EHWAL PENGURUSAN FASILITI'},
	];

	return (
		<>
			<div className="card-container">
				{cardData.map((card, index) => (
					<div key={index} className="card-item">
						<Card  
							className="custom-card"
							title={card.title}
							borderded={false}
							hoverable
							onClick={() => showModal(card.title)}
						/>
					</div>
				))}
			</div>

			<TaskModal 
				visible={isModalVisible}
				onCancel={handleCancel}
				taskTitle={selectedTaskTitle}
			/>
		</>
	);
};

export default CustomCard;
