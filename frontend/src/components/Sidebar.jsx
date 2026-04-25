import React from 'react';
import { NavLink } from 'react-router-dom';
import { Settings, LogOut, AudioLines, Flame, Layers } from 'lucide-react';
import './Sidebar.css';

const Sidebar = ({ user, onLogout }) => {
  return (
    <aside className="sidebar glass-panel">
      <div className="sidebar-brand">
        <div className="brand-logo-box">
          <AudioLines size={24} color="#fff" />
        </div>
        <div className="brand-text-container">
          <span className="brand-name">Sonic <span className="text-purple">|</span></span>
          <span className="brand-sub">AI Music</span>
        </div>
      </div>
      
      <nav className="sidebar-links">
        <NavLink to="/forge" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
          <Flame size={18} /> The Forge
        </NavLink>
        <NavLink to="/library" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
          <Layers size={18} /> Library
        </NavLink>
      </nav>

      <div className="sidebar-bottom">
        <div className="user-profile">
          <div className="user-avatar">{user?.user_email?.charAt(0).toUpperCase() || 'A'}</div>
          <span className="user-email">{user?.user_email}</span>
        </div>
        
        <div className="sidebar-actions">
          <button className="icon-btn" title="Settings">
            <Settings size={20} />
          </button>
          <button className="icon-btn logout-btn" onClick={onLogout} title="Logout">
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
