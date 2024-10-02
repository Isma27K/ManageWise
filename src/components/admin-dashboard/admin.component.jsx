import React, { useState, useEffect, useContext } from 'react';
import { Tabs, message } from 'antd';
import InvitationTab from './tabs/InvitationTab';
import UserManagementTab from './tabs/UserManagementTab';
import PoolManagementTab from './tabs/PoolManagementTab';
import DeleteOperationsTab from './tabs/DeleteOperationsTab';
import { dummyUsers, dummyRoles } from './dummyData';
import { UserContext } from '../../contexts/UserContext';

import './admin.style.scss';

const { TabPane } = Tabs;

// Set this to false when you want to use real API data
const USE_DUMMY_DATA = false;

const AdminDashboard = () => {
  const { allUsers } = useContext(UserContext);
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  //const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (USE_DUMMY_DATA) {
        setUsers(dummyUsers);
        setRoles(dummyRoles);
        //setLoading(false);
      } else {
        try {          
          setUsers(allUsers);
          setRoles(dummyRoles);
        } catch (error) {
          console.error('Error fetching data:', error);
          message.error(error.message || 'Failed to fetch data from the API. Please try again later.');
          setUsers([]);
          setRoles([]);
        } finally {
          //setLoading(false);
        }
      }
    };

    fetchData();
  }, []);

  //if (loading) {
  //  return <div>Loading...</div>;
  //}

  return (
    <div className="admin-dashboard">
      <h2>ADMIN DASHBOARD</h2>
      {USE_DUMMY_DATA && (
        <div style={{ color: 'red', marginBottom: '10px' }}>
          Using dummy data. Set USE_DUMMY_DATA to false to use real API.
        </div>
      )}
      {/*{!USE_DUMMY_DATA && users.length === 0 && (
        <div style={{ color: 'red', marginBottom: '10px' }}>
          Failed to load data from API. Please check your connection and try again.
        </div>
      )}*/}
      <Tabs defaultActiveKey="1" className="admin-tabs">
        <TabPane tab="Invitation" key="1">
          <InvitationTab />
        </TabPane>
        <TabPane tab="User Management" key="2">
          <UserManagementTab users={users} roles={roles} />
        </TabPane>
        <TabPane tab="Pool Management" key="3">
          <PoolManagementTab users={users} />
        </TabPane>
        <TabPane tab="Delete Operations" key="4">
          <DeleteOperationsTab users={users} />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;