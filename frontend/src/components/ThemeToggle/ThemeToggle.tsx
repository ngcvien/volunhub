import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Sun, Moon } from 'react-bootstrap-icons';
import './ThemeToggle.css';
const   ThemeToggle = () => {
    const { theme, toggleTheme } = useAuth();

    return (
    <div className="theme-toggle-wrapper">
      <button 
        className={`theme-toggle-btn ${theme}`} 
            onClick={toggleTheme}
        aria-label="Toggle theme"
        >
        <div className="theme-toggle-icons">
          <Sun className="sun-icon" />
          <Moon className="moon-icon" />
        </div>
        <div className="theme-toggle-ball"></div>
      </button>
    </div>
    );
};

export default ThemeToggle;