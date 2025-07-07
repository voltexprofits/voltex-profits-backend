
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import AuthApp from './AuthApp';

// Add spinner animation styles
const style = document.createElement('style');
style.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
document.head.appendChild(style);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthApp />
  </React.StrictMode>
);