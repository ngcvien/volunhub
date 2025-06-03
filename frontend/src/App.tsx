import React, {useState} from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './routes';
import { AuthProvider } from './contexts/AuthContext';
import ThemeToggle from './components/ThemeToggle/ThemeToggle';
import './App.css';
import ChatDashboard from './components/Chat/ChatDashboard'; 
import { Button } from 'react-bootstrap'; 
import { ChatDotsFill } from 'react-bootstrap-icons';

function App() {
    const [showChat, setShowChat] = useState(false); // State quản lý hiển thị chat

  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
        <ThemeToggle /> 
        <Button
          variant="primary"
          onClick={() => setShowChat(true)}
          className="chat-fab-button position-fixed shadow" 
          style={{ bottom: '20px', right: '20px', zIndex: 1040, borderRadius: '50%', width: '60px', height: '60px'}}
        >
          <ChatDotsFill size={24} />
        </Button>

        <ChatDashboard show={showChat} onHide={() => setShowChat(false)} />
      </Router>
    </AuthProvider>
  );
}

export default App;