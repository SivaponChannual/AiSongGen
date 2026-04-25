import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Activity, Clock, CheckCircle2, Play } from 'lucide-react';
import './Create.css';

// Import local images
import imgPop from '../assets/genre_pop_notext_1777132975981.png';
import imgJPop from '../assets/genre_jpop_notext_1777132995076.png';
import imgJdm from '../assets/genre_jdm_notext_1777133010173.png';
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
  const [formData, setFormData] = useState({
    title: '',
    genre: 'ELECTRONIC',
    mood: 'ENERGETIC',
    occasion: 'COMMUTE',
    vocal_selection: 'MALE',
    custom_lyrics: '',
    requested_length: 180
  });
  
  const [productionState, setProductionState] = useState('IDLE'); // IDLE, GENERATING, SUCCESS, ERROR
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(0);

  const handleSelect = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePlayClick = (e, genreId) => {
    e.stopPropagation(); // Prevent tile selection
    // Optional: Could add temporary heartbeat state to specific genre ID here if needed
    // But CSS :active or animation class toggling usually suffices.
    const btn = e.currentTarget;
    btn.classList.remove('heartbeat-anim');
    void btn.offsetWidth; // trigger reflow
    btn.classList.add('heartbeat-anim');
  };

  // Format seconds to M:SS
  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProductionState('GENERATING');
    setProgress(0);
    setError('');

    // Simulate progress bar
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

  // Production Monitor View
  if (productionState !== 'IDLE') {
    return (
      <div className="container forge-container">
        <div className="production-monitor">
          <div className="monitor-card glass-panel">
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
              <button className="btn-primary retry-btn" onClick={() => setProductionState('IDLE')}>
                Reconfigure Parameters
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Normal Form View
  return (
    <div className="container forge-container">
      <div className="forge-header">
        <h1 className="text-gradient">Create Track</h1>
        <p>Your primary creation environment. Initialize your parameters.</p>
      </div>

      <form className="forge-form" onSubmit={handleSubmit}>
        
        {/* Track Title */}
        <div className="form-section">
          <div className="form-group full-width">
            <label>Track Title <span className="char-limit">{formData.title.length}/256</span></label>
            <input 
              type="text" 
              name="title" 
              className="glass-input big-input"
              value={formData.title} 
              onChange={handleChange} 
              maxLength={256}
              placeholder="e.g. Neon Horizon Echo" 
              required 
            />
          </div>
        </div>

        {/* Genre Foundation Tiles */}
        <div className="form-section">
          <h3>Genre Foundation</h3>
          <div className="genre-grid">
            {GENRES.map(g => (
              <div 
                key={g.id} 
                className={`genre-tile ${formData.genre === g.id ? 'selected' : ''}`}
                onClick={() => handleSelect('genre', g.id)}
                style={{ backgroundImage: `url(${g.img})` }}
              >
                <div className="tile-overlay"></div>
                <div className="tile-content-wrapper">
                  <span className="tile-title">{g.title}</span>
                  <button 
                    type="button"
                    className="play-button" 
                    onClick={(e) => handlePlayClick(e, g.id)}
                  >
                    <Play fill="white" size={12} style={{marginLeft: 2}} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Segmented Controls Section */}
        <div className="form-section split-section">
          <div className="form-group">
            <label>Mood</label>
            <div className="segmented-control">
              {MOODS.map(m => (
                <button 
                  key={m} 
                  type="button" 
                  className={`seg-btn ${formData.mood === m ? 'active' : ''}`}
                  onClick={() => handleSelect('mood', m)}
                >
                  {m.charAt(0) + m.slice(1).toLowerCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Occasion</label>
            <div className="segmented-control">
              {OCCASIONS.map(o => (
                <button 
                  key={o} 
                  type="button" 
                  className={`seg-btn ${formData.occasion === o ? 'active' : ''}`}
                  onClick={() => handleSelect('occasion', o)}
                >
                  {o.charAt(0) + o.slice(1).toLowerCase()}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="form-section">
          <div className="form-group">
            <label>Vocal Selection</label>
            <div className="segmented-control vocal-control">
              {VOCALS.map(v => (
                <button 
                  key={v} 
                  type="button" 
                  className={`seg-btn ${formData.vocal_selection === v ? 'active' : ''}`}
                  onClick={() => handleSelect('vocal_selection', v)}
                >
                  {v.charAt(0) + v.slice(1).toLowerCase()}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Lyrical Guidance */}
        <div className="form-section">
          <div className="form-group full-width">
            <label>Lyrical Guidance / Theme <span className="optional-badge">Optional</span></label>
            <textarea 
              name="custom_lyrics" 
              className="glass-input"
              value={formData.custom_lyrics} 
              onChange={handleChange} 
              placeholder="Describe specific themes, feelings, or paste custom lyrics here..."
              rows={4}
            />
          </div>
        </div>
        
        {/* Production Controls */}
        <div className="form-section production-section glass-panel">
          <div className="duration-wrapper">
            <div className="duration-header">
              <label><Clock size={16}/> Target Duration</label>
              <span className="duration-value">{formatTime(formData.requested_length)}</span>
            </div>
            <input 
              type="range" 
              name="requested_length" 
              className="custom-slider"
              value={formData.requested_length} 
              onChange={handleChange} 
              min="120" max="360" step="5"
            />
            <div className="slider-labels">
              <span>2:00</span>
              <span>6:00</span>
            </div>
          </div>

          <button type="submit" className="btn-primary generate-cta">
            <Sparkles size={18} /> Initialize Synthesis
          </button>
        </div>
      </form>
    </div>
  );
};

export default Forge;
