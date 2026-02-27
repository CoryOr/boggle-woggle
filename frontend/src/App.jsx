import { useEffect } from "react";
import LoginForm from "./components/LoginForm/LoginForm";
import RegisterForm from "./components/RegisterForm/RegisterForm";
import "./App.css";

const App = () => {
  return (
    <div>
      <LoginForm />
      <RegisterForm />
    </div>
  );
}

export default App;