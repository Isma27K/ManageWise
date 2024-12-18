import React, { useState, useEffect, useContext, useMemo } from 'react';
import CustomArchiveCard from './archiveCard/archiveCard.component';
import { notification, Layout } from 'antd';
import { UserContext } from '../../contexts/UserContext';
import Lottie from 'lottie-react';
import loadingAnimation from '../../asset/gif/loading.json';
import './archive.style.scss';

const { Content } = Layout;

const Archive = () => {
  const [pools, setPools] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { globalSearchTerm } = useContext(UserContext);

  useEffect(() => {
    const fetchArchivePools = async () => {
      const token = localStorage.getItem('jwtToken');

      try {
        const response = await fetch('https://route.managewise.top/api/data/archivePool', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch archive pools');
        }

        const data = await response.json();
        setPools(data);
      } catch (error) {
        notification.error({
          message: 'Error',
          description: 'Failed to fetch archive pools',
        });
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArchivePools();
  }, []);

  const handleUnarchive = async (taskId) => {
    // Instead of directly modifying the state, let's fetch the updated data
    const token = localStorage.getItem('jwtToken');
    
    try {
      const response = await fetch('https://route.managewise.top/api/data/archivePool', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch archive pools');
      }

      const data = await response.json();
      setPools(data);
    } catch (error) {
      notification.error({
        message: 'Error',
        description: 'Failed to update archive pools',
      });
    }
  };

  const filteredPools = useMemo(() => {
    return pools
      .map(pool => {
        // Check if pool name matches search term
        const poolMatch = pool.name.toLowerCase().includes(globalSearchTerm.toLowerCase());
        
        // Filter archived tasks that match search term
        const filteredTasks = pool.tasks.filter(task =>
          task.isArchived === true && (
            task.name.toLowerCase().includes(globalSearchTerm.toLowerCase()) ||
            task.description.toLowerCase().includes(globalSearchTerm.toLowerCase())
          )
        );

        // Return pool with either all tasks (if pool name matches) or filtered tasks
        return poolMatch 
          ? { ...pool, tasks: pool.tasks.filter(task => task.isArchived === true) }
          : { ...pool, tasks: filteredTasks };
      })
      .filter(pool => 
        // Only keep pools that have archived tasks
        pool.tasks.length > 0
      );
  }, [pools, globalSearchTerm]);

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
    <Layout className="archive-container">
      <Content>
        <h2>Archive Pools</h2>
        {filteredPools.length > 0 ? (
          <CustomArchiveCard pools={filteredPools} onUnarchive={handleUnarchive} />
        ) : (
          <div>No matching archive pools available</div>
        )}
      </Content>
    </Layout>
  );
};

export default Archive;
