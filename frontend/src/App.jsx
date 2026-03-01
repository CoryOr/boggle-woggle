import { useEffect, useState } from "react";
import LoginForm from "./components/LoginForm/LoginForm";
import RegisterForm from "./components/RegisterForm/RegisterForm";
import Input from "./components/Input/Input";
import "./App.css";

const App = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div>
      {/* <LoginForm />
      <RegisterForm /> */}
      <Input 
        type="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <Input 
        type="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
    </div>
  );
};

export default App;
