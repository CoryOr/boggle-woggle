import "./Pages.css";
import { useNavigate } from "react-router-dom";
import { FaHourglass } from "react-icons/fa";
import { Row, Col } from "react-bootstrap";
import GameBoard from "../components/GameBoard/GameBoard";

export default function GamePage() {
  const nav = useNavigate();

  const goHome = () => {
    nav("/");
  };

  return (
    <>
      <h1>DRAG OR TYPE LETTERS TO PLAY!</h1>
      <Row className="align-items-center">
        <Col xs="auto">
          <FaHourglass />
        </Col>
        <Col xs="auto">
          <p className="mb-0">2:52</p>
        </Col>
      </Row>
      <p>WORD: ____________________</p>
      <GameBoard />
      <button className="navButton" onClick={goHome}>
        Go back
      </button>
    </>
  );
}