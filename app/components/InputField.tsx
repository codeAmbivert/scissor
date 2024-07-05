interface InputProps {
  name: string;
  label?: string;
  type?: string;
  placeholder?: string;
  value?: any;
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
  onChange,
}: InputProps) => {
  return (
    <main
      className={`bg-gray-300 border-b-2 py-1 px-2 ${
        borderColor ? borderColor : "border-primary"
      }`}
    >
      {label && (
        <label htmlFor={name} className="text-primary text-xs">
          {label}
        </label>
      )}
      <input
        id={name}
        name={name}
        type={type || "text"}
        value={value}
        placeholder={placeholder}
        className="w-full border-none focus:outline-none text-black bg-transparent"
        onChange={onChange}
      />
    </main>
  );
};

export default InputField;
