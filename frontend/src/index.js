import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './assets/css/title-bg.css'
import App from './App';

import { TaskContextProvider } from './context/TaskContext';
import { AuthContextProvider } from './context/AuthContext';
import { ProjectContextProvider } from './context/ProjectContext';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthContextProvider>
      <TaskContextProvider>
        <ProjectContextProvider>
          <App />
        </ProjectContextProvider>
      </TaskContextProvider>
    </AuthContextProvider>
  </React.StrictMode>
);
