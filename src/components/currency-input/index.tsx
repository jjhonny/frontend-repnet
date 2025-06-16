import { RegisterOptions, UseFormRegister, UseFormSetValue } from "react-hook-form";
import { useCurrencyInput } from "@/hooks/useCurrencyInput";
import { useEffect } from "react";

interface CurrencyInputProps {
  icon?: React.ReactNode;
  className: string;
  placeholder: string;
  name: string;
  register: UseFormRegister<any>;
  setValue: UseFormSetValue<any>;
  error?: string;
  rules?: RegisterOptions;
  initialValue?: string;
}

export function CurrencyInput({
  icon,
  name,
  placeholder,
  register,
  setValue,
  rules,
  error,
  className,
  initialValue = '',
}: CurrencyInputProps) {
  const { displayValue, rawValue, handleChange, setDisplayValue } = useCurrencyInput();

  // Atualizar o valor do formulário sempre que rawValue mudar
  useEffect(() => {
    if (rawValue) {
      setValue(name, rawValue);
    }
  }, [rawValue, name, setValue]);

  // Inicializar com valor inicial quando carregado (para edição)
  useEffect(() => {
    if (initialValue && initialValue !== '0') {
      const normalizedValue = initialValue.replace(',', '.');
      const amount = parseFloat(normalizedValue);
      if (!isNaN(amount)) {
        const formatted = amount.toLocaleString('pt-BR', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
        setDisplayValue(formatted);
        setValue(name, initialValue);
      }
    }
  }, [initialValue, setDisplayValue, setValue, name]);

  return (
    <>
      <label className="input input-bordered flex items-center mt-2 mb-2">
        {icon && <span className="icon w-6 opacity-70">{icon}</span>}
        <input
          type="text"
          className={className}
          placeholder={placeholder}
          value={displayValue}
          onChange={(e) => handleChange(e.target.value)}
          id={name}
        />
        {/* Hidden input para o react-hook-form */}
        <input
          type="hidden"
          {...register(name, rules)}
          value={rawValue}
        />
      </label>
      {error && (
        <p className="text-red-400 font-bold font-mono mb-1">{error}</p>
      )}
    </>
  );
} 