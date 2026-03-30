import "./Pages.css";
import { useNavigate } from 'react-router-dom';

export default function StorePage() {
  
  const nav = useNavigate();

  const goHome = () => {
    nav("/")
  }
  
  return (
    <>
    <button className="stats-back-btn" onClick={() => nav("/")}>
        <div className="stats-back-arrow">←</div>
        BACK
      </button>
      <h1 className="title">This is the store!</h1>
    </>
  )
}