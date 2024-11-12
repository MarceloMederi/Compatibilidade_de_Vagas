import React from 'react';
import TriageForm from './components/TriageForm';
import Front_logo from '../public/logo/Front_logo.png'


const App = () => {
  return (
    <div>
      <div>
        <img src={Front_logo} alt="Arquivo da logo do projeto escrito 'RECRUITER.IA'"/>
      </div>
      <TriageForm />
    </div>
  );
};

export default App;
