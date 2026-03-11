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
  // State variables for user input fields
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  // Handles form submission and registration request
  const handleSubmitAsync = async (event) => {
    event.preventDefault();

    // Ensure password and confirm password match
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    // Create request body for backend API
    const userData = {
      username: username,
      password: password,
    };

    // Send registration request to backend
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    // Display success/failure message
    if (response.ok) {
      alert("User created successfully");
    } else {
      alert("Something went wrong with inserting user");
    }

    // Clear the form after submission
    setUsername("");
    setPassword("");
    setConfirmPassword("");
  };

  return (
    <div id="register-form-container">
      {/* App logo displayed above the registration form */}
      <img id="app-logo" src="../../../LOGO.png" alt="Boggle Logo" />

      {/* Registration form */}
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

        <Input
          type="Password"
          value={confirmPassword}
          placeholder="CONFIRM PASSWORD"
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <Button className="submit-btn" type="submit">
          SIGN UP
        </Button>
      </form>
    </div>
  );
};

export default RegisterForm;