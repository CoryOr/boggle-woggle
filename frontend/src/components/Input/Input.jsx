/**
 * Input.jsx
 *
 * Reusable input field component for authentication forms.
 *
 * Features:
 * - Displays an icon based on input type
 * - Uses a user icon for username/text fields
 * - Uses a lock icon for password fields
 * - Accepts controlled input props from parent components
 *
 * Props:
 * - type: input label/type selector
 * - value: current input value
 * - placeholder: placeholder text shown in the input
 * - onChange: function called when input value changes
 *
 * Author(s): Alexander Ordonez / Boggle Woggle (t_3c)
 */

import "./Input.css";
import { LuUserRound } from "react-icons/lu";
import { GoLock } from "react-icons/go";

const Input = ({ type, value, placeholder, onChange }) => {
  // Choose icon based on input type
  const Icon = type.toLowerCase() === "password" ? GoLock : LuUserRound;

  return (
    <div className="input-container">
      {/* Icon displayed inside the input field */}
      <Icon className="input-icon" />

      {/* Controlled input field */}
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