/**
 * Store page containing microtransactions. We ain't actually developing this page
 */

import "./Pages.css";
import { useNavigate } from 'react-router-dom';

export default function StorePage() {
  const nav = useNavigate();
  
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