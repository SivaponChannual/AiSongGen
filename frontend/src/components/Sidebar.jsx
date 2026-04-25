import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Home, PlusCircle, Library, Settings, User, ChevronLeft, ChevronRight } from 'lucide-react';
import './Sidebar.css';

const Sidebar = ({ user, onLogout }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <aside className={`sidebar ${isExpanded ? 'expanded' : 'collapsed'}`}>
      <button 
        className="toggle-sidebar-btn" 
        onClick={() => setIsExpanded(!isExpanded)}
        title={isExpanded ? "Collapse Sidebar" : "Expand Sidebar"}
      >
        {isExpanded ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
      </button>

      <div className="sidebar-brand">
        <div className="brand-avatar-box">
          <img 
            src="https://api.dicebear.com/9.x/avataaars/svg?seed=Felix&backgroundColor=242424" 
            alt="Avatar" 
            className="brand-avatar-img"
          />
        </div>
        {isExpanded && (
          <div className="brand-text-container">
            <span className="brand-name">Sonic</span>
            <span className="brand-sub">Pro Creator</span>
          </div>
        )}
      </div>
      
      <nav className="sidebar-links">
        <NavLink to="/home" className={({isActive}) => isActive ? "nav-link active" : "nav-link"} title="Home">
          <Home size={20} /> 
          {isExpanded && <span className="link-text">Home</span>}
        </NavLink>
        <NavLink to="/forge" className={({isActive}) => isActive ? "nav-link active" : "nav-link"} title="Create">
          <PlusCircle size={20} /> 
          {isExpanded && <span className="link-text">Create</span>}
        </NavLink>
        <NavLink to="/library" className={({isActive}) => isActive ? "nav-link active" : "nav-link"} title="Library">
          <Library size={20} /> 
          {isExpanded && <span className="link-text">Library</span>}
        </NavLink>
      </nav>

      <div className="sidebar-bottom">
        <nav className="sidebar-links bottom-links">
          <button className="nav-link nav-button" title="Settings">
            <Settings size={20} />
            {isExpanded && <span className="link-text">Settings</span>}
          </button>
          <button className="nav-link nav-button" onClick={onLogout} title="Account">
            <User size={20} />
            {isExpanded && <span className="link-text">Account</span>}
          </button>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
