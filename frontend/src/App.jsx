import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Forge from './pages/Forge';
import Library from './pages/Library';
import Sidebar from './components/Sidebar';

function App() {
  const [user, setUser] = useState(null);

  // Check local storage on load
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <Router>
      <div className="app-layout">
        {user && <Sidebar user={user} onLogout={handleLogout} />}
        
        <main className={`main-content ${!user ? 'full-width' : ''}`}>
          <Routes>
            <Route 
              path="/" 
              element={user ? <Navigate to="/create" /> : <Login onLogin={handleLogin} />} 
            />
            <Route 
              path="/create" 
              element={user ? <Forge /> : <Navigate to="/" />} 
            />
            <Route 
              path="/home" 
              element={user ? <Navigate to="/create" /> : <Navigate to="/" />} 
            />
            <Route 
              path="/library" 
              element={user ? <Library /> : <Navigate to="/" />} 
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
