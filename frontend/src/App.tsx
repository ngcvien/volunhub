import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './routes';
import { AuthProvider } from './contexts/AuthContext';
import ThemeToggle from './components/ThemeToggle/ThemeToggle';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
        <ThemeToggle /> {/* <<<--- ĐẶT NÚT Ở ĐÂY */}
      </Router>
    </AuthProvider>
  );
}

export default App;