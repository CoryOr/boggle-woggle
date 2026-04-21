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

  const [volume, setVolumeState] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(AUDIO_STORAGE_KEY));
      return saved?.volume ?? 0.5;
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
        volume,
      })
    );
  }, [muted, volume]);

  useEffect(() => {
    if (backgroundMusicRef.current) {
      backgroundMusicRef.current.volume = muted ? 0 : volume;
      backgroundMusicRef.current.muted = muted;
    }
  }, [muted, volume]);

  const setVolume = useCallback((newVolume) => {
    const numericVolume = Number(newVolume);

    if (Number.isNaN(numericVolume)) return;

    const clampedVolume = Math.min(1, Math.max(0, numericVolume));
    setVolumeState(clampedVolume);
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
        sound.volume = volume * clampedCustomVolume;
        sound.play().catch((err) => {
          console.warn("Unable to play sound effect:", err);
        });
      } catch (err) {
        console.warn("Error creating sound effect:", err);
      }
    },
    [muted, volume]
  );

  const startMusic = useCallback(
    (src) => {
      if (!src) return;

      try {
        const currentMusic = backgroundMusicRef.current;

        if (currentMusic && currentMusicSrcRef.current === src) {
          currentMusic.volume = muted ? 0 : volume;
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
        music.volume = muted ? 0 : volume;
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
    [muted, volume]
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
      volume,
      setVolume,
      toggleMute,
      setMuted,
      playSfx,
      startMusic,
      pauseMusic,
      stopMusic,
    }),
    [muted, volume, setVolume, toggleMute, playSfx, startMusic, pauseMusic, stopMusic]
  );

  return (
    <AudioContext.Provider value={value}>
      {children}
    </AudioContext.Provider>
  );
}