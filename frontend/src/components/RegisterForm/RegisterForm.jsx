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


import { useState, useContext } from "react";
import "./RegisterForm.css";
import Input from "../Input/Input";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../contexts/UserContext/UserContext";

const avatarOptions = [
  { label: "Assassin", src: "/Assassin_Avatar.png" },
  { label: "Cow", src: "/Cow_Avatar.png" },
  { label: "Xbox 360", src: "/Xbox360_Avatar_Background_Removed.png" },
  { label: "Xbox 360 Smiler", src: "/Xbox360_Smile_Avatar_Background_Removed.png" },
];

const RegisterForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState("");
  const navigate = useNavigate();
  const { login } = useContext(UserContext);

  const handleSubmitAsync = async (event) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    if (!selectedAvatar) {
      alert("Please choose an avatar");
      return;
    }

    const userData = {
      username,
      password,
      avatar: selectedAvatar,
    };

    const registerResponse = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (!registerResponse.ok) {
      const errorText = await registerResponse.text();
      console.error("Register failed:", registerResponse.status, errorText);
      alert(`Register failed (${registerResponse.status}): ${errorText}`);
      return;
    }

    // Auto-login after successful registration
    const loginResponse = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (loginResponse.ok) {
      const loginData = await loginResponse.json();

      login({
        ...loginData,
        avatar: loginData.avatar ?? selectedAvatar,
      });

      alert("User created successfully");
      navigate("/");
    } else {
      alert("User created, but auto-login failed");
      navigate("/login");
    }

    setUsername("");
    setPassword("");
    setConfirmPassword("");
    setSelectedAvatar("");
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

          <div className="avatar-picker">
            <p className="avatar-picker-label">CHOOSE YOUR AVATAR</p>

            <div className="avatar-grid">
              {avatarOptions.map((avatar) => (
                <button
                  key={avatar.src}
                  type="button"
                  className={`avatar-option ${selectedAvatar === avatar.src ? "selected" : ""}`}
                  onClick={() => setSelectedAvatar(avatar.src)}
                >
                  <img src={avatar.src} alt={avatar.label} />
                </button>
              ))}
            </div>
          </div>

          <Button className="register-submit-btn" type="submit">
            SIGN UP
          </Button>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;