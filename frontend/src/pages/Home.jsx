import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Heart, Clock, Zap, Music, Play } from 'lucide-react';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalSongs: 0,
    recentSongs: [],
    favorites: 0
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch('http://127.0.0.1:8000/api/songs/');
      const songs = await res.json();
      
      setStats({
        totalSongs: songs.length,
        recentSongs: songs.slice(0, 4),
        favorites: songs.filter(s => s.is_favorited).length
      });
    } catch (err) {
      console.error('Failed to fetch stats', err);
    }
  };

  return (
    <div className="container home-container">
      {/* Hero Section */}
      <div className="home-hero">
        <div className="hero-content">
          <h1 className="hero-title">
            Welcome to <span className="text-gradient">SonicArchitect</span>
          </h1>
          <p className="hero-subtitle">
            Your AI-powered music creation studio. Generate high-fidelity tracks with surgical precision.
          </p>
          <div className="hero-actions">
            <button className="btn-primary hero-btn" onClick={() => navigate('/create')}>
              <Sparkles size={20} />
              Create New Track
            </button>
            <button className="btn-secondary hero-btn" onClick={() => navigate('/library')}>
              <Music size={20} />
              View Library
            </button>
          </div>
        </div>
        
        <div className="hero-visual">
          <div className="visual-orb orb-1"></div>
          <div className="visual-orb orb-2"></div>
          <div className="visual-orb orb-3"></div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card glass-panel">
          <div className="stat-icon">
            <Music size={24} />
          </div>
          <div className="stat-content">
            <h3 className="stat-value">{stats.totalSongs}</h3>
            <p className="stat-label">Total Tracks</p>
          </div>
        </div>

        <div className="stat-card glass-panel">
          <div className="stat-icon stat-icon-heart">
            <Heart size={24} />
          </div>
          <div className="stat-content">
            <h3 className="stat-value">{stats.favorites}</h3>
            <p className="stat-label">Favorites</p>
          </div>
        </div>

        <div className="stat-card glass-panel">
          <div className="stat-icon">
            <Zap size={24} />
          </div>
          <div className="stat-content">
            <h3 className="stat-value">Pro</h3>
            <p className="stat-label">Account Tier</p>
          </div>
        </div>

        <div className="stat-card glass-panel">
          <div className="stat-icon">
            <Clock size={24} />
          </div>
          <div className="stat-content">
            <h3 className="stat-value">∞</h3>
            <p className="stat-label">Credits</p>
          </div>
        </div>
      </div>

      {/* Recent Tracks */}
      {stats.recentSongs.length > 0 && (
        <div className="recent-section">
          <div className="section-header">
            <h2>Recent Creations</h2>
            <button className="link-btn" onClick={() => navigate('/library')}>
              View All →
            </button>
          </div>

          <div className="recent-grid">
            {stats.recentSongs.map(song => (
              <div key={song.song_id} className="recent-card glass-panel" onClick={() => navigate('/library')}>
                {song.album_art_url ? (
                  <img src={song.album_art_url} alt={song.title} className="recent-art" />
                ) : (
                  <div className="recent-art-placeholder">
                    <Music size={32} />
                  </div>
                )}
                <div className="recent-info">
                  <h4>{song.title}</h4>
                  <p>{new Date(song.creation_timestamp).toLocaleDateString()}</p>
                </div>
                <div className="recent-play">
                  <Play size={16} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="quick-actions">
        <div className="section-header">
          <h2>Quick Actions</h2>
        </div>

        <div className="actions-grid">
          <div className="action-card glass-panel" onClick={() => navigate('/create')}>
            <Sparkles size={32} className="action-icon" />
            <h3>Generate Track</h3>
            <p>Create a new AI-powered composition</p>
          </div>

          <div className="action-card glass-panel" onClick={() => navigate('/library')}>
            <Music size={32} className="action-icon" />
            <h3>Browse Library</h3>
            <p>Explore your music collection</p>
          </div>

          <div className="action-card glass-panel" onClick={() => navigate('/settings')}>
            <Zap size={32} className="action-icon" />
            <h3>Studio Settings</h3>
            <p>Configure your preferences</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
