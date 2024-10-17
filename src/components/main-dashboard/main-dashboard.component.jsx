import React, { useContext } from 'react';
import CustomCard from '../card/card.component.jsx';
import './main-dashboard.style.scss';
import { UserContext } from '../../contexts/UserContext';

const MainDashboard = () => {
  const { pools, user } = useContext(UserContext);

  // Filter tasks associated with the user from all pools
  // and include the original pool ID for each task
  const userTasks = pools?.flatMap(pool => 
    pool.tasks
      .filter(task => task.contributor.includes(user._id))
      .map(task => ({ ...task, originalPoolId: pool._id }))
  ) || [];

  // Create a "pool" for self-appointed tasks
  const selfTasksPool = {
    _id: 'self-tasks',
    name: 'My Tasks',
    tasks: userTasks,
    isSelfTask: true
  };

  console.log("selfTasksPool tasks:", selfTasksPool.tasks);

  // Combine self-tasks with other pools
  const allPools = [selfTasksPool, ...(pools || [])];

  return (
    <div className="main-dashboard">
      <h2>Available Pools</h2>
      {allPools.length > 0 ? (
        <CustomCard pools={allPools} />
      ) : (
        <div>Loading pools...</div>
      )}
    </div>
  );
};

export default MainDashboard;
