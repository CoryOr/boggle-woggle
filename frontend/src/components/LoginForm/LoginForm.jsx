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
import { useState, useContext } from "react";
import Input from "../Input/Input";
import "./LoginForm.css";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../contexts/UserContext/UserContext";

const LoginForm = () => {
    const [usernameInput, setUsernameInput] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const { login } = useContext(UserContext);

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
            {/* logo displayed above the login form */}
            <img id="app-logo" src="/LOGO.png" alt="Boggle Logo" />

            {/* Login form */}
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