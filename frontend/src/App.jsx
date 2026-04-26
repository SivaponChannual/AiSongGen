import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import Create from './pages/Create';
import Library from './pages/Library';
import Settings from './pages/Settings';
import Account from './pages/Account';
import Sidebar from './components/Sidebar';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state

  // Initialize theme on app load and listen for system theme changes
  useEffect(() => {
    const applyTheme = () => {
      const savedSettings = localStorage.getItem('userSettings');
      let theme = 'dark'; // Default to dark
      
      if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        theme = settings.theme || 'dark';
      }
      
      // Apply theme
      if (theme === 'system') {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const newTheme = prefersDark ? 'dark' : 'light';
        console.log('Applying system theme:', newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
      } else {
        console.log('Applying user-selected theme:', theme);
        document.documentElement.setAttribute('data-theme', theme);
      }
    };

    // Apply theme initially
    applyTheme();
    console.log('Theme system initialized');

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    console.log('System prefers dark mode:', mediaQuery.matches);
    console.log('Attaching theme change listener...');
    
    const handleChange = (e) => {
      console.log('🎨 OS theme changed! New preference:', e.matches ? 'dark' : 'light');
      const savedSettings = localStorage.getItem('userSettings');
      if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        console.log('User theme setting:', settings.theme);
        // Only react to system changes if user has selected 'system' theme
        if (settings.theme === 'system') {
          console.log('✅ Applying system theme...');
          applyTheme();
        } else {
          console.log('⏭️ Skipping - user has explicit theme selected');
        }
      }
    };

    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      console.log('✅ Theme listener attached successfully');
    } else {
      // Fallback for older browsers
      mediaQuery.addListener(handleChange);
      console.log('✅ Theme listener attached (legacy method)');
    }

    // Cleanup
    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleChange);
      } else {
        mediaQuery.removeListener(handleChange);
      }
      console.log('🧹 Theme listener cleaned up');
    };
  }, []);

  // Check local storage on load
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false); // Done loading
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  // Don't render routes until we've checked localStorage
  if (loading) {
    return null; // Or a loading spinner
  }

  return (
    <Router>
      <div className="app-layout">
        {user && <Sidebar user={user} onLogout={handleLogout} />}
        
        <main className={`main-content ${!user ? 'full-width' : ''}`}>
          <Routes>
            <Route 
              path="/" 
              element={user ? <Navigate to="/home" replace /> : <Login onLogin={handleLogin} />} 
            />
            <Route 
              path="/home" 
              element={user ? <Home /> : <Navigate to="/" replace />} 
            />
            <Route 
              path="/create" 
              element={user ? <Create /> : <Navigate to="/" replace />} 
            />
            <Route 
              path="/library" 
              element={user ? <Library /> : <Navigate to="/" replace />} 
            />
            <Route 
              path="/settings" 
              element={user ? <Settings /> : <Navigate to="/" replace />} 
            />
            <Route 
              path="/account" 
              element={user ? <Account onLogout={handleLogout} /> : <Navigate to="/" replace />} 
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
