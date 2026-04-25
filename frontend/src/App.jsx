import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Forge from './pages/Forge';
import Library from './pages/Library';
import TopNav from './components/TopNav';

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
      <div className="app-wrapper">
        {user && <TopNav user={user} onLogout={handleLogout} />}
        
        <main className="main-content">
          <Routes>
            <Route 
              path="/" 
              element={user ? <Navigate to="/forge" /> : <Login onLogin={handleLogin} />} 
            />
            <Route 
              path="/forge" 
              element={user ? <Forge /> : <Navigate to="/" />} 
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
