import { RegisterOptions, UseFormRegister } from "react-hook-form";

interface SelectProps {
  name: string;
  className: string;
  register: UseFormRegister<any>;
  options: { value: string; label: string }[];
  placeholder?: string;
  rules?: RegisterOptions;
  error?: string;
}

export function Select({
  name,
  className,
  register,
  options,
  placeholder,
  rules,
  error,
}: SelectProps) {
  return (
    <>
      <select name={name} className={className} {...register(name, rules)}>
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="text-red-400 font-bold font-mono mb-1">{error}</p>
      )}
    </>
  );
}
