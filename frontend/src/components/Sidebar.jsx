import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Home, PlusCircle, Library, Settings, User, Disc3, LogOut } from 'lucide-react';
import './Sidebar.css';

const Sidebar = ({ user, onLogout }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <aside 
      className={`sidebar ${isExpanded ? 'expanded' : 'collapsed'}`}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <div className="sidebar-brand">
        <div className="brand-logo-box">
          <Disc3 size={24} color="#fff" />
        </div>
        <div className={`brand-text-container ${isExpanded ? 'visible' : 'hidden'}`}>
          <span className="brand-name">Sonic</span>
          <span className="brand-sub">Pro Creator</span>
        </div>
      </div>
      
      <nav className="sidebar-links">
        <NavLink to="/home" className={({isActive}) => isActive ? "nav-link active" : "nav-link"} title="Home">
          <Home size={20} /> 
          <span className={`link-text ${isExpanded ? 'visible' : 'hidden'}`}>Home</span>
        </NavLink>
        <NavLink to="/create" className={({isActive}) => isActive ? "nav-link active" : "nav-link"} title="Create">
          <PlusCircle size={20} /> 
          <span className={`link-text ${isExpanded ? 'visible' : 'hidden'}`}>Create</span>
        </NavLink>
        <NavLink to="/library" className={({isActive}) => isActive ? "nav-link active" : "nav-link"} title="Library">
          <Library size={20} /> 
          <span className={`link-text ${isExpanded ? 'visible' : 'hidden'}`}>Library</span>
        </NavLink>
      </nav>

      <div className="sidebar-bottom">
        <nav className="sidebar-links bottom-links">
          <NavLink to="/settings" className={({isActive}) => isActive ? "nav-link active" : "nav-link"} title="Settings">
            <Settings size={20} />
            <span className={`link-text ${isExpanded ? 'visible' : 'hidden'}`}>Settings</span>
          </NavLink>
          <NavLink to="/account" className={({isActive}) => isActive ? "nav-link active" : "nav-link"} title="Account">
            <User size={20} />
            <span className={`link-text ${isExpanded ? 'visible' : 'hidden'}`}>Account</span>
          </NavLink>
          <button className="nav-link nav-button" onClick={onLogout} title="Logout">
            <LogOut size={20} />
            <span className={`link-text ${isExpanded ? 'visible' : 'hidden'}`}>Logout</span>
          </button>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
