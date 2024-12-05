import { RegisterOptions, UseFormRegister } from "react-hook-form";
import InputMask from "react-input-mask";

interface InputProps {
  icon?: React.ReactNode;
  type: string;
  className: string;
  placeholder: string;
  name: string;
  register: UseFormRegister<any>;
  error?: string;
  rules?: RegisterOptions;
  mask?: string;
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
  mask,
}: InputProps) {
  return (
    <>
      <label className="input input-bordered flex items-center mt-2 mb-2">
        {icon && <span className="icon w-6 opacity-70">{icon}</span>}{" "}
        {mask ? (
          <InputMask
            mask={mask}
            maskChar={null}
            type={type}
            className={className}
            placeholder={placeholder}
            {...register(name, rules)}
            id={name}
          />
        ) : (
          <input
            type={type}
            className={className}
            placeholder={placeholder}
            {...register(name, rules)}
            id={name}
          />
        )}
      </label>
      {error && (
        <p className="text-red-400 font-bold font-mono mb-1">{error}</p>
      )}
    </>
  );
}
