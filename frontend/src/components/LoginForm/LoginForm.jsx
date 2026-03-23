/**
 * LoginForm.jsx
 *
 * Login form component for authenticating a Boggle user.
 *
 * Features:
 * - Accepts username and password input
 * - Sends a POST request to the backend login endpoint
 * - Clears input fields after submission
 * - Provides navigation to the registration page
 *
 * Author(s): Alexander Ordonez, Pranab Adhikari / Boggle Woggle (t_3c)
 */
import { useState } from "react";
import Input from "../Input/Input";
import "./LoginForm.css";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
    // State variables for login form inputs
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    // Handles login form submission
    const handleSubmitAsync = async (event) => {
        event.preventDefault();
        // Build request payload for backend authentication
        const userData = {
            username,
            password,
        };

        // Send login request to backend API
        const response = await fetch("/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
        });

        // Show success or failure alert
        if (response.ok) {
            alert("Login Success");
        } else {
            alert("Login Failed");
        }

        // Clear form fields after submission
        setUsername("");
        setPassword("");
    };

    return (
        <div id="login-form-container">
            {/* logo displayed above the login form */}
            <img id="app-logo" src="/LOGO.png" alt="Boggle Logo" />

            {/* Login form */}
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
                <Button className="submit-btn" type="submit">
                    LOGIN
                </Button>
            </form>

            {/* Password recovery link */}
            <a id="forgot-password-link" href="#">
                Forgot password?
            </a>

            {/* Registration redirect section */}
            <div id="switch-to-registration">
                <p>New Here?</p>
                <a
                    href="#"
                    onClick={(e) => {
                        e.preventDefault();
                        navigate("/register");
                    }}
                >
                    Click Here to Sign Up!
                </a>
            </div>

            {/* Added for Issue #57 */}
            <Button
                variant="secondary"
                className="submit-btn go-back-btn"
                onClick={() => navigate("/")}
            >
                GO BACK TO HOME
            </Button>
        </div>
    );
};

export default LoginForm;