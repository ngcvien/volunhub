import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom'; // Đảm bảo import Router
import AppRoutes from './routes';
import { AuthProvider } from './contexts/AuthContext';
import './App.css';

function App() {
  return (
    <Router> {/* Bọc toàn bộ ứng dụng trong Router */}
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;