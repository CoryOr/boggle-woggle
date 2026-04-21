import { Routes, Route, useLocation } from 'react-router-dom';
import { useContext, useEffect } from 'react';

import { CurrentGameProvider, CurrentGameContext } from "./contexts/CurrentGameContext/CurrentGameContext.jsx";
import { UserProvider } from "./contexts/UserContext/UserContext.jsx";

import LoginPage from "./pages/LoginPage";
import RegistrationPage from "./pages/RegistrationPage";
import HomePage from "./pages/HomePage.jsx";
import GamePage from "./pages/GamePage.jsx";
import StatsPage from "./pages/StatsPage.jsx";
import StorePage from "./pages/StorePage.jsx";
import SettingsPage from "./pages/SettingsPage.jsx";
import GameModeSelectionPage from "./pages/GameModeSelectionPage.jsx";
import LobbyPage from './pages/LobbyPage.jsx';
import MultiplayerGamePage from './pages/MultiplayerGamePage.jsx';

import "./App.css";

const App = () => {
  return (
    <UserProvider>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<RegistrationPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/game" element={
          <CurrentGameProvider>
            <GamePage />
          </CurrentGameProvider>
        } />
        <Route path="/stats" element={<StatsPage />} />
        <Route path="/store" element={<StorePage />} />
        <Route path="/game-select" element={<GameModeSelectionPage />} />
        <Route path="/lobby/:roomCode" element={
          <CurrentGameProvider skipAutoFetch={true}>
            <LobbyPage />
          </CurrentGameProvider>
        } />
        <Route path="/lobby/:roomCode/game" element={
          <MultiplayerGamePageRoute />
        } />
      </Routes>
    </UserProvider>
  );
};

function MultiplayerGamePageRoute() {
  return (
    <CurrentGameProvider skipAutoFetch={true}>
      <MultiplayerGamePageWrapper />
    </CurrentGameProvider>
  );
}

function MultiplayerGamePageWrapper() {
  const location = useLocation();
  const { players = [], gameId, board } = location.state ?? {};
  const { setBoard, setGameId, setScore, setTimeLeft, setIsLoading, isLoading } =
    useContext(CurrentGameContext);

  useEffect(() => {
    if (board && gameId) {
      setBoard(board);
      setGameId(gameId);
      setScore(0);
      setTimeLeft(5);
      setTimeout(() => setIsLoading(false), 500);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Don't render the game page until the context has been seeded.
  // Without this guard, MultiplayerGamePage sees timeLeft===0 on the
  // first render (before the useEffect above runs) and immediately
  // shows the game finished screen.
  if (isLoading) return null;

  return <MultiplayerGamePage initialPlayers={players} />;
}

export default App;