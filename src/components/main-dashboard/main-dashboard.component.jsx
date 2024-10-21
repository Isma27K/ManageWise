import React, { useContext, useState, useMemo } from 'react';
import { Input, Select, FloatButton, message } from 'antd';
import { PlusOutlined, FolderOutlined, FolderOpenOutlined } from '@ant-design/icons';
import CustomCard from '../card/card.component.jsx';
import './main-dashboard.style.scss';
import { UserContext } from '../../contexts/UserContext';

const { Option } = Select;

const MainDashboard = () => {
  const { pools, user, globalSearchTerm, setGlobalSearchTerm } = useContext(UserContext);
  const [searchType, setSearchType] = useState('both');

  const handleAddSelfTask = () => {
    message.success('Add Self Task');
  };

  const handleCreatePool = () => {
    message.success('self task');
    // You can add logic here to open a modal for creating a new pool
  };

  // Filter tasks associated with the user from all pools
  // and include the original pool ID for each task
  const userTasks = useMemo(() => pools?.flatMap(pool => 
    pool.tasks
      .filter(task => task.contributor.includes(user._id))
      .map(task => ({ ...task, originalPoolId: pool._id }))
  ) || [], [pools, user._id]);

  // Create a "pool" for self-appointed tasks
  const selfTasksPool = useMemo(() => ({
    name: 'My Tasks',
    tasks: userTasks,
    isSelfTask: true
  }), [userTasks]);

  // Combine self-tasks with other pools
  const allPools = useMemo(() => [selfTasksPool, ...(pools || [])], [selfTasksPool, pools]);

  // Filter pools and tasks based on global search term and search type
  const filteredPools = useMemo(() => {
    return allPools.map(pool => {
      const poolMatch = pool.name.toLowerCase().includes(globalSearchTerm.toLowerCase());
      const filteredTasks = pool.tasks.filter(task =>
        task.name.toLowerCase().includes(globalSearchTerm.toLowerCase()) ||
        task.description.toLowerCase().includes(globalSearchTerm.toLowerCase())
      );

      if (searchType === 'pool' && poolMatch) {
        return { ...pool };
      } else if (searchType === 'task') {
        return { ...pool, tasks: filteredTasks };
      } else { // 'both'
        return poolMatch ? { ...pool } : { ...pool, tasks: filteredTasks };
      }
    }).filter(pool => pool.name.toLowerCase().includes(globalSearchTerm.toLowerCase()) || pool.tasks.length > 0);
  }, [allPools, globalSearchTerm, searchType]);

  return (
    <div className="main-dashboard">
      <h2>Available Pools</h2>
      {filteredPools.length > 0 ? (
        <CustomCard pools={filteredPools} />
      ) : (
        <div>No matching pools or tasks found.</div>
      )}

      <FloatButton.Group
        shape="circle"
        style={{
          insetInlineEnd: 24,
          right: 40,
        }}
      >
        <FloatButton icon={<FolderOutlined />} tooltip="self task" onClick={handleCreatePool}/>
        <FloatButton icon={<PlusOutlined />} tooltip="Add Self task" onClick={handleAddSelfTask}/>
        <FloatButton.BackTop visibilityHeight={0} tooltip="Back to top"/>
      </FloatButton.Group>

    </div>
  );
};

export default MainDashboard;
