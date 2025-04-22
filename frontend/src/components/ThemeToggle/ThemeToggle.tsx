import React from 'react';
import { Button } from 'react-bootstrap';
import { SunFill, MoonFill } from 'react-bootstrap-icons'; // Import icons
import { useAuth } from '../../contexts/AuthContext'; // Lấy theme và toggle từ context
import './ThemeToggle.css'; // Import CSS để tạo kiểu floating

const ThemeToggle = () => {
    const { theme, toggleTheme } = useAuth();

    return (
        <Button
            variant={theme === 'dark' ? 'outline-light' : 'outline-dark'} // Đổi màu nút theo theme
            onClick={toggleTheme}
            className="theme-toggle-button" // Class CSS để định vị
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
            {theme === 'dark' ? <SunFill size={20} /> : <MoonFill size={20} />} {/* Hiển thị icon phù hợp */}
        </Button>
    );
};

export default ThemeToggle;