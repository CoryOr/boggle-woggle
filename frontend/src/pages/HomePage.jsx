import "./Pages.css";
import { useNavigate } from 'react-router-dom';

export default function HomePage() {
  
  const nav = useNavigate();

  const login = () => {
    nav("/login")
  }

  const playGame = () => {
    nav("/game")
  }

  const stats = () => {
    nav("stats")
  }

  const store = () => {
    nav("store")
  }
  
  return (
    <div className="page">
      <button className="loginButton" onClick={login}>Login</button>
      <h1 className="title-text">Welcome to Boggle!</h1>
      <div className="button-container">
        <button className="navButton" onClick={playGame}>Play a game!</button>
        <button className="navButton" onClick={stats}>Statistics</button>
        <button className="navButton" onClick={store}>Store</button>
      </div>
    </div>
  )
}