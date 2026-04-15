import { Card } from "react-bootstrap";
import "./MultiplayerStyles.css";
import { FaCircleCheck, FaCircleH } from "react-icons/fa6";

const PlayerCards = ({ players }) => {
    console.log(players);
    return (
        <div className="player-cards-container">
            {players.map(player => (
                <Card key={player.name} className="player-card">
                    <img src={player.avatar} className="avatar" />
                    <p className="player-name">{player.username}</p>
                    {player.isHost && <FaCircleH className="host-icon" /> }
                    <FaCircleCheck className={`check ${player.isReady ? 'ready' : 'not-ready'}`} />
                </Card>
            ))}
        </div>
    );
}

export default PlayerCards;