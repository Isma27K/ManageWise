import React, { useContext, useMemo } from 'react';
import { message } from 'antd';
import MainCard from '../main-card/main-card.component.jsx';
import CustomCard from '../card/card.component.jsx';
import './main-dashboard.style.scss';
import { UserContext } from '../../contexts/UserContext';

const MainDashboard = () => {
  const { pools, user, globalSearchTerm } = useContext(UserContext);

  const handleAddSelfTask = () => {
    message.success('Add Self Task');
  };

  const handleCreatePool = () => {
    message.success('Create Pool');
    // You can add logic here to open a modal for creating a new pool
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

  return (
    <div className="main-dashboard">
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
    </div>
  );
};

export default MainDashboard;
