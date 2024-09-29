import React from 'react';
import CustomCard from '../card/card.component.jsx';
import './main-dashboard.style.scss';

const MainDashboard = () => {
  const cardsData = [
    {
      id: 1,
      image: 'https://picsum.photos/300',
      title: 'UPLI',
      description: 'Unified Platform for Learning and Innovation',
      task: {
        1: { 
          name: "Task 1", 
          attachments: [
            { name: "document1.pdf", url: "https://example.com/document1.pdf" },
            { name: "image1.jpg", url: "https://example.com/image1.jpg" }
          ]
        },
        2: { 
          name: "Task 2", 
          attachments: [
            { name: "spreadsheet1.xlsx", url: "https://example.com/spreadsheet1.xlsx" }
          ]
        },
        3: { name: "Task 3", attachments: [] },
        4: { name: "Task 4", attachments: [] },
      },
      contributors: [
        { id: 1, name: "John Doe", avatar: "https://xsgames.co/randomusers/avatar.php?g=pixel&key=1" },
        { id: 2, name: "Jane Smith", avatar: "https://xsgames.co/randomusers/avatar.php?g=pixel&key=2" },
      ]
    },
    {
      id: 2,
      image: 'https://picsum.photos/300',
      title: 'Software',
      description: 'Software Development Projects',
      task: {
        1: { 
          name: "Develop API", 
          attachments: [
            { name: "api_spec.doc", url: "https://example.com/api_spec.doc" },
            { name: "database_schema.sql", url: "https://example.com/database_schema.sql" }
          ]
        },
        2: { 
          name: "UI Design", 
          attachments: [
            { name: "mockup.fig", url: "https://example.com/mockup.fig" }
          ]
        },
        3: { name: "Testing", attachments: [] },
        4: { name: "Deployment", attachments: [] },
      },
      contributors: [
        { id: 3, name: "Bob Johnson", avatar: "https://xsgames.co/randomusers/avatar.php?g=pixel&key=3" },
        { id: 4, name: "Alice Brown", avatar: "https://xsgames.co/randomusers/avatar.php?g=pixel&key=4" },
        { id: 5, name: "Charlie Davis", avatar: "https://xsgames.co/randomusers/avatar.php?g=pixel&key=5" },
      ]
    },
    {
      id: 3,
      image: 'https://picsum.photos/300',
      title: 'HEP',
      description: 'High Energy Physics Research',
      task: {
        1: { 
          name: "Data Analysis", 
          attachments: [
            { name: "dataset.csv", url: "https://example.com/dataset.csv" },
            { name: "analysis_script.py", url: "https://example.com/analysis_script.py" }
          ]
        },
        2: { 
          name: "Simulation", 
          attachments: [
            { name: "simulation_config.json", url: "https://example.com/simulation_config.json" }
          ]
        },
        3: { name: "Paper Writing", attachments: [] },
        4: { name: "Conference Presentation", attachments: [] },
      },
      contributors: [
        { id: 6, name: "Eva Wilson", avatar: "https://xsgames.co/randomusers/avatar.php?g=pixel&key=6" },
        { id: 7, name: "Frank Thomas", avatar: "https://xsgames.co/randomusers/avatar.php?g=pixel&key=7" },
      ]
    },
    {
      id: 4,
      image: 'https://picsum.photos/300',
      title: 'TBD',
      description: 'To be decided',
      task: {
        1: { 
          name: "Data Analysis", 
          attachments: [
            { name: "dataset.csv", url: "https://example.com/dataset.csv" },
            { name: "analysis_script.py", url: "https://example.com/analysis_script.py" }
          ]
        },
        2: { 
          name: "Simulation", 
          attachments: [
            { name: "simulation_config.json", url: "https://example.com/simulation_config.json" }
          ]
        },
        3: { name: "Paper Writing", attachments: [] },
        4: { name: "Conference Presentation", attachments: [] },
      },
      contributors: [
        { id: 6, name: "Eva Wilson", avatar: "https://xsgames.co/randomusers/avatar.php?g=pixel&key=6" },
        { id: 7, name: "Frank Thomas", avatar: "https://xsgames.co/randomusers/avatar.php?g=pixel&key=7" },
      ]
    },
    {
      id: 5,
      image: 'https://picsum.photos/300',
      title: 'MURNI',
      description: 'Murni',
      task: {
        1: { 
          name: "Data Analysis", 
          attachments: [
            { name: "dataset.csv", url: "https://example.com/dataset.csv" },
            { name: "analysis_script.py", url: "https://example.com/analysis_script.py" }
          ]
        },
        2: { 
          name: "Simulation", 
          attachments: [
            { name: "simulation_config.json", url: "https://example.com/simulation_config.json" }
          ]
        },
        3: { name: "Paper Writing", attachments: [] },
        4: { name: "Conference Presentation", attachments: [] },
      },
      contributors: [
        { id: 6, name: "Eva Wilson", avatar: "https://xsgames.co/randomusers/avatar.php?g=pixel&key=6" },
        { id: 7, name: "Frank Thomas", avatar: "https://xsgames.co/randomusers/avatar.php?g=pixel&key=7" },
      ]
    },
    // ... (You can add more cards following the same structure)
  ];

  return (
    <>
      <div>
        <h2>Available Pool</h2>
      </div>
      <div className="card-container">
        {cardsData.map((card) => (
          <div key={card.id} className="card-item">
            <CustomCard {...card} />
          </div>
        ))}
      </div>
    </>
  );
};

export default MainDashboard;
