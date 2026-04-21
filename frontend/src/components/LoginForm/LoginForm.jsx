//LoginForm.jsx
import { useState, useContext } from "react";
import Input from "../Input/Input";
import "./LoginForm.css";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../contexts/UserContext/UserContext";
import { AudioContext } from "../../contexts/AudioContext/AudioContextContext";

const LoginForm = () => {
  const [usernameInput, setUsernameInput] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useContext(UserContext);
  const { playSfx } = useContext(AudioContext);

  const handleSubmitAsync = async (event) => {
    event.preventDefault();

    const userData = {
      username: usernameInput,
      password,
    };

    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    if (response.ok) {
      const data = await response.json();
      login(data);
      alert("Login Success");
      navigate("/");
    } else {
      alert("Login Failed");
    }

    setUsernameInput("");
    setPassword("");
  };

  return (
    <div id="login-form-container">
      <img id="app-logo" src="/LOGO.png" alt="Boggle Logo" />

      <form onSubmit={handleSubmitAsync}>
        <Input
          type="Username"
          value={usernameInput}
          placeholder="USERNAME"
          onChange={(e) => setUsernameInput(e.target.value)}
        />
        <Input
          type="Password"
          value={password}
          placeholder="PASSWORD"
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button
          className="submit-btn"
          type="submit"
          onClick={() => playSfx("/sounds/click.wav")}
        >
          LOGIN
        </Button>
      </form>

      <a id="forgot-password-link" href="#">
        Forgot password?
      </a>

      <div id="switch-to-registration">
        <p>New Here?</p>
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            playSfx("/sounds/click.wav");
            navigate("/register");
          }}
        >
          Click Here to Sign Up!
        </a>
      </div>
    </div>
  );
};

export default LoginForm;