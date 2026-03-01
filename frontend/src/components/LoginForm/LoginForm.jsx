import { useState } from "react";
import Input from "../Input/Input";
import "./LoginForm.css";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

/**
 * NOTE: This is a temporary login page and should be adjusted in the future to be our actual login page. This page
 * and its corresponding css file are mostly ai generated just to be able to have something that doesn't look too
 * gross to the eye.
 */

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmitAsync = async (event) => {
    event.preventDefault();
    const userData = {
      username: username,
      password: password,
    };

    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (response.ok) {
      alert("Login Success");
    } else {
      alert("Something Fail");
    }
  };

  return (
    <div id="login-form-container">
      <img id="app-logo" src="../../../LOGO.png" alt="Boggle Logo" />
      <form onSubmit={handleSubmitAsync}>
        <Input
          type="Username"
          value={username}
          placeholder="USERNAME"
          onChange={(e) => setUsername(e.target.value)}
        />
        <Input
          type="Password"
          value={password}
          placeholder="PASSWORD"
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button className="submit-btn" type="submit">LOG IN</Button>
      </form>

      <a id="forgot-password-link">Forgot password?</a>

      <div id="switch-to-registration">
        <p>New Here?</p>
        <a onClick={() => navigate("/register")}>Click Here to Sign Up!</a>
      </div>
    </div>
  );
};

export default LoginForm;
