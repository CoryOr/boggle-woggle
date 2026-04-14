import { Card } from "react-bootstrap";
import "./MultiplayerStyles.css";
import { FaCircleCheck } from "react-icons/fa6";

const PlayerCards = () => {
    const players = [
        {name: "Remi", avatar: "/Assassin_Avatar.png", isHost: true, isReady: false},
        {name: "Pranab", avatar: "/Assassin_Avatar.png", isHost: false, isReady: true},
        {name: "Alex", avatar: "/Assassin_Avatar.png", isHost: false, isReady: false},
        {name: "Luke", avatar: "/Assassin_Avatar.png", isHost: false, isReady: false},
        {name: "Nick", avatar: "/Assassin_Avatar.png", isHost: false, isReady: true},
    ];

    return (
        <div className="player-cards-container">
            {players.map(player => (
                <Card key={player.name} className="player-card">
                    <img src={player.avatar} className="avatar" />
                    <p className="player-name">{player.name}</p>
                    <FaCircleCheck className={`check ${player.isReady ? 'ready' : 'not-ready'}`} />
                </Card>
            ))}
        </div>
    );
}

export default PlayerCards;