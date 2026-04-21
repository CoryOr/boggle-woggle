import RegisterForm from "../components/RegisterForm/RegisterForm";
import "./Pages.css";
import { useContext, useEffect } from "react";
import { AudioContext } from "../contexts/AudioContext/AudioContextContext";

const RegistrationPage = () => {
  const { startMusic } = useContext(AudioContext);

  useEffect(() => {
    startMusic("/sounds/menu-music.mp3");
  }, [startMusic]);

  return (
    <div className="registrationPage">
      <RegisterForm />
    </div>
  );
};

export default RegistrationPage;