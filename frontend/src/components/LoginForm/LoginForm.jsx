import { useState } from "react";
import "./LoginForm.css";

/**
 * NOTE: This is a temporary login page and should be adjusted in the future to be our actual login page. This page
 * and its corresponding css file are mostly ai generated just to be able to have something that doesn't look too
 * gross to the eye.
 */

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmitAsync = async (event) => {
    event.preventDefault();
    const userData = {
      username: username,
      password: password
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
    }
    else {
      alert("Something Fail");
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
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginForm;