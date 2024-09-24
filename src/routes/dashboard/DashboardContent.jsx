import React, {useState} from 'react';
import { Card } from 'antd';
import TaskModal from '../../components/Modal/task-modal';

const DashboardContent = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedTaskTitle, setSelectedTaskTitle] = useState('');

    const showModal = (title) => {
        setSelectedTaskTitle(title);
        setIsModalVisible(true);
    };

    const handleCanel = () => {
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
            <div style={{display: 'flex', padding: '20px 20px', flexWrap: 'wrap', gap: '20px',}}>
                {cardData.map((card, index) => (
                    <Card  
                        key={index}
                        title={card.title}
                        bordered = {false}
                        hoverable
                        onClick={() => showModal(card.title)}
                        style={{ width: '100%', height: 300, maxWidth: 500,}}
                        headStyle={{backgroundColor: '#8c8c8c'}}>
                    </Card>
                ))}
            </div>

            <TaskModal 
                visible={isModalVisible}
                onCancel={handleCanel}
                taskTitle={selectedTaskTitle}
            />
        </>
    );
};

export default DashboardContent;
