import { Card, CardHeader, CardBody } from "react-bootstrap";
import "./MultiplayerStyles.css";

const RoomCodeCard = ({ roomCode }) => {
  return (
    <Card className="code-card">
      <CardHeader>Room Code</CardHeader>
      <CardBody>{roomCode}</CardBody>
    </Card>
  );
};

export default RoomCodeCard;
