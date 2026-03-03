import "./Input.css";
import { LuUserRound } from "react-icons/lu";
import { GoLock } from "react-icons/go";

const Input = ({ type, value, placeholder, onChange }) => {
  const Icon = type.toLowerCase() === "password" ? GoLock : LuUserRound;

  return (
    <div className="input-container">
      <Icon className="input-icon" />
      <input
        id={type}
        type={type.toLowerCase() === "password" ? "password" : "text"}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="input"
      />
    </div>
  );
};

export default Input;