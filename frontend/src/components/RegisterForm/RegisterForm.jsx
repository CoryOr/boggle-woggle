import { useState } from "react";
import "./RegisterForm.css";
import Input from "../Input/Input";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

/**
 * NOTE: This is a temporary register page and should be adjusted in the future to be our actual login page. This page
 * and its corresponding css file are mostly ai generated just to be able to have something that doesn't look too
 * gross to the eye.
 */

const RegisterForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmitAsync = async (event) => {
    event.preventDefault();

    if (password != confirmPassword) {
        alert("Passwords do not match");
        return;
    }

    const userData = {
      username: username,
      password: password
    };

    const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      console.log(response.status);
      
    if (response.ok) {
      alert("User created successfully");
    }
    else {
      alert("Something went wrong with inserting user");
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
        <Input
          type="Password"
          value={confirmPassword}
          placeholder="CONFIRM PASSWORD"
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <Button className="submit-btn" type="submit">SIGN UP</Button>
      </form>

      <div id="switch-to-login">
        <p>Already Have an Account?</p>
        <a onClick={() => navigate("/login")}>Click Here to Sign In!</a>
      </div>
    </div>
  );
};

export default RegisterForm;