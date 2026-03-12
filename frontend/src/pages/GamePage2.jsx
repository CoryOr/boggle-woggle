import "./Pages.css";
import { useNavigate } from 'react-router-dom';

export default function GamePage2() {
  
  const nav = useNavigate();

  const goHome = () => {
    nav("/")
  }
  
  return (
    <>
      <h1>This is the Multiplayer screen</h1>
      <button className="navButton" onClick={goHome}>Go back</button>
    </>
  )
}