/**
 * RegisterForm.jsx
 *
 * Registration form component for creating a new Boggle account.
 *
 * Features:
 * - Accepts username, password, and confirm password input
 * - Validates that both password fields match
 * - Sends a POST request to the backend registration endpoint
 * - Clears input fields after submission
 *
 * Author(s): Alexander Ordonez / Boggle Woggle (t_3c)
 */

import { useState } from "react";
import "./RegisterForm.css";
import Input from "../Input/Input";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const RegisterForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmitAsync = async (event) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const userData = {
      username,
      password,
    };

    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (response.ok) {
      alert("User created successfully");
    } else {
      alert("Something went wrong with inserting user");
    }

    setUsername("");
    setPassword("");
    setConfirmPassword("");
  };

  return (
    <div id="register-page-wrapper">
      <button
        type="button"
        className="register-back-btn"
        onClick={() => navigate("/")}
      >
        <span className="register-back-arrow" aria-hidden="true">
          ←
        </span>
        <span className="register-back-text">BACK TO HOME</span>
      </button>

      <div id="register-form-shell">
        <img id="register-page-logo" src="/LOGO.png" alt="Boggle Logo" />

        <form className="register-form" onSubmit={handleSubmitAsync}>
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

          <Input
            type="Password"
            value={confirmPassword}
            placeholder="CONFIRM PASSWORD"
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <Button className="register-submit-btn" type="submit">
            SIGN UP
          </Button>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;