import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, Music, ListMusic, User, Clock } from 'lucide-react';
import './Forge.css';

const Forge = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    genre: 'ELECTRONIC',
    mood: 'ENERGETIC',
    occasion: 'COMMUTE',
    vocal_selection: 'MALE',
    requested_length: 180
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // In a real app we'd get the actual media_library ID of the user. 
      // For this exercise, we'll hardcode 1 or grab from user context if available.
      const payload = {
        ...formData,
        media_library: 1 
      };

      const res = await fetch('http://127.0.0.1:8000/api/songs/generate/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (res.ok) {
        // Go to library to see the generation status
        navigate('/library');
      } else {
        setError(data.error || 'Failed to generate song.');
      }
    } catch (err) {
      setError('Network error connecting to the Forge.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container forge-container">
      <div className="forge-header">
        <h1 className="text-gradient">Create</h1>
        <p>Your primary creation environment. Initialize your parameters.</p>
      </div>

      <form className="forge-form glass-panel" onSubmit={handleSubmit}>
        <div className="form-group full-width">
          <label>Track Title</label>
          <input 
            type="text" 
            name="title" 
            value={formData.title} 
            onChange={handleChange} 
            placeholder="e.g. Neon Horizon Echo" 
            required 
          />
        </div>

        <div className="form-grid">
          <div className="form-group">
            <label><Music size={16}/> Genre</label>
            <select name="genre" value={formData.genre} onChange={handleChange}>
              <option value="POP">Pop</option>
              <option value="J_POP">J-Pop</option>
              <option value="JDM">JDM</option>
              <option value="ROCK">Rock</option>
              <option value="ELECTRONIC">Electronic</option>
            </select>
          </div>

          <div className="form-group">
            <label><Zap size={16}/> Mood</label>
            <select name="mood" value={formData.mood} onChange={handleChange}>
              <option value="ENERGETIC">Energetic</option>
              <option value="CALMING">Calming</option>
              <option value="UPBEAT">Upbeat</option>
              <option value="SAD">Sad</option>
              <option value="DREAMY">Dreamy</option>
            </select>
          </div>

          <div className="form-group">
            <label><ListMusic size={16}/> Occasion</label>
            <select name="occasion" value={formData.occasion} onChange={handleChange}>
              <option value="WORKOUT">Workout</option>
              <option value="STUDY">Study</option>
              <option value="PARTY">Party</option>
              <option value="COMMUTE">Commute</option>
            </select>
          </div>

          <div className="form-group">
            <label><User size={16}/> Vocals</label>
            <select name="vocal_selection" value={formData.vocal_selection} onChange={handleChange}>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="INSTRUMENTAL">Instrumental</option>
            </select>
          </div>
          
          <div className="form-group">
            <label><Clock size={16}/> Duration (sec)</label>
            <input 
              type="number" 
              name="requested_length" 
              value={formData.requested_length} 
              onChange={handleChange} 
              min="30" max="600" 
            />
          </div>
        </div>

        {error && <div className="error-msg">{error}</div>}

        <div className="forge-actions">
          <button type="submit" className="btn-primary generate-btn" disabled={loading}>
            {loading ? 'Synthesizing...' : 'Generate New Track'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Forge;
