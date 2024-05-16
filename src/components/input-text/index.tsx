import { RegisterOptions, UseFormRegister } from "react-hook-form";

interface InputProps {
  icon?: React.ReactNode;
  type: string;
  className: string;
  placeholder: string;
  name: string;
  register: UseFormRegister<any>;
  error?: string;
  rules?: RegisterOptions;
}

export function InputText({
  icon,
  name,
  placeholder,
  type,
  register,
  rules,
  error,
  className,
}: InputProps) {
  return (
    <>
      <label className="input input-bordered flex items-center mt-2 mb-2">
        {icon && <span className="icon w-6 opacity-70">{icon}</span>}{" "}
        <input
          className={className}
          placeholder={placeholder}
          type={type}
          {...register(name, rules)}
          id={name}
        />
      </label>
      {error && <p className="text-red-500 my-1">{error}</p>}
    </>
  );
}
