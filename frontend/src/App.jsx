import { Routes, Route } from 'react-router-dom';

import { CurrentGameProvider } from "./contexts/CurrentGameContext.jsx";

import LoginPage from "./pages/LoginPage";
import RegistrationPage from "./pages/RegistrationPage";
import HomePage from "./pages/HomePage.jsx";
import GamePage from "./pages/GamePage.jsx";
import StatsPage from "./pages/StatsPage.jsx";
import StorePage from "./pages/StorePage.jsx";

import "./App.css";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/register" element={<RegistrationPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/game" element={
        <CurrentGameProvider>
          <GamePage />
        </CurrentGameProvider>
      } />
      <Route path="/stats" element={<StatsPage />} />
      <Route path="/store" element={<StorePage />} />
    </Routes>
  );
};

export default App;