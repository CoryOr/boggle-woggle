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
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmitAsync = async (event) => {
        event.preventDefault();

        const userData = {
            username,
            password,
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
            alert("Login Failed");
        }

        setUsername("");
        setPassword("");
    };

    return (
        <div id="login-page">
            <button
                type="button"
                className="login-back-btn"
                onClick={() => navigate("/")}
            >
                <span className="login-back-arrow" aria-hidden="true">
                    ←
                </span>
                <span className="login-back-text">BACK TO HOME</span>
            </button>

            <div id="login-form-container">
                <img id="app-logo" src="/LOGO.png" alt="Boggle Logo" />

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

                <a id="forgot-password-link" href="#">
                    Forgot password?
                </a>

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
            </div>
        </div>
    );
};

export default LoginForm;