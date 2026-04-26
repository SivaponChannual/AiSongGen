import React, { useState, useEffect } from 'react';
import { Play, Pause, Disc3, Download, Loader, MoreVertical, Heart } from 'lucide-react';
import './Library.css';

const Library = () => {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [playingSong, setPlayingSong] = useState(null);

  useEffect(() => {
    fetchSongs();
    
    // Poll for status updates if any songs are GENERATING
    const interval = setInterval(() => {
      setSongs(currentSongs => {
        const needsUpdate = currentSongs.some(s => s.status === 'GENERATING' || s.status === 'PENDING');
        if (needsUpdate) {
          fetchSongs(false);
        }
        return currentSongs;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const fetchSongs = async (showLoader = true) => {
    if (showLoader) setLoading(true);
    try {
      const res = await fetch('http://127.0.0.1:8000/api/songs/');
      const data = await res.json();
      setSongs(data);
    } catch (err) {
      console.error('Failed to fetch library', err);
    } finally {
      setLoading(false);
    }
  };

  const togglePlay = (song) => {
    if (!song.audio_file_url) return;
    if (playingSong?.song_id === song.song_id) {
      setPlayingSong(null); // Stop
    } else {
      setPlayingSong(song);
    }
  };

  const toggleFavorite = async (song) => {
    try {
      await fetch(`http://127.0.0.1:8000/api/songs/${song.song_id}/`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_favorited: !song.is_favorited })
      });
      fetchSongs(false);
    } catch (err) {
      console.error('Failed to toggle favorite', err);
    }
  };

  return (
    <div className="container library-container">
      <div className="library-header">
        <h1 className="text-gradient">Media Library</h1>
        <p>Your high-fidelity neural compositions. Every track rendered in Obsidian Flux audio.</p>
      </div>

      {loading ? (
        <div className="library-loading">
          <Loader className="spin" size={48} />
          <p>Loading neural tracks...</p>
        </div>
      ) : songs.length === 0 ? (
        <div className="library-empty glass-panel">
          <Disc3 size={64} />
          <h3>No compositions found</h3>
          <p>Head to Create to generate your first track.</p>
        </div>
      ) : (
        <div className="songs-grid">
          {songs.map(song => (
            <div key={song.song_id} className={`song-card glass-panel ${playingSong?.song_id === song.song_id ? 'playing' : ''}`}>
              
              {/* Album Art */}
              <div className="album-art-wrapper" onClick={() => togglePlay(song)}>
                {song.album_art_url ? (
                  <img src={song.album_art_url} alt={song.title} className="album-art" />
                ) : (
                  <div className="album-art-placeholder">
                    <Disc3 size={48} />
                  </div>
                )}
                
                <div className="play-overlay">
                  {(song.status === 'SUCCESS' || song.status === 'READY') ? (
                    playingSong?.song_id === song.song_id ? 
                      <Pause size={32} /> : 
                      <Play size={32} style={{marginLeft: 4}} />
                  ) : (
                    <Loader size={32} className="spin" />
                  )}
                </div>

                <span className={`status-badge-mini ${song.status?.toLowerCase() || 'pending'}`}>
                  {song.status || 'PENDING'}
                </span>
              </div>

              {/* Song Info */}
              <div className="song-card-content">
                <h3 className="song-card-title">{song.title}</h3>
                <p className="song-card-date">
                  {new Date(song.creation_timestamp).toLocaleDateString([], { 
                    month: 'short', 
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </p>
                <p className="song-card-id">{song.generation_task_id || 'No Task ID'}</p>
              </div>

              {/* Actions */}
              <div className="song-card-actions">
                <button 
                  className={`action-btn ${song.is_favorited ? 'favorited' : ''}`}
                  onClick={() => toggleFavorite(song)}
                  title={song.is_favorited ? 'Remove from favorites' : 'Add to favorites'}
                >
                  <Heart size={18} fill={song.is_favorited ? 'currentColor' : 'none'} />
                </button>
                
                {song.audio_file_url && (
                  <a 
                    href={song.audio_file_url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="action-btn"
                    title="Download"
                  >
                    <Download size={18} />
                  </a>
                )}
                
                <button className="action-btn" title="More options">
                  <MoreVertical size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Sticky Audio Player */}
      {playingSong && (
        <div className="sticky-player glass-panel">
          <div className="player-left">
            {playingSong.album_art_url && (
              <img src={playingSong.album_art_url} alt={playingSong.title} className="player-album-art" />
            )}
            <div className="player-info">
              <span className="player-title">{playingSong.title}</span>
              <span className="player-status">Now Playing: Obsidian Flux</span>
            </div>
          </div>
          
          <audio 
            src={playingSong.audio_file_url} 
            controls 
            autoPlay 
            className="real-player"
          />
          
          <div className="player-eq">
            <div className="eq-bar"><div className="eq-fill" style={{height: '60%'}}></div></div>
            <div className="eq-bar"><div className="eq-fill" style={{height: '80%'}}></div></div>
            <div className="eq-bar"><div className="eq-fill" style={{height: '40%'}}></div></div>
            <div className="eq-bar"><div className="eq-fill" style={{height: '90%'}}></div></div>
            <div className="eq-bar"><div className="eq-fill" style={{height: '50%'}}></div></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Library;
