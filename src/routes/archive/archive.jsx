import React, { useState, useEffect } from 'react';
import CustomArchiveCard from './archiveCard/archiveCard.component';
import { notification } from 'antd';

const Archive = () => {
  const [pools, setPools] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArchivePools = async () => {
      const token = localStorage.getItem('jwtToken');

      try {
        const response = await fetch('http://localhost:5000/api/data/archivePool', {
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

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="main-dashboard">
      <h2>Archive Pools</h2>
      {isLoading ? (
        <div>Loading pools...</div>
      ) : pools.length > 0 ? (
        <CustomArchiveCard pools={pools} />
      ) : (
        <div>No archive pools available</div>
      )}
    </div>
  );
};

export default Archive;
