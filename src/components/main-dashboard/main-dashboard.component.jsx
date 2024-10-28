import React, { useContext, useMemo, useState, useEffect } from 'react';
import { message, FloatButton, Layout } from 'antd';
import Lottie from 'lottie-react';
import MainCard from '../main-card/main-card.component.jsx';
import CustomCard from '../card/card.component.jsx';
import CustomCreate from '../custom-create/custom-create.jsx';
import './main-dashboard.style.scss';
import { UserContext } from '../../contexts/UserContext';
import { PlusOutlined, MessageOutlined, FontSizeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import loadingAnimation from '../../asset/gif/loading.json';
import ChatBox from '../chatBox/chatBox.component';

const { Content } = Layout;

const MainDashboard = () => {
  const { pools, user, globalSearchTerm, setPools } = useContext(UserContext);
  const [buttonPosition, setButtonPosition] = useState(24);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('jwtToken');
  const navigate = useNavigate();
  const [isChatVisible, setIsChatVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > 50) {
        setButtonPosition(100);
      } else {
        setButtonPosition(50);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    fetchPools();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fetchPools = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('https://route.managewise.top/api/data/DDdata', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch pools');
      }

      const data = await response.json();
      setPools(data);
    } catch (error) {
      console.error('Error fetching pools:', error);
      message.error(error.message || 'An unexpected error occurred');
      setError(error.message);
      if (error.message === 'Unauthorized' || error.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setIsLoading(false);
    }
  }

  const handleAddSelfTask = () => {
    message.success('Add Self Task');
  };

  const handleCreatePool = () => {
    message.success('Create Pool');
    // You can add logic here to open a modal for creating a new pool
  };

  const handleOpenGeminiChatBot = () => {
    setIsChatVisible(true);
  };

  const handleCloseChatBot = () => {
    setIsChatVisible(false);
  };

  // Filter tasks associated with the user from all pools
  // and include the original pool ID for each task
  const userTasks = useMemo(() => pools?.flatMap(pool => 
    pool.tasks
      .filter(task => task.contributor.includes(user._id))
      .map(task => ({ ...task, originalPoolId: pool._id }))
  ) || [], [pools, user._id]);

  // Modify the selfTasksPool to include isSelfTask property
  const selfTasksPool = useMemo(() => ({
    name: 'My Tasks',
    tasks: userTasks,
    isSelfTask: true
  }), [userTasks]);

  // Separate pools based on user involvement
  const { userPools, otherPools } = useMemo(() => {
    const userPools = [];
    const otherPools = [];

    pools?.forEach(pool => {
      if (pool.userIds.includes(user._id) || pool.tasks.some(task => task.contributor.includes(user._id))) {
        userPools.push(pool);
      } else {
        otherPools.push(pool);
      }
    });

    return { userPools, otherPools };
  }, [pools, user._id]);

  // Filter pools and tasks based on global search term
  const filterPools = (poolsToFilter) => {
    return poolsToFilter.map(pool => {
      const poolMatch = pool.name.toLowerCase().includes(globalSearchTerm.toLowerCase());
      const filteredTasks = pool.tasks.filter(task =>
        task.name.toLowerCase().includes(globalSearchTerm.toLowerCase()) ||
        task.description.toLowerCase().includes(globalSearchTerm.toLowerCase())
      );

      return poolMatch ? { ...pool } : { ...pool, tasks: filteredTasks };
    }).filter(pool => pool.name.toLowerCase().includes(globalSearchTerm.toLowerCase()) || pool.tasks.length > 0);
  };

  const filteredUserPools = useMemo(() => filterPools([selfTasksPool, ...userPools]), [selfTasksPool, userPools, globalSearchTerm]);
  const filteredOtherPools = useMemo(() => filterPools(otherPools), [otherPools, globalSearchTerm]);


  const handleOpenModal = () => {
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: loadingAnimation,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <Lottie
          animationData={loadingAnimation}
          loop={true}
          style={{ width: 200, height: 200 }}
        />
      </div>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <Layout className="main-dashboard">
      <Content>
        <h2>My Pools</h2>
        {filteredUserPools.length > 0 ? (
          <MainCard pools={filteredUserPools} />
        ) : (
          <div>No matching pools or tasks found in your pools.</div>
        )}

        <h2>Other Pools</h2>
        {filteredOtherPools.length > 0 ? (
          <CustomCard pools={filteredOtherPools} />
        ) : (
          <div>No matching pools or tasks found in other pools.</div>
        )}

        <FloatButton 
          icon={<MessageOutlined />} 
          tooltip="Gemini ChatBot" 
          onClick={handleOpenGeminiChatBot}
          style={{
            position: 'fixed',
            right: 40,
            bottom: buttonPosition + 50,
            transition: 'bottom 0.3s',
            zIndex: 1000,
          }}
        />

        <FloatButton 
          icon={<PlusOutlined />} 
          tooltip="Create Task" 
          onClick={handleOpenModal}
          style={{
            position: 'fixed',
            right: 40,
            bottom: buttonPosition,
            transition: 'bottom 0.3s',
            zIndex: 1000,
          }}
        />

        <CustomCreate
          isSelfTask={true}
          maxTaskNameLength={40}
          onCancel={handleCloseModal}
          visible={isModalVisible}
        />

        <ChatBox 
          visible={isChatVisible}
          onClose={handleCloseChatBot}
        />
      </Content>
    </Layout>
  );
};

export default MainDashboard;
