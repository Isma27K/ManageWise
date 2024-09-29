import React from 'react';
import CustomCard from '../card/card.component.jsx';
import './main-dashboard.style.scss';

const MainDashboard = () => {
  return (
    <div className="main-dashboard">
      <h2>Available Pool</h2>
      <CustomCard />
    </div>
  );
};

export default MainDashboard;
