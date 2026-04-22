/**
 * AudioContext.jsx
 *
 * Global audio state + helpers for the Boggle app.
 *
 * Features:
 * - Stores muted/unmuted state
 * - Stores master volume
 * - Persists audio settings in localStorage
 * - Provides helper functions for sound effects
 * - Provides helper functions for looping background music
 *
 * Usage:
 * - Wrap <AudioProvider> around your app in App.jsx
 * - Access with: const { muted, volume, toggleMute, setVolume, playSfx, startMusic, stopMusic } = useContext(AudioContext);
 */

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { AudioContext } from "./AudioContextContext";

const AUDIO_STORAGE_KEY = "audioSettings";

export function AudioProvider({ children }) {
  const [muted, setMuted] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(AUDIO_STORAGE_KEY));
      return saved?.muted ?? false;
    } catch {
      return false;
    }
  });

  const [masterVolume, setMasterVolumeState] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(AUDIO_STORAGE_KEY));
      return saved?.masterVolume ?? 0.5;
    } catch {
      return 0.5;
    }
  });

  const [musicVolume, setMusicVolumeState] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(AUDIO_STORAGE_KEY));
      return saved?.musicVolume ?? 0.5;
    } catch {
      return 0.5;
    }
  });

  const [sfxVolume, setSfxVolumeState] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(AUDIO_STORAGE_KEY));
      return saved?.sfxVolume ?? 0.5;
    } catch {
      return 0.5;
    }
  });

  const backgroundMusicRef = useRef(null);
  const currentMusicSrcRef = useRef(null);

  useEffect(() => {
    localStorage.setItem(
      AUDIO_STORAGE_KEY,
      JSON.stringify({
        muted,
        masterVolume,
        musicVolume,
        sfxVolume,
      })
    );
  }, [muted, masterVolume, musicVolume, sfxVolume]);

  useEffect(() => {
    if (backgroundMusicRef.current) {
      backgroundMusicRef.current.volume = muted
        ? 0
        : masterVolume * musicVolume;
      backgroundMusicRef.current.muted = muted;
    }
  }, [muted, masterVolume, musicVolume]);

  const clampVolume = (value) => {
    const numericValue = Number(value);
    if (Number.isNaN(numericValue)) return null;
    return Math.min(1, Math.max(0, numericValue));
  };

  const setVolume = useCallback((newVolume) => {
    const clampedVolume = clampVolume(newVolume);
    if (clampedVolume === null) return;
    setMasterVolumeState(clampedVolume);
  }, []);

  const setMusicVolume = useCallback((newVolume) => {
    const clampedVolume = clampVolume(newVolume);
    if (clampedVolume === null) return;
    setMusicVolumeState(clampedVolume);
  }, []);

  const setSfxVolume = useCallback((newVolume) => {
    const clampedVolume = clampVolume(newVolume);
    if (clampedVolume === null) return;
    setSfxVolumeState(clampedVolume);
  }, []);

  const toggleMute = useCallback(() => {
    setMuted((prev) => !prev);
  }, []);

  const playSfx = useCallback(
    (src, customVolume = 1) => {
      if (!src || muted) return;

      try {
        const sound = new Audio(src);
        const clampedCustomVolume = Math.min(1, Math.max(0, customVolume));
        sound.volume = masterVolume * sfxVolume * clampedCustomVolume;
        sound.play().catch((err) => {
          console.warn("Unable to play sound effect:", err);
        });
      } catch (err) {
        console.warn("Error creating sound effect:", err);
      }
    },
    [muted, masterVolume, sfxVolume]
  );

  const startMusic = useCallback(
    (src) => {
      if (!src) return;

      try {
        const currentMusic = backgroundMusicRef.current;

        if (currentMusic && currentMusicSrcRef.current === src) {
          currentMusic.volume = muted ? 0 : masterVolume * musicVolume;
          currentMusic.muted = muted;

          if (currentMusic.paused) {
            currentMusic.play().catch((err) => {
              console.warn("Unable to resume background music:", err);
            });
          }

          return;
        }

        if (currentMusic) {
          currentMusic.pause();
          currentMusic.currentTime = 0;
        }

        const music = new Audio(src);
        music.loop = true;
        music.volume = muted ? 0 : masterVolume * musicVolume;
        music.muted = muted;

        backgroundMusicRef.current = music;
        currentMusicSrcRef.current = src;

        music.play().catch((err) => {
          console.warn("Unable to start background music:", err);
        });
      } catch (err) {
        console.warn("Error starting background music:", err);
      }
    },
    [muted, masterVolume, musicVolume]
  );

  const pauseMusic = useCallback(() => {
    if (backgroundMusicRef.current) {
      backgroundMusicRef.current.pause();
    }
  }, []);

  const stopMusic = useCallback(() => {
    if (backgroundMusicRef.current) {
      backgroundMusicRef.current.pause();
      backgroundMusicRef.current.currentTime = 0;
    }
    currentMusicSrcRef.current = null;
  }, []);

  const value = useMemo(
    () => ({
      muted,
      toggleMute,
      setMuted,

      volume: masterVolume,
      setVolume,

      masterVolume,
      musicVolume,
      sfxVolume,
      setMusicVolume,
      setSfxVolume,

      playSfx,
      startMusic,
      pauseMusic,
      stopMusic,
    }),
    [
      muted,
      toggleMute,
      setVolume,
      masterVolume,
      musicVolume,
      sfxVolume,
      setMusicVolume,
      setSfxVolume,
      playSfx,
      startMusic,
      pauseMusic,
      stopMusic,
    ]
  );

  return (
    <AudioContext.Provider value={value}>
      {children}
    </AudioContext.Provider>
  );
}