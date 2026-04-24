/**
 * AudioContext.jsx
 *
 * Handles all audio for the app.
 *
 * Features:
 * - Mute / unmute
 * - Master, music, and SFX volume controls
 * - Saves settings in localStorage
 * - Plays sound effects (clicks, valid/invalid, etc.)
 * - Handles background music (menu + gameplay)
 *
 * Usage:
 * Wrap <AudioProvider> around the app and use:
 * const { playSfx, playMusic, toggleMute, ... } = useContext(AudioContext);
 */

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { AudioContext } from "./AudioContextContext";

// Key used to persist audio settings in localStorage.
const AUDIO_STORAGE_KEY = "project3c_audio_settings";

// Makes sure any volume value stays between 0 and 1.
// If the value is invalid, we fall back to 0.5.
const clampVolume = (value) => {
  const num = Number(value);
  if (Number.isNaN(num)) return 0.5;
  return Math.min(1, Math.max(0, num));
};

export function AudioProvider({ children }) {
  // Stores whether all audio is muted.
  // Initial value is loaded from localStorage if available.
  const [muted, setMuted] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(AUDIO_STORAGE_KEY));
      return saved?.muted ?? false;
    } catch {
      return false;
    }
  });

  // Master volume affects both music and sound effects.
  const [masterVolume, setMasterVolumeState] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(AUDIO_STORAGE_KEY));
      return clampVolume(saved?.masterVolume ?? 0.5);
    } catch {
      return 0.5;
    }
  });

  // Music volume only affects looping background music.
  const [musicVolume, setMusicVolumeState] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(AUDIO_STORAGE_KEY));
      return clampVolume(saved?.musicVolume ?? 0.5);
    } catch {
      return 0.5;
    }
  });

  // SFX volume only affects one-shot sound effects.
  const [sfxVolume, setSfxVolumeState] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(AUDIO_STORAGE_KEY));
      return clampVolume(saved?.sfxVolume ?? 0.5);
    } catch {
      return 0.5;
    }
  });

  // Holds the currently active background music Audio object.
  const musicRef = useRef(null);

  // Tracks which music file is currently loaded so we do not restart
  // the same song unnecessarily on route changes/re-renders.
  const currentMusicSrcRef = useRef(null);

  // If autoplay is blocked by the browser, we store the requested
  // music source here and try again after the first user interaction.
  const pendingMusicSrcRef = useRef(null);

  // Tracks whether the user has interacted with the page yet.
  // Some browsers require interaction before audio can start.
  const hasUserInteractedRef = useRef(false);

  // Persist audio settings any time one of them changes.
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

  // Keep the currently playing music element in sync whenever
  // mute/master/music values change.
  useEffect(() => {
    const music = musicRef.current;
    if (!music) return;

    music.volume = muted ? 0 : masterVolume * musicVolume;
    music.muted = muted;
  }, [muted, masterVolume, musicVolume]);

  // Some browsers block audio playback until the user clicks or presses a key.
  // This effect listens for first interaction and retries any pending music.
  useEffect(() => {
    const unlockAudio = () => {
      hasUserInteractedRef.current = true;

      const pendingSrc = pendingMusicSrcRef.current;
      const music = musicRef.current;

      if (pendingSrc && music && currentMusicSrcRef.current === pendingSrc) {
        music.play().catch(() => {
          // Still blocked or failed; do nothing for now.
        });
        pendingMusicSrcRef.current = null;
      }
    };

    window.addEventListener("pointerdown", unlockAudio, { passive: true });
    window.addEventListener("keydown", unlockAudio);

    return () => {
      window.removeEventListener("pointerdown", unlockAudio);
      window.removeEventListener("keydown", unlockAudio);
    };
  }, []);

  // Clean up the active music object when the provider unmounts.
  useEffect(() => {
    return () => {
      if (musicRef.current) {
        musicRef.current.pause();
        musicRef.current.src = "";
        musicRef.current = null;
      }
    };
  }, []);

  // Update master volume safely.
  const setMasterVolume = useCallback((value) => {
    setMasterVolumeState(clampVolume(value));
  }, []);

  // Keeps compatibility with older code that may still call setVolume().
  const setVolume = setMasterVolume;

  // Update music volume safely.
  const setMusicVolume = useCallback((value) => {
    setMusicVolumeState(clampVolume(value));
  }, []);

  // Update SFX volume safely.
  const setSfxVolume = useCallback((value) => {
    setSfxVolumeState(clampVolume(value));
  }, []);

  // Toggle mute on/off.
  const toggleMute = useCallback(() => {
    setMuted((prev) => !prev);
  }, []);

  // Plays a one-shot sound effect.
  // `customVolume` can be used to make a specific sound quieter/louder
  // while still respecting the global master + sfx settings.
  const playSfx = useCallback(
    (src, customVolume = 1) => {
      if (!src || muted) return;

      try {
        const sound = new window.Audio(src);
        sound.preload = "auto";
        sound.volume =
          masterVolume * sfxVolume * Math.min(1, Math.max(0, customVolume));

        sound.play().catch(() => {
          // Browsers may block playback until first interaction.
        });
      } catch (error) {
        console.warn("Failed to play SFX:", error);
      }
    },
    [muted, masterVolume, sfxVolume]
  );

  // Starts looping background music.
  // If the same track is already loaded, we just resume/update it.
  // If a different track is requested, we stop the old one and load the new one.
  const playMusic = useCallback(
    (src) => {
      if (!src) return;

      let music = musicRef.current;

      // If this exact song is already loaded, do not restart it.
      // Just update its volume/mute state and resume if paused.
      if (music && currentMusicSrcRef.current === src) {
        music.volume = muted ? 0 : masterVolume * musicVolume;
        music.muted = muted;

        if (music.paused) {
          music.play().catch(() => {
            pendingMusicSrcRef.current = src;
          });
        }
        return;
      }

      // Stop and clear the old music before loading the new one.
      if (music) {
        music.pause();
        music.src = "";
      }

      music = new window.Audio(src);
      music.loop = true;
      music.preload = "auto";
      music.volume = muted ? 0 : masterVolume * musicVolume;
      music.muted = muted;

      musicRef.current = music;
      currentMusicSrcRef.current = src;

      music.play().catch(() => {
        // Save this track so we can retry after user interaction.
        pendingMusicSrcRef.current = src;
      });
    },
    [muted, masterVolume, musicVolume]
  );

  // Pause the current background music without resetting its time.
  const pauseMusic = useCallback(() => {
    if (musicRef.current) {
      musicRef.current.pause();
    }
  }, []);

  // Stop the current background music and reset it to the beginning.
  const stopMusic = useCallback(() => {
    if (musicRef.current) {
      musicRef.current.pause();
      musicRef.current.currentTime = 0;
    }
    currentMusicSrcRef.current = null;
    pendingMusicSrcRef.current = null;
  }, []);

  // Memoize the context value so consumers do not re-render unnecessarily
  // unless one of the exposed values/functions actually changes.
  const value = useMemo(
    () => ({
      muted,
      setMuted,
      toggleMute,

      // Alias for backward compatibility
      volume: masterVolume,
      setVolume,

      masterVolume,
      musicVolume,
      sfxVolume,
      setMasterVolume,
      setMusicVolume,
      setSfxVolume,

      playSfx,
      playMusic,
      pauseMusic,
      stopMusic,
    }),
    [
      muted,
      toggleMute,
      masterVolume,
      setVolume,
      musicVolume,
      sfxVolume,
      setMasterVolume,
      setMusicVolume,
      setSfxVolume,
      playSfx,
      playMusic,
      pauseMusic,
      stopMusic,
    ]
  );

  // Make the audio state/helpers available to the whole app.
  return (
    <AudioContext.Provider value={value}>
      {children}
    </AudioContext.Provider>
  );
}