import { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
}

export function InputText({ icon, ...props }: InputProps) {
  return (
    <label className="input input-bordered flex items-center mt-2 mb-2">
      {icon && <span className="icon w-6 opacity-70">{icon}</span>}{" "}
      <input {...props} />
    </label>
  );
}
