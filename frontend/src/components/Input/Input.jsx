import "./Input.css";

const Input = ({ type, value, onChange }) => {
    return (
        <div>
          <input
            id={type}
            type="text"
            value={value}
            onChange={onChange}
            placeholder={type}
            className={`${type.toLowerCase()} input`}
          />
        </div>
    );
}

export default Input;