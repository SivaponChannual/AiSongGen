import React from 'react';
import { NavLink } from 'react-router-dom';
import { Settings, LogOut, Disc3 } from 'lucide-react';
import './TopNav.css';

const TopNav = ({ user, onLogout }) => {
  return (
    <header className="topnav glass-panel">
      <div className="topnav-brand">
        <Disc3 className="brand-icon" />
        <span className="brand-text text-gradient">Sonic Architect <span className="pro-badge">PRO</span></span>
      </div>
      
      <nav className="topnav-links">
        <NavLink to="/forge" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
          The Forge
        </NavLink>
        <NavLink to="/library" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
          Library
        </NavLink>
      </nav>

      <div className="topnav-user">
        <div className="user-profile">
          <span className="user-email">{user?.user_email}</span>
        </div>
        <button className="icon-btn" title="Settings">
          <Settings size={20} />
        </button>
        <button className="icon-btn logout-btn" onClick={onLogout} title="Logout">
          <LogOut size={20} />
        </button>
      </div>
    </header>
  );
};

export default TopNav;
