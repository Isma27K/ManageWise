import React, { useState, useEffect, useContext, useMemo } from 'react';
import CustomArchiveCard from './archiveCard/archiveCard.component';
import { notification } from 'antd';
import { UserContext } from '../../contexts/UserContext';

const Archive = () => {
  const [pools, setPools] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { globalSearchTerm } = useContext(UserContext);

  useEffect(() => {
    const fetchArchivePools = async () => {
      const token = localStorage.getItem('jwtToken');

      try {
        const response = await fetch('https://isapi.ratacode.top/api/data/archivePool', {
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
        setIsLoading(false);
      } catch (error) {
        notification.error({
          message: 'Error',
          description: 'Failed to fetch archive pools',
        });
        setIsLoading(false);
      }
    };

    fetchArchivePools();
  }, []);

  const handleUnarchive = (taskId) => {
    setPools(prevPools => prevPools.map(pool => ({
      ...pool,
      tasks: pool.tasks.filter(task => task.id !== taskId)
    })));
  };

  const filteredPools = useMemo(() => {
    return pools
      .map(pool => ({
        ...pool,
        tasks: pool.tasks.filter(task =>
          task.isArchived === true &&
          (task.name.toLowerCase().includes(globalSearchTerm.toLowerCase()) ||
          task.description.toLowerCase().includes(globalSearchTerm.toLowerCase()))
        )
      }))
      .filter(pool =>
        pool.tasks.length > 0 &&
        (pool.name.toLowerCase().includes(globalSearchTerm.toLowerCase()) ||
        pool.tasks.length > 0)
      );
  }, [pools, globalSearchTerm]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="main-dashboard">
      <h2>Archive Pools</h2>
      {isLoading ? (
        <div>Loading pools...</div>
      ) : filteredPools.length > 0 ? (
        <CustomArchiveCard pools={filteredPools} onUnarchive={handleUnarchive} />
      ) : (
        <div>No matching archive pools available</div>
      )}
    </div>
  );
};

export default Archive;
