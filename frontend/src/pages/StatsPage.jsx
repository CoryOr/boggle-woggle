import "./Pages.css";
import { useNavigate } from 'react-router-dom';
import StatsComponent from "../components/StatsPage/StatsComponent";

export default function StatsPage() {
  
  const nav = useNavigate();

  const goHome = () => {
    nav("/")
  }

  const titleStyle = {
    fontFamily: 'Montserrat, sans-serif', // Use camelCase for the property name
    fontWeight: '600'

  };

  return (
    <>
    <button className="stats-back-btn" onClick={goHome}>
            <div className="stats-back-arrow">←</div>
                BACK TO HOME
    </button>
    <h1 style={titleStyle}> STATISTICS </h1>
        <StatsComponent />
    </>
  )
}