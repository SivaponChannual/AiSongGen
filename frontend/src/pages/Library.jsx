import React, { useState, useEffect } from 'react';
import { Play, Pause, Disc3, Download, Loader } from 'lucide-react';
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

  return (
    <div className="container library-container">
      <div className="library-header">
        <h1 className="text-gradient">Media Library</h1>
        <p>Manage your high-fidelity neural compositions. Every track is rendered in Obsidian Flux audio.</p>
      </div>

      <div className="library-content glass-panel">
        <div className="library-table-header">
          <div className="col title">TITLE</div>
          <div className="col status">STATUS</div>
          <div className="col date">CREATION DATE</div>
          <div className="col actions"></div>
        </div>

        {loading ? (
          <div className="library-loading">
            <Loader className="spin" size={32} />
            <p>Loading neural tracks...</p>
          </div>
        ) : songs.length === 0 ? (
          <div className="library-empty">
            <Disc3 size={48} />
            <h3>No compositions found</h3>
            <p>Head to The Forge to generate your first track.</p>
          </div>
        ) : (
          <div className="song-list">
            {songs.map(song => (
              <div key={song.song_id} className={`song-row ${playingSong?.song_id === song.song_id ? 'playing' : ''}`}>
                <div className="col title">
                  <div className="play-btn-wrapper" onClick={() => togglePlay(song)}>
                    {(song.status === 'SUCCESS' || song.status === 'READY') ? (
                      playingSong?.song_id === song.song_id ? <Pause size={20} /> : <Play size={20} />
                    ) : (
                      <Loader size={20} className="spin" />
                    )}
                  </div>
                  <div className="song-info">
                    <span className="song-name">{song.title}</span>
                    <span className="song-id">{song.generation_task_id || 'No Task ID'}</span>
                  </div>
                </div>
                <div className="col status">
                  <span className={`status-badge ${song.status?.toLowerCase() || 'pending'}`}>
                    {song.status || 'PENDING'}
                  </span>
                </div>
                <div className="col date">
                  {new Date(song.creation_timestamp).toLocaleDateString()}
                </div>
                <div className="col actions">
                  {song.audio_file_url && (
                    <a href={song.audio_file_url} target="_blank" rel="noopener noreferrer" className="btn-secondary sm" title="Download">
                      <Download size={16} />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Sticky Audio Player (Mock UI) */}
      {playingSong && (
        <div className="sticky-player glass-panel">
          <div className="player-info">
            <span className="player-title">{playingSong.title}</span>
            <span className="player-status">Now Playing: Obsidian Flux</span>
          </div>
          
          <div className="player-eq">
            {/* Visual mock of 5-Band EQ */}
            <div className="eq-bar"><div className="eq-fill" style={{height: '60%'}}></div></div>
            <div className="eq-bar"><div className="eq-fill" style={{height: '80%'}}></div></div>
            <div className="eq-bar"><div className="eq-fill" style={{height: '40%'}}></div></div>
            <div className="eq-bar"><div className="eq-fill" style={{height: '90%'}}></div></div>
            <div className="eq-bar"><div className="eq-fill" style={{height: '50%'}}></div></div>
          </div>
          
          <audio 
            src={playingSong.audio_file_url} 
            controls 
            autoPlay 
            className="real-player"
          />
        </div>
      )}
    </div>
  );
};

export default Library;
