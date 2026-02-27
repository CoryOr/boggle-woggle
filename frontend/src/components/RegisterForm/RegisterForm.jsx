import { useState } from "react";
import "./RegisterForm.css";

/**
 * NOTE: This is a temporary register page and should be adjusted in the future to be our actual login page. This page
 * and its corresponding css file are mostly ai generated just to be able to have something that doesn't look too
 * gross to the eye.
 */

const RegisterForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

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
      <form onSubmit={handleSubmitAsync}>
        <div>
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="confirm-password">Confirm Password</label>
          <input
            id="confirm-password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default RegisterForm;