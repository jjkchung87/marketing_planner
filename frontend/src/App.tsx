import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainNavBar from './components/MainNavBar';
import Drawer from './components/Drawer';
import './App.css';
import Campaign from './pages/campaign-manager/CampaignManager';
import CampaignManager from './pages/campaign-manager/CampaignManager';

const App: React.FC = () => {
  return (
    <div className="App">
      <Drawer />
      <Routes>
        <Route path="/campaigns" element={<CampaignManager />} />
        <Route path="/campaigns/:id" element={<Campaign />} />
      </Routes>
    </div>
  );
};

export default App;
