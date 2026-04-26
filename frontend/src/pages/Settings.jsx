import React, { useState, useEffect } from 'react';
import { Bell, Volume2, Globe } from 'lucide-react';
import './Settings.css';

const Settings = () => {
  const [settings, setSettings] = useState(null); // Start with null to detect initial load
  const [isLoaded, setIsLoaded] = useState(false);

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('userSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    } else {
      // Set defaults only if no saved settings exist
      setSettings({
        notifications: true,
        autoPlay: false,
        quality: 'high',
        theme: 'dark',
        language: 'en'
      });
    }
    setIsLoaded(true);
  }, []);

  // Auto-save settings whenever they change (but not on initial load)
  useEffect(() => {
    if (isLoaded && settings) {
      localStorage.setItem('userSettings', JSON.stringify(settings));
    }
  }, [settings, isLoaded]);

  // Apply theme changes
  useEffect(() => {
    if (settings) {
      if (settings.theme === 'system') {
        // Detect system preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
      } else {
        document.documentElement.setAttribute('data-theme', settings.theme);
      }
    }
  }, [settings?.theme]);

  const handleChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  // Don't render until settings are loaded
  if (!settings) {
    return null;
  }

  return (
    <div className="container settings-container">
      <div className="settings-header">
        <h1 className="text-gradient">Studio Settings</h1>
        <p>Configure your SonicArchitect experience</p>
      </div>

      <div className="settings-content">
        {/* General Settings */}
        <div className="settings-section glass-panel">
          <div className="section-title">
            <Bell size={24} />
            <h2>General</h2>
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <h3>Notifications</h3>
              <p>Receive alerts when tracks finish generating</p>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={settings.notifications}
                onChange={(e) => handleChange('notifications', e.target.checked)}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <h3>Language</h3>
              <p>Choose your preferred language</p>
            </div>
            <select
              className="setting-select"
              value={settings.language}
              onChange={(e) => handleChange('language', e.target.value)}
            >
              <option value="en">English</option>
              <option value="th">ไทย (Thai)</option>
            </select>
          </div>
        </div>

        {/* Audio Settings */}
        <div className="settings-section glass-panel">
          <div className="section-title">
            <Volume2 size={24} />
            <h2>Audio</h2>
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <h3>Auto-Play</h3>
              <p>Automatically play tracks when generation completes</p>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={settings.autoPlay}
                onChange={(e) => handleChange('autoPlay', e.target.checked)}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <h3>Audio Quality</h3>
              <p>Select playback quality preference</p>
            </div>
            <select
              className="setting-select"
              value={settings.quality}
              onChange={(e) => handleChange('quality', e.target.value)}
            >
              <option value="low">Low (128 kbps)</option>
              <option value="medium">Medium (256 kbps)</option>
              <option value="high">High (320 kbps)</option>
              <option value="lossless">Lossless (FLAC)</option>
            </select>
          </div>
        </div>

        {/* Theme */}
        <div className="settings-section glass-panel">
          <div className="section-title">
            <Globe size={24} />
            <h2>Theme</h2>
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <h3>Appearance</h3>
              <p>Choose your visual theme</p>
            </div>
            <select
              className="setting-select"
              value={settings.theme}
              onChange={(e) => handleChange('theme', e.target.value)}
            >
              <option value="dark">Dark (Obsidian)</option>
              <option value="light">Light (Luminous)</option>
              <option value="system">System (Auto)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
