import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { Disc3 } from 'lucide-react';
import './Login.css';

const Login = ({ onLogin }) => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSuccess = async (credentialResponse) => {
    setLoading(true);
    setError('');
    
    try {
      // Send the token to our Django backend
      const res = await fetch('http://127.0.0.1:8000/api/auth/google/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id_token: credentialResponse.credential
        })
      });

      const data = await res.json();
      
      if (res.ok) {
        onLogin(data.user);
      } else {
        setError(data.error || 'Login failed. Please try again.');
      }
    } catch (err) {
      setError('Network error. Is the Django server running?');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box glass-panel">
        <div className="login-header">
          <Disc3 className="login-logo" size={48} />
          <h1 className="text-gradient">System Initialization</h1>
          <p className="login-subtitle">Ignite Your Sonic Engine. Welcome to the Forge.</p>
        </div>
        
        <div className="login-body">
          {loading ? (
            <div className="calibrating">
              <div className="loader"></div>
              <p>Calibrating Audio Matrix...</p>
            </div>
          ) : (
            <div className="auth-wrapper">
              <GoogleLogin
                onSuccess={handleSuccess}
                onError={() => setError('Google Login Failed')}
                theme="filled_black"
                shape="rectangular"
                size="large"
                text="continue_with"
                logo_alignment="center"
              />
            </div>
          )}
          
          {error && <div className="error-msg">{error}</div>}
        </div>
      </div>
    </div>
  );
};

export default Login;
