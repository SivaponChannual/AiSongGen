import React, { useState, useEffect } from 'react';
import { User, Mail, Calendar, Shield, CreditCard, LogOut, Edit2, Check } from 'lucide-react';
import './Account.css';

const Account = ({ onLogout }) => {
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [displayName, setDisplayName] = useState('');

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      setDisplayName(userData.user_email?.split('@')[0] || 'User');
    }
  }, []);

  const handleSave = () => {
    // Save display name
    setEditing(false);
    // You can add API call here to update user profile
  };

  if (!user) {
    return (
      <div className="container account-container">
        <div className="loading-state">Loading account...</div>
      </div>
    );
  }

  return (
    <div className="container account-container">
      <div className="account-header">
        <h1 className="text-gradient">Account</h1>
        <p>Manage your SonicArchitect profile and preferences</p>
      </div>

      <div className="account-content">
        {/* Profile Card */}
        <div className="account-section glass-panel">
          <div className="profile-banner">
            <div className="profile-avatar">
              <User size={48} />
            </div>
          </div>

          <div className="profile-content">
            <div className="profile-name-section">
              {editing ? (
                <div className="name-edit-group">
                  <input
                    type="text"
                    className="name-input"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    autoFocus
                  />
                  <button className="icon-btn" onClick={handleSave}>
                    <Check size={18} />
                  </button>
                </div>
              ) : (
                <div className="name-display-group">
                  <h2>{displayName}</h2>
                  <button className="icon-btn" onClick={() => setEditing(true)}>
                    <Edit2 size={18} />
                  </button>
                </div>
              )}
            </div>

            <div className="profile-details">
              <div className="detail-item">
                <Mail size={16} />
                <span>{user.user_email}</span>
              </div>
              <div className="detail-item">
                <Calendar size={16} />
                <span>Member since {new Date().getFullYear()}</span>
              </div>
              <div className="detail-item">
                <Shield size={16} />
                <span className="badge-pro">PRO TIER</span>
              </div>
            </div>
          </div>
        </div>

        {/* Account Info */}
        <div className="account-section glass-panel">
          <div className="section-title">
            <User size={24} />
            <h2>Account Information</h2>
          </div>

          <div className="info-grid">
            <div className="info-item">
              <label>Email</label>
              <p className="info-value">{user.user_email}</p>
            </div>

            <div className="info-item">
              <label>Account Status</label>
              <p className="info-value">
                <span className="status-active">Active</span>
              </p>
            </div>

            <div className="info-item">
              <label>Onboarding</label>
              <p className="info-value">
                {user.onboarding_status ? 'Completed' : 'Pending'}
              </p>
            </div>

            <div className="info-item">
              <label>Account Type</label>
              <p className="info-value">
                <span className="badge-pro">Professional</span>
              </p>
            </div>
          </div>
        </div>

        {/* Subscription */}
        <div className="account-section glass-panel">
          <div className="section-title">
            <CreditCard size={24} />
            <h2>Subscription</h2>
          </div>

          <div className="subscription-card">
            <div className="subscription-header">
              <div>
                <h3>Pro Creator Plan</h3>
                <p>Unlimited AI generations</p>
              </div>
              <div className="subscription-price">
                <span className="price">∞</span>
                <span className="period">/ forever</span>
              </div>
            </div>

            <div className="subscription-features">
              <div className="feature-item">
                <Check size={16} className="check-icon" />
                <span>Unlimited track generation</span>
              </div>
              <div className="feature-item">
                <Check size={16} className="check-icon" />
                <span>High-fidelity audio (320kbps)</span>
              </div>
              <div className="feature-item">
                <Check size={16} className="check-icon" />
                <span>Priority processing</span>
              </div>
              <div className="feature-item">
                <Check size={16} className="check-icon" />
                <span>Advanced customization</span>
              </div>
              <div className="feature-item">
                <Check size={16} className="check-icon" />
                <span>Commercial license</span>
              </div>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="account-section glass-panel danger-zone">
          <div className="section-title">
            <Shield size={24} />
            <h2>Account Actions</h2>
          </div>

          <div className="danger-actions">
            <button className="btn-danger" onClick={onLogout}>
              <LogOut size={20} />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
