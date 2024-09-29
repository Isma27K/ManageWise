import React, { useContext } from 'react';
import CustomCard from '../card/card.component.jsx';
import './main-dashboard.style.scss';
import { UserContext } from '../../contexts/UserContext';


const MainDashboard = () => {
  const { pools } = useContext(UserContext);
  return (
    <div className="main-dashboard">
      <h2>Available Pool</h2>
      <CustomCard pools={pools} />
    </div>
  );
};

export default MainDashboard;
