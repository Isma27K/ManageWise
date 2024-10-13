import React, { useContext } from 'react';
import CustomCard from '../card/card.component.jsx';
import './main-dashboard.style.scss';
import { UserContext } from '../../contexts/UserContext';

const MainDashboard = () => {
  const { pools, user } = useContext(UserContext);

  // Create a "pool" for self-appointed tasks
  const selfTasksPool = user && user.tasks ? {
    _id: 'self-tasks',
    name: 'My Tasks',
    tasks: user.tasks,
    isSelfTask: true  // Add this flag
  } : null;

  // Combine self-tasks with other pools
  const allPools = selfTasksPool ? [selfTasksPool, ...(pools || [])] : pools;

  return (
    <div className="main-dashboard">
      <h2>Available Pools</h2>
      {allPools ? (
        <CustomCard pools={allPools} />
      ) : (
        <div>Loading pools...</div>
      )}
    </div>
  );
};

export default MainDashboard;
