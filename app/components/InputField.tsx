import { ReactNode } from "react";

interface InputProps {
  name: string;
  label?: string;
  type?: string;
  placeholder?: string;
  value?: any;
  error?: string;
  endIcon?: ReactNode;
  borderColor?: string;
  onChange: (value: any) => void;
}

const InputField = ({
  name,
  label,
  type,
  placeholder,
  value,
  borderColor,
  endIcon,
  error = "",
  onChange,
}: InputProps) => {
  return (
    <main>
      <div
        className={`bg-gray-300 border-b-2 py-1 px-2 ${
          error.length > 1
            ? "border-red-700"
            : borderColor
            ? borderColor
            : "border-gray-500"
        }`}
      >
        {label && (
          <label htmlFor={name} className="text-secondary text-xs">
            {label}
          </label>
        )}
        <div className="flex text-secondary items-center">
          <input
            id={name}
            name={name}
            type={type || "text"}
            value={value}
            placeholder={placeholder}
            className="w-full border-none focus:outline-none text-black bg-transparent"
            onChange={onChange}
          />
          {endIcon && <span>{endIcon}</span>}
        </div>
      </div>
      {error && <p className="text-red-700 text-xs mt-1">{error}</p>}
    </main>
  );
};

export default InputField;
