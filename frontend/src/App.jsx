import { Routes, Route } from 'react-router-dom';

import { CurrentGameProvider } from "./contexts/CurrentGameContext/CurrentGameContext.jsx";
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

import "./App.css";

const App = () => {
  return (
    <UserProvider>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<RegistrationPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path = "/settings" element={<SettingsPage />} />
        <Route path="/game" element={
          <CurrentGameProvider>
            <GamePage />
          </CurrentGameProvider>
        } />
        <Route path="/stats" element={<StatsPage />} />
        <Route path="/store" element={<StorePage />} />
        <Route path="/game-select" element={<GameModeSelectionPage />} />
        <Route path="/lobby/:roomCode" element={
          <UserProvider>
            <LobbyPage />
          </UserProvider>
        } />
      </Routes>
    </UserProvider>
  );
};

export default App;