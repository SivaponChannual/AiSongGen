import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Activity } from 'lucide-react';
import './Create.css';

// Import local images
import imgPop from '../assets/genre_pop_notext_1777132975981.png';
import imgJPop from '../assets/genre_jpop_notext_1777132995076.png';
import imgJdm from '../assets/genre_jdm_edited_1777133836437.png';
import imgRock from '../assets/genre_rock_notext_1777133025177.png';
import imgElectronic from '../assets/genre_electronic_notext_1777133044638.png';

const GENRES = [
  { id: 'POP', title: 'Pop', img: imgPop },
  { id: 'J_POP', title: 'J-Pop', img: imgJPop },
  { id: 'JDM', title: 'JDM', img: imgJdm },
  { id: 'ROCK', title: 'Rock', img: imgRock },
  { id: 'ELECTRONIC', title: 'Electronic', img: imgElectronic }
];

const MOODS = ['ENERGETIC', 'CALMING', 'UPBEAT', 'SAD', 'DREAMY'];
const OCCASIONS = ['WORKOUT', 'STUDY', 'PARTY', 'COMMUTE'];
const VOCALS = ['MALE', 'FEMALE', 'INSTRUMENTAL'];

const Create = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState(() => {
    const saved = localStorage.getItem('createFormData');
    if (saved) {
      return JSON.parse(saved);
    }
    return {
      title: '',
      genre: '',
      mood: '',
      occasion: '',
      vocal_selection: '',
      custom_lyrics: '',
      requested_length: 120
    };
  });
  
  const [productionState, setProductionState] = useState('IDLE');
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(0);

  React.useEffect(() => {
    localStorage.setItem('createFormData', JSON.stringify(formData));
  }, [formData]);

  const handleSelect = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const formatTime = (secs) => {
    if (secs < 60) {
      return `0:${secs.toString().padStart(2, '0')}`;
    }
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProductionState('GENERATING');
    setProgress(0);
    setError('');

    const progressInterval = setInterval(() => {
      setProgress(p => {
        if (p >= 95) return 95;
        return p + Math.random() * 10;
      });
    }, 500);

    try {
      const payload = {
        ...formData,
        media_library: 1 
      };

      const res = await fetch('http://127.0.0.1:8000/api/songs/generate/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      clearInterval(progressInterval);

      if (res.ok) {
        setProgress(100);
        setProductionState('SUCCESS');
        setTimeout(() => navigate('/library'), 1500);
      } else {
        setProductionState('ERROR');
        setError(data.error || 'Failed to generate song.');
      }
    } catch (err) {
      clearInterval(progressInterval);
      setProductionState('ERROR');
      setError('Network error connecting to the backend.');
    }
  };

  if (productionState !== 'IDLE') {
    return (
      <div className="create-container">
        <div className="production-monitor">
          <div className="monitor-card">
            <Activity className={`monitor-icon ${productionState === 'GENERATING' ? 'pulse' : ''}`} size={48} />
            
            <h2>
              {productionState === 'GENERATING' && 'Synthesizing Audio...'}
              {productionState === 'SUCCESS' && 'Production Complete!'}
              {productionState === 'ERROR' && 'Production Failed'}
            </h2>
            
            {productionState === 'GENERATING' && (
              <p className="monitor-sub">Orchestrating AI parameters. Estimated time: ~10 seconds.</p>
            )}

            {productionState === 'ERROR' && (
              <p className="monitor-sub error-text">{error}</p>
            )}

            <div className="progress-container">
              <div className="progress-bar" style={{ width: `${progress}%` }}></div>
            </div>
            
            {productionState === 'ERROR' && (
              <button className="retry-btn" onClick={() => setProductionState('IDLE')}>
                Reconfigure Parameters
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="create-container">
      <div className="create-header">
        <h1 className="text-gradient">Create Track</h1>
        <p>Your primary creation environment. Initialize your parameters.</p>
      </div>

      <form className="create-form" onSubmit={handleSubmit}>
        
        {/* Track Title */}
        <div className="form-section">
          <h3>Track Title</h3>
          <input 
            type="text" 
            name="title" 
            className="form-input"
            value={formData.title} 
            onChange={handleChange} 
            maxLength={256}
            placeholder="e.g. Neon Horizon Echo" 
            required 
          />
          <div className="char-count">{formData.title.length}/256</div>
        </div>

        {/* Genre Foundation */}
        <div className="form-section">
          <h3>Genre Foundation</h3>
          <div className="genre-grid">
            {GENRES.map(g => (
              <div 
                key={g.id} 
                className={`genre-card ${formData.genre === g.id ? 'selected' : ''}`}
                onClick={() => handleSelect('genre', g.id)}
                style={{ backgroundImage: `url(${g.img})` }}
              >
                <span className="genre-title">{g.title}</span>
                <button 
                  type="button"
                  className="genre-play-btn" 
                  onClick={(e) => {
                    e.stopPropagation();
                    // Audio preview will be added here later
                  }}
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="white">
                    <path d="M2 1.5v9l8-4.5z" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Mood & Occasion */}
        <div className="form-row">
          <div className="form-section">
            <h3>Mood</h3>
            <div className="button-group">
              {MOODS.map(m => (
                <button 
                  key={m} 
                  type="button" 
                  className={`option-btn ${formData.mood === m ? 'active' : ''}`}
                  onClick={() => handleSelect('mood', m)}
                >
                  {m.charAt(0) + m.slice(1).toLowerCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="form-section">
            <h3>Occasion</h3>
            <div className="button-group">
              {OCCASIONS.map(o => (
                <button 
                  key={o} 
                  type="button" 
                  className={`option-btn ${formData.occasion === o ? 'active' : ''}`}
                  onClick={() => handleSelect('occasion', o)}
                >
                  {o.charAt(0) + o.slice(1).toLowerCase()}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Vocal Selection */}
        <div className="form-section">
          <h3>Vocal Selection</h3>
          <div className="button-group">
            {VOCALS.map(v => (
              <button 
                key={v} 
                type="button" 
                className={`option-btn ${formData.vocal_selection === v ? 'active' : ''}`}
                onClick={() => handleSelect('vocal_selection', v)}
              >
                {v.charAt(0) + v.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Lyrical Guidance */}
        <div className="form-section">
          <h3>Lyrical Guidance / Theme <span className="optional">Optional</span></h3>
          <textarea 
            name="custom_lyrics" 
            className="form-textarea"
            value={formData.custom_lyrics} 
            onChange={handleChange} 
            placeholder="Describe specific themes, feelings, or paste custom lyrics here..."
            rows={4}
          />
        </div>

        {/* Target Duration */}
        <div className="form-section">
          <h3>Target Duration <span className="optional">20 sec - 4 min</span></h3>
          <div className="duration-control">
            <div className="duration-value">{formatTime(formData.requested_length)}</div>
            <input 
              type="range" 
              name="requested_length" 
              className="duration-slider"
              value={formData.requested_length} 
              onChange={handleChange} 
              min="20" max="240" step="10"
            />
            <div className="duration-labels">
              <span>0:20</span>
              <span>1:00</span>
              <span>2:00</span>
              <span>3:00</span>
              <span>4:00</span>
            </div>
          </div>
        </div>

        {/* Generate Button */}
        <div className="form-actions">
          <button type="submit" className="generate-btn">
            <Sparkles size={20} />
            <span>Generate Track</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default Create;
