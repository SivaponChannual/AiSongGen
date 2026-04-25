import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { Disc3, Zap, Sparkles } from 'lucide-react';
import './Login.css';

const Login = ({ onLogin }) => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSuccess = async (credentialResponse) => {
    setLoading(true);
    setError('');
    
    try {
      const res = await fetch('http://127.0.0.1:8000/api/auth/google/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_token: credentialResponse.credential })
      });

      const data = await res.json();
      
      if (res.ok) {
        onLogin(data.user);
      } else {
        setError(data.error || 'Login failed. Please try again.');
      }
    } catch (err) {
      setError('Network error. Is the Django server running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-content">
        
        {/* Left Column: Branding */}
        <div className="login-branding">
          <div className="brand-header">
            <div className="brand-logo-box">
              <Disc3 size={24} color="#fff" />
            </div>
            <span className="brand-name">SonicArchitect</span>
          </div>
          
          <h1 className="hero-title">
            The Sound of<br />
            <span className="text-purple">Pure Precision.</span>
          </h1>
          
          <p className="hero-subtitle">
            An elite workspace for high-fidelity audio creation. Orchestrate your sonic vision with surgical tools and obsidian flux performance.
          </p>
          
          <div className="hero-badges">
            <span className="badge"><Zap size={14} /> PRO ENGINE</span>
            <span className="badge"><Sparkles size={14} /> AI SYNTHESIS</span>
          </div>
        </div>

        {/* Right Column: Login Card */}
        <div className="login-card-wrapper">
          <div className="login-card">
            <div className="card-header">
              <h2>Architect Login</h2>
              <p>Access your creative laboratory</p>
            </div>
            
            <div className="google-auth-wrapper">
              <GoogleLogin
                onSuccess={handleSuccess}
                onError={() => setError('Google Login Failed')}
                theme="outline"
                size="large"
                shape="rectangular"
                width="340"
                logo_alignment="center"
                text="signin_with"
              />
            </div>
            
            <div className="divider">
              <span>OR</span>
            </div>
            
            <form className="traditional-login-form">
              <div className="input-group">
                <label>STUDIO ID</label>
                <input type="text" placeholder="architect@sonic.ai" readOnly />
              </div>
              
              <div className="input-group">
                <label className="split-label">
                  ACCESS KEY
                  <a href="#" className="forgot-link">FORGOT?</a>
                </label>
                <input type="password" placeholder="••••••••" readOnly />
              </div>
              
              <button type="button" className="btn-initialize" disabled={loading}>
                {loading ? 'Initializing...' : 'Initialize Session'}
              </button>
            </form>
            
            <div className="card-footer">
              New architect? <a href="#" className="apply-link">Apply for clearance</a>
            </div>
            
            {error && <div className="error-msg">{error}</div>}
          </div>
        </div>
      </div>
      
      {/* Bottom Status Bar */}
      <div className="status-bar">
        <span className="status-indicator">
          <span className="dot red-dot"></span>
          SYSTEM STATUS: NOMINAL
        </span>
        <span className="status-version">
          © 2024 SONICARCHITECT V2.4.1
        </span>
      </div>
    </div>
  );
};

export default Login;
