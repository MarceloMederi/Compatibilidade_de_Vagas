import React from 'react';
import TriageForm from './components/TriageForm';
import Front_logo from '/logo/Front_logo.png';
import './App.css';

const App = () => {
  return (
    <div className="app-container">
      <div className="logo-container">
        <img src={Front_logo} alt="Logo do projeto Recruiter.IA" />
      </div>
      <TriageForm />
    </div>
  );
};

export default App;
